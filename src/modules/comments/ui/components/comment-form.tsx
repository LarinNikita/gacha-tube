import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useClerk, useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';

import { commentInsertSchema } from '@/db/schema';

import { trpc } from '@/trpc/client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/components/user-avatar';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';

interface CommentFormProps {
    videoId: string;
    parentId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    variant?: 'reply' | 'comment';
}

export const CommentForm = ({
    videoId,
    parentId,
    onSuccess,
    onCancel,
    variant = 'comment',
}: CommentFormProps) => {
    const { user } = useUser();
    const clerk = useClerk();

    const utils = trpc.useUtils();
    const create = trpc.comments.create.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({ videoId });
            utils.comments.getMany.invalidate({ videoId, parentId });
            form.reset();
            toast.success('Comment added');
            onSuccess?.();
        },
        onError: error => {
            toast.error('Something went wrong');
            if (error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            }
        },
    });

    const form = useForm<z.infer<typeof commentInsertSchema>>({
        resolver: zodResolver(commentInsertSchema.omit({ userId: true })),
        defaultValues: {
            videoId,
            parentId,
            value: '',
        },
    });

    const handleSubmit = (values: z.infer<typeof commentInsertSchema>) => {
        create.mutate(values);
    };

    const handleCancel = () => {
        form.reset();
        onCancel?.();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="group flex gap-4"
            >
                <UserAvatar
                    size="lg"
                    imageUrl={user?.imageUrl || '/user-placeholder.svg'}
                    name={user?.username ?? 'User'}
                />
                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder={
                                            variant === 'reply'
                                                ? 'Reply to this comment...'
                                                : 'Add a comment...'
                                        }
                                        className="min-h-0 resize-none overflow-hidden bg-transparent"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="mt-2 flex justify-end gap-2">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            disabled={create.isPending}
                            type="submit"
                            size="sm"
                        >
                            {variant === 'reply' ? 'Reply' : 'Comment'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};
