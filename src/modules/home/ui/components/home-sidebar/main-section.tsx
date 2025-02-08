'use client';

import Link from 'next/link';
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
        title: 'Subscriptions',
        url: '/feed/subscriptions',
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
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {item.map(item => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                asChild
                                isActive={false} //TODO: Change to look at current path
                                onClick={() => {}} //TODO: Do something on click
                            >
                                <Link
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
