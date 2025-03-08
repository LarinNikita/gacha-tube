'use client';

import { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { DEFAULT_LIMIT } from '@/constants';

import { useIsMobile } from '@/hooks/use-mobile';

import {
    VideoRowCard,
    VideoRowCardSkeleton,
} from '@/modules/videos/ui/components/video-row-card';
import {
    VideoGridCard,
    VideoGridCardSkeleton,
} from '@/modules/videos/ui/components/video-grid-card';

import { trpc } from '@/trpc/client';

import { InfiniteScroll } from '@/components/infinite-scroll';

interface ResultsSectionProps {
    query: string | undefined;
    categoryId: string | undefined;
}

export const ResultsSection = ({ query, categoryId }: ResultsSectionProps) => {
    return (
        <Suspense
            key={`${query}-${categoryId}`}
            fallback={<ResultsSectionSkeleton />}
        >
            <ErrorBoundary fallback={<p>Something went wrong...</p>}>
                <ResultsSectionSuspense query={query} categoryId={categoryId} />
            </ErrorBoundary>
        </Suspense>
    );
};

const ResultsSectionSkeleton = () => {
    return (
        <div>
            <div className="hidden space-y-4 md:block">
                {Array.from({ length: 6 }).map((_, index) => (
                    <VideoRowCardSkeleton key={index} />
                ))}
            </div>
            <div className="flex flex-col gap-4 gap-y-10 p-4 pt-6 md:hidden">
                {Array.from({ length: 6 }).map((_, index) => (
                    <VideoGridCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
};

const ResultsSectionSuspense = ({ query, categoryId }: ResultsSectionProps) => {
    const isMobile = useIsMobile();

    const [results, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
        { query, categoryId, limit: DEFAULT_LIMIT },
        {
            getNextPageParam: lastPage => lastPage.nextCursor,
        },
    );

    return (
        <>
            {isMobile ? (
                <div className="flex flex-col gap-4 gap-y-10">
                    {results.pages
                        .flatMap(page => page.items)
                        .map(video => (
                            <VideoGridCard key={video.id} data={video} />
                        ))}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {results.pages
                        .flatMap(page => page.items)
                        .map(video => (
                            <VideoRowCard key={video.id} data={video} />
                        ))}
                </div>
            )}
            <InfiniteScroll
                hasNextPage={resultQuery.hasNextPage}
                fetchNextPage={resultQuery.fetchNextPage}
                isFetchingNextPage={resultQuery.isFetchingNextPage}
            />
        </>
    );
};
