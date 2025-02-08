'use client';

import { UserCircleIcon } from 'lucide-react';
import { SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';

export const AuthButton = () => {
    return (
        <>
            <SignedIn>
                <UserButton />
                {/* Add menu items for studio and user profile */}
            </SignedIn>
            <SignedOut>
                <SignInButton mode="modal">
                    <Button
                        variant="outline"
                        className="rounded-full border-blue-500/20 px-4 py-2 text-sm font-medium text-blue-600 shadow-none hover:bg-blue-500"
                    >
                        <UserCircleIcon />
                        Sign in
                    </Button>
                </SignInButton>
            </SignedOut>
        </>
    );
};
