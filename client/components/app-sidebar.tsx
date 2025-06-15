'use client';
import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';
import { IconPlus } from '@tabler/icons-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
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
import {
    chat,
    chatFilter,
    chatSubscriptionData,
    SidebarTile,
    SidebarTilesSection,
} from './sidebar-tiles';
import { useSubscription } from '@trpc/tanstack-react-query';
import { useEffect } from 'react';

// const chats: chatSubscriptionData[] = [
//     {
//         name: 'Template chat',
//         _id: 'asdfgafgadfgg',
//         date: new Date('2023-10-01T12:00:00Z'),
//     },
//     {
//         name: 'Template chat',
//         id: 'asdfgafgsdfadfgg',
//         date: new Date('2024-10-01T12:00:00Z'),
//     },
//     {
//         name: 'Template chat',
//         id: 'asdasdfgafgadfgg',
//         date: new Date('2023-11-01T12:00:00Z'),
//     },
//     {
//         name: 'Template chat',
//         id: 'asdfga345fgadfgg',
//         date: new Date('2025-01-01T12:00:00Z'),
//     },
//     {
//         name: 'Template chat',
//         id: 'as234dfgafgadfgg',
//         date: new Date('2021-10-01T12:00:00Z'),
//     },
//     {
//         name: 'Template chat',
//         id: 'as234dfgafg4213adfgg',
//         date: new Date('2025-06-12T12:00:00Z'),
//     },
//     {
//         name: 'Template chat',
//         id: 'as234dfgaasdfgadfgg',
//         date: new Date('2025-06-15T18:00:00Z'),
//     },
// ];

const chatFilters: chatFilter[] = [
    {
        func: (chat) => new Date(chat.updatedAt).toDateString() === new Date().toDateString(),
        label: 'Today',
    },
    {
        func: (chat) =>
            new Date(chat.updatedAt).toDateString() ===
            new Date(Date.now() - 86400000).toDateString(),
        label: 'Yesterday',
    },
    // {
    //     func: (chat) => chat.date.getFullYear() === new Date().getFullYear(),
    //     label: 'This Year',
    // },
    // {
    //     func: (chat) => chat.date.getFullYear() === new Date().getFullYear() - 1,
    //     label: 'Last Year',
    // },
];

export function AppSidebar() {
    const trpc = useTRPC();
    const { data: userData } = useQuery(trpc.auth.info.queryOptions());
    const chatsHistory = useSubscription(trpc.chat.getAll.subscriptionOptions());

    useEffect(() => {
        if (chatsHistory.error) {
            console.error('Error fetching chats:', chatsHistory.error);
        }
    }, [chatsHistory.data]);

    const avatarUrl = useAvatar(userData?.email);

    return (
        <Sidebar>
            <SidebarHeader className="pb-0 border-b border-sidebar-border">
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
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        {chatsHistory.data && <SidebarTilesSection chats={chatsHistory.data} />}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-sidebar-border">
                <SidebarUser
                    user={{ email: userData?.email, name: userData?.name, avatar: avatarUrl }}
                />
            </SidebarFooter>
        </Sidebar>
    );
}
