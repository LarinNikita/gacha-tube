import { VideosSection } from '../sections/videos-section';
import { PlaylistHeaderSection } from '../sections/playlist-header-section';

interface VideosViewProps {
    playlistId: string;
}

export const VideosView = ({ playlistId }: VideosViewProps) => {
    return (
        <div className="mx-auto mb-10 flex max-w-screen-md flex-col gap-y-6 px-4 pt-2.5">
            <PlaylistHeaderSection playlistId={playlistId} />
            <VideosSection playlistId={playlistId} />
        </div>
    );
};
