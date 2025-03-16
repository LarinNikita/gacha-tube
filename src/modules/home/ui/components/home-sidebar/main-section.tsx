'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk, useAuth } from '@clerk/nextjs';
import { FlameIcon, HomeIcon, PlaySquareIcon } from 'lucide-react';

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

const item = [
    {
        title: 'Home',
        url: '/',
        icon: HomeIcon,
    },
    {
        title: 'Subscribed',
        url: '/feed/subscribed',
        icon: PlaySquareIcon,
        auth: true,
    },
    {
        title: 'Trending',
        url: '/feed/trending',
        icon: FlameIcon,
    },
];

export const MainSection = () => {
    const clerk = useClerk();
    const { isSignedIn } = useAuth();
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {item.map(item => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                asChild
                                isActive={pathname === item.url}
                                onClick={e => {
                                    if (item.auth && !isSignedIn) {
                                        e.preventDefault();
                                        return clerk.openSignIn();
                                    }
                                }}
                            >
                                <Link
                                    prefetch
                                    href={item.url}
                                    className="flex items-center gap-4"
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    <span className="text-sm">
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};
