'use client';

import { Suspense } from 'react';

import Link from 'next/link';
import { toast } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';

import {
    SubscriptionItem,
    SubscriptionItemSkeleton,
} from '../components/subscription-item';

import { DEFAULT_LIMIT } from '@/constants';

import { trpc } from '@/trpc/client';

import { InfiniteScroll } from '@/components/infinite-scroll';

export const SubscriptionsSection = () => {
    return (
        <Suspense fallback={<SubscriptionsSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Something went wrong...</p>}>
                <SubscriptionsSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
};

const SubscriptionsSectionSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
                <SubscriptionItemSkeleton key={index} />
            ))}
        </div>
    );
};

const SubscriptionsSectionSuspense = () => {
    const utils = trpc.useUtils();
    const [subscriptions, query] =
        trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
            { limit: DEFAULT_LIMIT },
            {
                getNextPageParam: lastPage => lastPage.nextCursor,
            },
        );

    const unsubscribe = trpc.subscriptions.remove.useMutation({
        onSuccess: data => {
            toast.success('Unsubscribed');
            utils.videos.getManySubscribed.invalidate();
            utils.users.getOne.invalidate({ id: data.creatorId });
            utils.subscriptions.getMany.invalidate();
        },
        onError: () => {
            toast.error("You're not signed in");
        },
    });

    return (
        <div>
            <div className="flex flex-col gap-4">
                {subscriptions.pages
                    .flatMap(page => page.items)
                    .map(subscription => (
                        <Link
                            prefetch
                            key={subscription.creatorId}
                            href={`/users/${subscription.user.id}`}
                        >
                            <SubscriptionItem
                                name={subscription.user.name}
                                imageUrl={subscription.user.imageUrl}
                                subscriberCount={
                                    subscription.user.subscriberCount
                                }
                                onUnsubscribe={() =>
                                    unsubscribe.mutate({
                                        userId: subscription.creatorId,
                                    })
                                }
                                disabled={unsubscribe.isPending}
                            />
                        </Link>
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
