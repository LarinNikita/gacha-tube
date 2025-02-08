import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

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
        <html lang="en" suppressHydrationWarning>
            <body className={font.className}>{children}</body>
        </html>
    );
}
