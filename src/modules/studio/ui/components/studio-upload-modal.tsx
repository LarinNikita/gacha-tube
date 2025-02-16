'use client';

import { toast } from 'sonner';
import { Loader2Icon, PlusIcon } from 'lucide-react';

import { trpc } from '@/trpc/client';

import { Button } from '@/components/ui/button';
import { ResponsiveModal } from '@/components/responsive-modal';

export const StudioUploadModal = () => {
    const utils = trpc.useUtils();
    const create = trpc.videos.create.useMutation({
        onSuccess: () => {
            toast.success('Video created');
            utils.studio.getMany.invalidate();
        },
        onError: () => {
            toast.error('Something went wrong');
        },
    });

    return (
        <>
            <ResponsiveModal
                title="Upload a video"
                open={!!create.data}
                onOpenChange={() => create.reset()}
            >
                <p>Upload a video</p>
            </ResponsiveModal>
            <Button
                variant="secondary"
                onClick={() => create.mutate()}
                disabled={create.isPending}
            >
                {create.isPending ? (
                    <Loader2Icon className="animate-spin" />
                ) : (
                    <PlusIcon />
                )}
                Create
            </Button>
        </>
    );
};
