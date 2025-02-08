import { UserCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const AuthButton = () => {
    // TODO: Add different auth states
    return (
        <Button
            variant="outline"
            className="rounded-full border-blue-500/20 px-4 py-2 text-sm font-medium text-blue-600 shadow-none hover:bg-blue-500"
        >
            <UserCircleIcon />
            Sign in
        </Button>
    );
};
