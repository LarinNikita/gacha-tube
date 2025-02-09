import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import './globals.css';

import { TRPCProvider } from '@/trpc/client';

const font = Inter({
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'GachaTube',
    description: 'Video hosting',
    icons: {
        icon: '/logo.svg',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider afterSignOutUrl="/">
            <html lang="en" suppressHydrationWarning>
                <body className={font.className}>
                    <TRPCProvider>{children}</TRPCProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
