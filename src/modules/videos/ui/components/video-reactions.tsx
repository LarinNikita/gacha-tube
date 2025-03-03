import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// TODO: properly implement video reactions
export const VideoReactions = () => {
    const viewerReaction = 'like';

    return (
        <div className="flex flex-none items-center">
            <Button
                variant="secondary"
                className="gap-2 rounded-l-full rounded-r-none pr-4"
            >
                <ThumbsUpIcon
                    className={cn(
                        'size-5',
                        viewerReaction === 'like' && 'fill-black',
                    )}
                />
                {1}
            </Button>
            <Separator orientation="vertical" className="h-7" />
            <Button
                variant="secondary"
                className="rounded-l-none rounded-r-full pl-3"
            >
                <ThumbsDownIcon
                    className={cn(
                        'size-5',
                        viewerReaction !== 'like' && 'fill-black',
                    )}
                />
                {1}
            </Button>
        </div>
    );
};
