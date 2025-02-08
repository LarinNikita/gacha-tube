'use client';

import Link from 'next/link';
import { HistoryIcon, ListVideoIcon, ThumbsUpIcon } from 'lucide-react';

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

const item = [
    {
        title: 'History',
        url: '/playlist/history',
        icon: HistoryIcon,
        auth: true,
    },
    {
        title: 'Liked Videos',
        url: '/playlist/liked',
        icon: ThumbsUpIcon,
        auth: true,
    },
    {
        title: 'All Playlists',
        url: '/playlists',
        icon: ListVideoIcon,
    },
];

export const PersonalSection = () => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>You</SidebarGroupLabel>
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
