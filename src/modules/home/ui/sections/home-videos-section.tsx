'use client';

import { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { DEFAULT_LIMIT } from '@/constants';

import {
    VideoGridCard,
    VideoGridCardSkeleton,
} from '@/modules/videos/ui/components/video-grid-card';

import { trpc } from '@/trpc/client';

import { InfiniteScroll } from '@/components/infinite-scroll';

interface HomeVideosSectionProps {
    categoryId?: string;
}

export const HomeVideosSection = (props: HomeVideosSectionProps) => {
    return (
        <Suspense
            key={props.categoryId}
            fallback={<HomeVideosSectionSkeleton />}
        >
            <ErrorBoundary fallback={<p>Something went wrong...</p>}>
                <HomeVideosSectionSuspense {...props} />
            </ErrorBoundary>
        </Suspense>
    );
};

const HomeVideosSectionSkeleton = () => {
    return (
        <div className="grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
            {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
                <VideoGridCardSkeleton key={index} />
            ))}
        </div>
    );
};

const HomeVideosSectionSuspense = ({ categoryId }: HomeVideosSectionProps) => {
    const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
        { categoryId, limit: DEFAULT_LIMIT },
        {
            getNextPageParam: lastPage => lastPage.nextCursor,
        },
    );

    return (
        <div>
            <div className="grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
                {videos.pages
                    .flatMap(page => page.items)
                    .map(video => (
                        <VideoGridCard key={video.id} data={video} />
                    ))}
            </div>
            <InfiniteScroll
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
            />
        </div>
    );
};
