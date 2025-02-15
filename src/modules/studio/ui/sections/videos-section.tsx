'use client';

import { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { DEFAULT_LIMIT } from '@/constants';

import { trpc } from '@/trpc/client';

import { InfiniteScroll } from '@/components/infinite-scroll';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

export const VideosSection = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ErrorBoundary fallback={<p>Something went wrong</p>}>
                <VideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
};

const VideosSectionSuspense = () => {
    const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
        {
            limit: DEFAULT_LIMIT,
        },
        {
            getNextPageParam: lastPage => lastPage.nextCursor,
        },
    );

    return (
        <div className="">
            <div className="border-y">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[510px] pl-6">
                                Video
                            </TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                            <TableHead className="text-right">
                                Comments
                            </TableHead>
                            <TableHead className="pr-6 text-right">
                                Likes
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.pages
                            .flatMap(page => page.items)
                            .map(video => (
                                <Link
                                    href={`studio/video/${video.id}`}
                                    key={video.id}
                                    legacyBehavior
                                >
                                    <TableRow className="cursor-pointer">
                                        <TableCell>{video.title}</TableCell>
                                        <TableCell>visibility</TableCell>
                                        <TableCell>status</TableCell>
                                        <TableCell>date</TableCell>
                                        <TableCell>views</TableCell>
                                        <TableCell>comments</TableCell>
                                        <TableCell>likes</TableCell>
                                    </TableRow>
                                </Link>
                            ))}
                    </TableBody>
                </Table>
            </div>
            <InfiniteScroll
                isManual
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
            />
        </div>
    );
};
