import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { UTApi } from 'uploadthing/server';
import { and, eq, getTableColumns, inArray } from 'drizzle-orm';

import { db } from '@/db';
import {
    users,
    videoReactions,
    videos,
    videoUpdateSchema,
    videoViews,
} from '@/db/schema';

import { mux } from '@/lib/mux';
import { workflow } from '@/lib/workflow';

import {
    baseProcedure,
    createTRPCRouter,
    protectedProcedure,
} from '@/trpc/init';

export const videosRouter = createTRPCRouter({
    create: protectedProcedure.mutation(async ({ ctx }) => {
        const { id: userId } = ctx.user;

        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: userId,
                playback_policy: ['public'],
                // mp4_support: 'standard', //* In free plans, this is not available
                input: [
                    {
                        generated_subtitles: [
                            {
                                language_code: 'en',
                                name: 'English',
                            },
                            {
                                language_code: 'ru',
                                name: 'Russian',
                            },
                        ],
                    },
                ],
            },
            cors_origin: '*', // TODO: In production, this should be an actual URL
        });

        const [video] = await db
            .insert(videos)
            .values({
                userId,
                title: 'Untitled',
                muxStatus: 'waiting',
                muxUploadId: upload.id,
            })
            .returning();

        return { video: video, url: upload.url };
    }),
    getOne: baseProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ input, ctx }) => {
            const { clerkUserId } = ctx;

            let userId;

            const [user] = await db
                .select()
                .from(users)
                .where(
                    inArray(users.clerkId, clerkUserId ? [clerkUserId] : []),
                );

            if (user) {
                userId = user.id;
            }

            const viewerReactions = db.$with('viewer_reactions').as(
                db
                    .select({
                        videoId: videoReactions.videoId,
                        type: videoReactions.type,
                    })
                    .from(videoReactions)
                    .where(
                        inArray(videoReactions.userId, userId ? [userId] : []),
                    ),
            );

            const [existingVideo] = await db
                .with(viewerReactions)
                .select({
                    ...getTableColumns(videos),
                    user: {
                        ...getTableColumns(users),
                    },
                    viewCount: db.$count(
                        videoViews,
                        eq(videoViews.videoId, videos.id),
                    ),
                    likeCount: db.$count(
                        videoReactions,
                        and(
                            eq(videoReactions.videoId, videos.id),
                            eq(videoReactions.type, 'like'),
                        ),
                    ),
                    dislikeCount: db.$count(
                        videoReactions,
                        and(
                            eq(videoReactions.videoId, videos.id),
                            eq(videoReactions.type, 'dislike'),
                        ),
                    ),
                    viewerReaction: viewerReactions.type,
                })
                .from(videos)
                .innerJoin(users, eq(videos.userId, users.id))
                .leftJoin(
                    viewerReactions,
                    eq(viewerReactions.videoId, videos.id),
                )
                .where(eq(videos.id, input.id));
            // .groupBy(videos.id, users.id, viewerReactions.type); //? Test this

            if (!existingVideo) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            return existingVideo;
        }),
    update: protectedProcedure
        .input(videoUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;

            if (!input.id) {
                throw new TRPCError({ code: 'BAD_REQUEST' });
            }

            const [updatedVideo] = await db
                .update(videos)
                .set({
                    title: input.title,
                    description: input.description,
                    categoryId: input.categoryId,
                    visibility: input.visibility,
                    updatedAt: new Date(),
                })
                .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
                .returning();

            if (!updatedVideo) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            return updatedVideo;
        }),
    remove: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;

            const [removedVideo] = await db
                .delete(videos)
                .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
                .returning();

            if (!removedVideo) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            return removedVideo;
        }),
    generateTitle: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;

            const { workflowRunId } = await workflow.trigger({
                url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
                body: { userId, videoId: input.id },
                retries: 3,
            });

            return workflowRunId;
        }),
    generateDescription: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;

            const { workflowRunId } = await workflow.trigger({
                url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/description`,
                body: { userId, videoId: input.id },
                retries: 3,
            });

            return workflowRunId;
        }),
    generateThumbnail: protectedProcedure
        .input(z.object({ id: z.string().uuid(), prompt: z.string().min(10) }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;

            const { workflowRunId } = await workflow.trigger({
                url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/thumbnail`,
                body: { userId, videoId: input.id, prompt: input.prompt },
                retries: 3,
            });

            return workflowRunId;
        }),
    restoreThumbnail: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;

            const [existingVideo] = await db
                .select()
                .from(videos)
                .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));

            if (!existingVideo) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            if (existingVideo.thumbnailKey) {
                const utapi = new UTApi();

                await utapi.deleteFiles(existingVideo.thumbnailKey);
                await db
                    .update(videos)
                    .set({ thumbnailKey: null, thumbnailUrl: null })
                    .where(
                        and(eq(videos.id, input.id), eq(videos.userId, userId)),
                    );
            }

            if (!existingVideo.muxPlaybackId) {
                throw new TRPCError({ code: 'BAD_REQUEST' });
            }

            const utapi = new UTApi();

            const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;
            const uploadedThumbnail =
                await utapi.uploadFilesFromUrl(tempThumbnailUrl);

            if (!uploadedThumbnail.data) {
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
            }

            const { key: thumbnailKey, url: thumbnailUrl } =
                uploadedThumbnail.data;

            const [updatedVideo] = await db
                .update(videos)
                .set({ thumbnailUrl, thumbnailKey })
                .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
                .returning();

            return updatedVideo;
        }),
});
