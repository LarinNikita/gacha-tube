import Link from 'next/link';
import { useAuth, useClerk } from '@clerk/nextjs';

import { useSubscription } from '@/hooks/use-subscription';

import { cn } from '@/lib/utils';

import { SubscriptionButton } from '@/modules/subscriptions/ui/components/subscription-button';

import { UserGetOneOutput } from '../../types';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar } from '@/components/user-avatar';

interface UserPageInfoProps {
    user: UserGetOneOutput;
}

export const UserPageInfoSkeleton = () => {
    return (
        <div className="py-6">
            {/* Mobile layout */}
            <div className="flex flex-col md:hidden">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-[60px] rounded-full" />
                    <div className="min-w-0 flex-1">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="mt-1 h-4 w-48" />
                    </div>
                </div>
                <Skeleton className="mt-3 h-10 w-full rounded-full" />
            </div>

            {/* Desktop layout */}
            <div className="hidden items-start gap-4 md:flex">
                <Skeleton className="size-[160px] rounded-full" />
                <div className="min-w-0 flex-1">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="mt-4 h-5 w-48" />
                    <Skeleton className="mt-3 h-10 w-full rounded-full" />
                </div>
            </div>
        </div>
    );
};

export const UserPageInfo = ({ user }: UserPageInfoProps) => {
    const { userId, isLoaded } = useAuth();
    const clerk = useClerk();

    const { isPending, onClick } = useSubscription({
        userId: user.id,
        isSubscribed: user.viewerSubscribed,
    });

    return (
        <div className="py-6">
            {/* Mobile layout */}
            <div className="flex flex-col md:hidden">
                <div className="flex items-center gap-3">
                    <UserAvatar
                        size="lg"
                        imageUrl={user.imageUrl}
                        name={user.name}
                        className="size-[60px]"
                        onClick={() => {
                            if (userId === user.clerkId) {
                                clerk.openUserProfile();
                            }
                        }}
                    />
                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl font-bold">{user.name}</h1>
                        <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                            <span>{user.subscriberCount} subscribers</span>
                            <span>&bull;</span>
                            <span>{user.videoCount} videos</span>
                        </div>
                    </div>
                </div>
                {userId === user.clerkId ? (
                    <Button
                        variant="secondary"
                        asChild
                        className="mt-3 w-full rounded-full"
                    >
                        <Link prefetch href={'/studio'}>
                            Go to Studio
                        </Link>
                    </Button>
                ) : (
                    <SubscriptionButton
                        disabled={isPending || !isLoaded}
                        isSubscribed={user.viewerSubscribed}
                        onClick={onClick}
                        className="mt-3 w-full rounded-full"
                    />
                )}
            </div>

            {/* Desktop layout */}
            <div className="hidden items-start gap-4 md:flex">
                <UserAvatar
                    size="xl"
                    imageUrl={user.imageUrl}
                    name={user.name}
                    className={cn(
                        userId === user.clerkId &&
                            'cursor-pointer transition-opacity duration-300 hover:opacity-80',
                    )}
                    onClick={() => {
                        if (userId === user.clerkId) {
                            clerk.openUserProfile();
                        }
                    }}
                />
                <div className="min-w-0 flex-1">
                    <h1 className="text-4xl font-bold">{user.name}</h1>
                    <div className="text-muted-foreground mt-3 flex items-center gap-1 text-sm">
                        <span>{user.subscriberCount} subscribers</span>
                        <span>&bull;</span>
                        <span>{user.videoCount} videos</span>
                    </div>

                    {userId === user.clerkId ? (
                        <Button
                            variant="secondary"
                            asChild
                            className="mt-3 rounded-full"
                        >
                            <Link prefetch href={'/studio'}>
                                Go to Studio
                            </Link>
                        </Button>
                    ) : (
                        <SubscriptionButton
                            disabled={isPending || !isLoaded}
                            isSubscribed={user.viewerSubscribed}
                            onClick={onClick}
                            className="mt-3 rounded-full"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
