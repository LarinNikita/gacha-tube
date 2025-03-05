import Link from 'next/link';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { useAuth, useClerk } from '@clerk/nextjs';
import { MessageSquareIcon, MoreVerticalIcon, Trash2Icon } from 'lucide-react';

import { trpc } from '@/trpc/client';

import { CommentsGetManyOutput } from '../../types';

import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CommentFormProps {
    comment: CommentsGetManyOutput['items'][number];
}

export const CommentItem = ({ comment }: CommentFormProps) => {
    const { userId } = useAuth();
    const clerk = useClerk();

    const utils = trpc.useUtils();
    const remove = trpc.comments.remove.useMutation({
        onSuccess: () => {
            toast.success('Comment deleted');
            utils.comments.getMany.invalidate({ videoId: comment.videoId });
        },
        onError: error => {
            toast.error('Something went wrong');

            if (error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            }
        },
    });

    return (
        <div>
            <div className="flex gap-4">
                <Link href={`/users/${comment.userId}`}>
                    <UserAvatar
                        size="lg"
                        imageUrl={comment.user.imageUrl}
                        name={comment.user.name}
                    />
                </Link>
                <div className="min-w-0 flex-1">
                    <Link href={`/users/${comment.userId}`}>
                        <div className="mb-0.5 flex items-center gap-2">
                            <span className="pb-0.5 text-sm font-medium">
                                {comment.user.name}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                {formatDistanceToNow(comment.createdAt, {
                                    addSuffix: true,
                                })}
                            </span>
                        </div>
                    </Link>
                    <p className="text-sm">{comment.value}</p>
                    {/* TODO: Add Reactions */}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreVerticalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {}}>
                            <MessageSquareIcon className="size-4" />
                            Reply
                        </DropdownMenuItem>
                        {comment.user.clerkId === userId && (
                            <DropdownMenuItem
                                onClick={() =>
                                    remove.mutate({ id: comment.id })
                                }
                            >
                                <Trash2Icon className="size-4" />
                                Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
