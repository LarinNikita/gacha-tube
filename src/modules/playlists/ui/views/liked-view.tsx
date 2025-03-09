import { LikedVideosSection } from '../sections/liked-videos-section';

export const LikedView = () => {
    return (
        <div className="mx-auto mb-10 flex max-w-screen-md flex-col gap-y-6 px-4 pt-2.5">
            <div className="">
                <h1 className="text-2xl font-bold">👍 Liked</h1>
                <p className="text-muted-foreground text-xs">
                    Videos you have liked
                </p>
            </div>
            <LikedVideosSection />
        </div>
    );
};
