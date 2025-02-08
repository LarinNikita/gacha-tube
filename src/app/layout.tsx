import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import './globals.css';

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
                <body className={font.className}>{children}</body>
            </html>
        </ClerkProvider>
    );
}
