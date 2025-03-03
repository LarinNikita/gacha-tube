import { useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface VideoDescriptionProps {
    compactViews: string;
    expandedViews: string;
    compactData: string;
    expandedData: string;
    description?: string | null;
}

export const VideoDescription = ({
    compactViews,
    expandedViews,
    compactData,
    expandedData,
    description,
}: VideoDescriptionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            onClick={() => setIsExpanded(current => !current)}
            className="bg-secondary/50 hover:bg-secondary/70 cursor-pointer rounded-xl p-3 transition"
        >
            <div className="mb-2 flex gap-2 text-sm">
                <span className="font-medium">
                    {isExpanded ? expandedViews : compactViews} views
                </span>
                <span className="font-medium">
                    {isExpanded ? expandedData : compactData}
                </span>
            </div>
            <div className="relative">
                <p
                    className={cn(
                        'whitespace-pre-wrap text-sm',
                        !isExpanded && 'line-clamp-1',
                    )}
                >
                    {description || 'No description'}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium">
                    {isExpanded ? (
                        <>
                            Show less <ChevronUpIcon className="size-4" />
                        </>
                    ) : (
                        <>
                            Shore more <ChevronDownIcon className="size-4" />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
