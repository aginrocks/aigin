'use client';
import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';
import { IconPlus } from '@tabler/icons-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { SidebarUser } from './sidebar-user';
import { Header } from './ui/header';
import { Button } from './ui/button';
import { useTRPC } from '@lib/trpc';
import { useQuery } from '@tanstack/react-query';
import { useAvatar } from '@lib/hooks';

// Menu items.
const items = [
    {
        title: 'Home',
        url: '#',
        icon: Home,
    },
    {
        title: 'Inbox',
        url: '#',
        icon: Inbox,
    },
    {
        title: 'Calendar',
        url: '#',
        icon: Calendar,
    },
    {
        title: 'Search',
        url: '#',
        icon: Search,
    },
    {
        title: 'Settings',
        url: '#',
        icon: Settings,
    },
];

const chats = [
    {
        title: 'Template chat',
        id: 'asdfgafgadfgg',
        date: new Date('2023-10-01T12:00:00Z'),
    },
    {
        title: 'Template chat',
        id: 'asdfgafgsdfadfgg',
        date: new Date('2024-10-01T12:00:00Z'),
    },
    {
        title: 'Template chat',
        id: 'asdasdfgafgadfgg',
        date: new Date('2023-11-01T12:00:00Z'),
    },
    {
        title: 'Template chat',
        id: 'asdfga345fgadfgg',
        date: new Date('2025-01-01T12:00:00Z'),
    },
    {
        title: 'Template chat',
        id: 'as234dfgafgadfgg',
        date: new Date('2021-10-01T12:00:00Z'),
    },
    {
        title: 'Template chat',
        id: 'as234dfgafg4213adfgg',
        date: new Date('2025-06-12T12:00:00Z'),
    },
    {
        title: 'Template chat',
        id: 'as234dfgaasdfgadfgg',
        date: new Date('2025-06-11T18:00:00Z'),
    },
];

export function AppSidebar() {
    const trpc = useTRPC();
    const { data: userData } = useQuery(trpc.auth.info.queryOptions());

    const avatarUrl = useAvatar(userData?.email);

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <Header
                        title="Chats"
                        className="pr-1.5"
                        rightSection={
                            <>
                                <Button variant="ghost" size="icon">
                                    <IconPlus />
                                </Button>
                                <SidebarTrigger />
                            </>
                        }
                    />
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {chats
                                .filter(
                                    (chat) => chat.date.toDateString() === new Date().toDateString()
                                )
                                .map((chat, i) => (
                                    <div key={chat.id}>
                                        {i == 0 && <SidebarLabel>Today</SidebarLabel>}
                                        <SidebarMenuItem key={chat.id}>
                                            <SidebarMenuButton asChild>
                                                <span>{chat.title}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </div>
                                ))}
                            {chats
                                .filter(
                                    (chat) =>
                                        chat.date.toDateString() ===
                                        new Date(Date.now() - 86400000).toDateString()
                                )
                                .map((chat, i) => (
                                    <div key={chat.id}>
                                        {i == 0 && <SidebarLabel>Yesterday</SidebarLabel>}
                                        <SidebarMenuItem key={chat.id}>
                                            <SidebarMenuButton asChild>
                                                <span>{chat.date.toDateString()}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </div>
                                ))}
                            {chats
                                .filter((chat) => chat.date < new Date(Date.now() - 86400000))
                                .map((chat, i) => (
                                    <div key={chat.id}>
                                        {i == 0 && <SidebarLabel>Older</SidebarLabel>}
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <span>{chat.date.toDateString()}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </div>
                                ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarUser
                    user={{ email: userData?.email, name: userData?.name, avatar: avatarUrl }}
                />
            </SidebarFooter>
        </Sidebar>
    );
}
