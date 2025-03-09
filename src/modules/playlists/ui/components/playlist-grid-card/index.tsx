import Link from 'next/link';

import { THUMBNAIL_FALLBACK } from '@/modules/videos/constants';
import { PlaylistGetManyOutput } from '@/modules/playlists/types';

import { PlaylistInfo, PlaylistInfoSkeleton } from './playlist-info';
import {
    PlaylistThumbnail,
    PlaylistThumbnailSkeleton,
} from './playlist-thumbnail';

interface PlaylistsGridCardProps {
    data: PlaylistGetManyOutput['items'][number];
}

export const PlaylistsGridCardSkeleton = () => {
    return (
        <div className="flex w-full flex-col gap-2">
            <PlaylistThumbnailSkeleton />
            <PlaylistInfoSkeleton />
        </div>
    );
};

export const PlaylistsGridCard = ({ data }: PlaylistsGridCardProps) => {
    return (
        <Link href={`/playlists/${data.id}`}>
            <div className="group flex w-full flex-col gap-2">
                <PlaylistThumbnail
                    imageUrl={data.thumbnailUrl || THUMBNAIL_FALLBACK}
                    title={data.name}
                    videoCount={data.videoCount}
                />
                <PlaylistInfo data={data} />
            </div>
        </Link>
    );
};
