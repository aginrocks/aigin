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
import { chat, chatFilter, SidebarTile, SidebarTilesSection } from './sidebar-tiles';

const chats: chat[] = [
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
        date: new Date('2025-06-15T18:00:00Z'),
    },
];

const chatFilters: chatFilter[] = [
    {
        func: (chat) => chat.date.toDateString() === new Date().toDateString(),
        label: 'Today',
    },
    {
        func: (chat) => chat.date.toDateString() === new Date(Date.now() - 86400000).toDateString(),
        label: 'Yesterday',
    },
    {
        func: (chat) => chat.date.getFullYear() === new Date().getFullYear(),
        label: 'This Year',
    },
    {
        func: (chat) => chat.date.getFullYear() === new Date().getFullYear() - 1,
        label: 'Last Year',
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
                        <SidebarTilesSection chats={chats} filter={chatFilters} />
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
