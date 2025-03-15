'use client';

import { Suspense } from 'react';

import { toast } from 'sonner';
import { Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';

import { trpc } from '@/trpc/client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface PlaylistHeaderSectionProps {
    playlistId: string;
}

export const PlaylistHeaderSection = ({
    playlistId,
}: PlaylistHeaderSectionProps) => {
    return (
        <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Something went wrong...</p>}>
                <PlaylistHeaderSectionSuspense playlistId={playlistId} />
            </ErrorBoundary>
        </Suspense>
    );
};

export const PlaylistHeaderSectionSkeleton = () => {
    return (
        <div className="flex flex-col gap-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
        </div>
    );
};

const PlaylistHeaderSectionSuspense = ({
    playlistId,
}: PlaylistHeaderSectionProps) => {
    const [playlist] = trpc.playlists.getOne.useSuspenseQuery({
        id: playlistId,
    });

    const router = useRouter();
    const utils = trpc.useUtils();
    const remove = trpc.playlists.remove.useMutation({
        onSuccess: () => {
            toast.success('Playlist removed');
            utils.playlists.getMany.invalidate();
            router.push('/playlists');
        },
        onError: () => {
            toast.error('Something went wrong');
        },
    });

    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">{playlist.name}</h1>
                <p className="text-muted-foreground text-xs">
                    Videos from playlist
                </p>
            </div>
            <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => remove.mutate({ id: playlistId })}
                disabled={remove.isPending}
            >
                <Trash2Icon />
            </Button>
        </div>
    );
};
