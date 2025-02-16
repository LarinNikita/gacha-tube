import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import {
    VideoAssetCreatedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent,
    VideoAssetTrackReadyWebhookEvent,
} from '@mux/mux-node/resources/webhooks';

import { db } from '@/db';
import { videos } from '@/db/schema';

import { mux } from '@/lib/mux';

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type WebhookEvent =
    | VideoAssetCreatedWebhookEvent
    | VideoAssetErroredWebhookEvent
    | VideoAssetReadyWebhookEvent
    | VideoAssetTrackReadyWebhookEvent;

export const POST = async (request: Request) => {
    if (!SIGNING_SECRET) {
        throw new Error(
            '[❌] Error: Please add MUX_WEBHOOK_SECRET to .env.local',
        );
    }

    const headersPayload = await headers();
    const muxSignature = headersPayload.get('mux-signature');

    if (!muxSignature) {
        return new Response('No signature found', {
            status: 400,
        });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    mux.webhooks.verifySignature(
        body,
        {
            'mux-signature': muxSignature,
        },
        SIGNING_SECRET,
    );

    switch (payload.type as WebhookEvent['type']) {
        case 'video.asset.created': {
            const data = payload.data as VideoAssetCreatedWebhookEvent['data'];

            if (!data.upload_id) {
                return new Response('No upload Id found', {
                    status: 400,
                });
            }

            await db
                .update(videos)
                .set({
                    muxAssetId: data.id,
                    muxStatus: data.status,
                })
                .where(eq(videos.muxUploadId, data.upload_id));

            break;
        }
    }

    return new Response('[✔] Success: Webhook received', {
        status: 200,
    });
};
