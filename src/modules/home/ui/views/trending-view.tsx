import { TrendingVideosSection } from '../sections/trending-videos-section';

export const TrendingView = () => {
    return (
        <div className="mx-auto mb-10 flex max-w-[2400px] flex-col gap-y-6 px-4 pt-2.5">
            <div className="">
                <h1 className="text-2xl font-bold">🔥 Trending</h1>
                <p className="text-muted-foreground text-xs">
                    Most popular videos at the moment
                </p>
            </div>
            <TrendingVideosSection />
        </div>
    );
};
