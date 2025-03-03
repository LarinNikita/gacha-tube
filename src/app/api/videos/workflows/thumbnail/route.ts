import { and, eq } from 'drizzle-orm';
import { UTApi } from 'uploadthing/server';
import { serve } from '@upstash/workflow/nextjs';

import { db } from '@/db';
import { videos } from '@/db/schema';

interface InputType {
    userId: string;
    videoId: string;
    prompt: string;
}

export const { POST } = serve(async context => {
    const utapi = new UTApi();
    const input = context.requestPayload as InputType;
    const { videoId, userId, prompt } = input;

    const video = await context.run('get-video', async () => {
        const [existingVideo] = await db
            .select()
            .from(videos)
            .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

        if (!existingVideo) {
            throw new Error('No video found');
        }

        return existingVideo;
    });

    const width = 1792;
    const height = 1024;
    const seed = Math.floor(Math.random() * 1000000);
    const model = 'flux'; // Or turbo

    const tempThumbnailUrl = await context.run(
        'generate-thumbnail',
        async () => {
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=true&enhance=false`;

            return imageUrl;
        },
    );

    if (!tempThumbnailUrl) {
        throw new Error('Bad request');
    }

    await context.run('cleanup-thumbnail', async () => {
        if (video.thumbnailKey) {
            await utapi.deleteFiles(video.thumbnailKey);
            await db
                .update(videos)
                .set({ thumbnailKey: null, thumbnailUrl: null })
                .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
        }
    });

    const uploadedThumbnail = await context.run(
        'upload-thumbnail',
        async () => {
            const { data } = await utapi.uploadFilesFromUrl(tempThumbnailUrl);

            if (!data) {
                throw new Error('Bad request');
            }

            return data;
        },
    );

    await context.run('update-video', async () => {
        await db
            .update(videos)
            .set({
                thumbnailUrl: uploadedThumbnail.url,
                thumbnailKey: uploadedThumbnail.key,
            })
            .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    });
});
