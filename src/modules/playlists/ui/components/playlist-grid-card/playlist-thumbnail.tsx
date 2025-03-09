import { useMemo } from 'react';

import Image from 'next/image';
import { ListVideoIcon, PlayIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { THUMBNAIL_FALLBACK } from '@/modules/videos/constants';

import { Skeleton } from '@/components/ui/skeleton';

interface PlaylistThumbnailProps {
    imageUrl?: string | null;
    title: string;
    videoCount: number;
    className?: string;
}

export const PlaylistThumbnailSkeleton = () => {
    return (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <Skeleton className="size-full" />
        </div>
    );
};

export const PlaylistThumbnail = ({
    imageUrl,
    title,
    videoCount,
    className,
}: PlaylistThumbnailProps) => {
    const compactViews = useMemo(() => {
        return Intl.NumberFormat('en', {
            notation: 'compact',
        }).format(videoCount);
    }, [videoCount]);

    return (
        <div className={cn('relative pt-3', className)}>
            {/* Stack effect layers */}
            <div className="relative">
                {/* Background layers */}
                <div className="absolute -top-3 left-1/2 aspect-video w-[97%] -translate-x-1/2 overflow-hidden rounded-xl bg-black/20" />
                <div className="absolute -top-1.5 left-1/2 aspect-video w-[98.5%] -translate-x-1/2 overflow-hidden rounded-xl bg-black/25" />
                {/* Main image */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                    <Image
                        src={imageUrl || THUMBNAIL_FALLBACK}
                        alt={title}
                        fill
                        className="size-full object-cover"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex items-center gap-x-2">
                            <PlayIcon className="size-4 fill-white text-white" />
                            <span className="font-medium text-white">
                                Play all
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Video count indicator */}
            <div className="absolute bottom-2 right-2 flex items-center gap-x-1 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white">
                <ListVideoIcon className="size-4" />
                {compactViews} videos
            </div>
        </div>
    );
};
