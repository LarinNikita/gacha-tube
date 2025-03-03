'use client';

import { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { VideoPlayer } from '../components/video-player';
import { VideoBanner } from '../components/video-banner';
import { VideoTopRow } from '../components/video-top-row';

import { cn } from '@/lib/utils';

import { trpc } from '@/trpc/client';

interface VideoSectionProps {
    videoId: string;
}

export const VideoSection = ({ videoId }: VideoSectionProps) => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ErrorBoundary fallback={<p>Something went wrong</p>}>
                <VideoSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    );
};

const VideoSectionSuspense = ({ videoId }: VideoSectionProps) => {
    const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });

    return (
        <>
            <div
                className={cn(
                    'relative aspect-video overflow-hidden rounded-xl bg-black',
                    video.muxStatus !== 'ready' && 'rounded-b-none',
                )}
            >
                <VideoPlayer
                    autoPlay
                    onPlay={() => {}}
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                />
            </div>
            <VideoBanner status={video.muxStatus} />
            <VideoTopRow video={video} />
        </>
    );
};
