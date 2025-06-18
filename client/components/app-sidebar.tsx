'use client';
import { IconPlus, IconSearch } from '@tabler/icons-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { SidebarUser } from './sidebar-user';
import { Header } from './ui/header';
import { Button } from './ui/button';
import { Outputs, useTRPC } from '@lib/trpc';
import { useQuery } from '@tanstack/react-query';
import { useAvatar } from '@lib/hooks';
import { AsyncIterableData, chatFilter, SidebarTilesSection } from './sidebar-tiles';
import { useSubscription } from '@trpc/tanstack-react-query';
import { SidebarGradient } from './ui/sidebar-gradient';
import Link from 'next/link';

const chatFilters: chatFilter[] = [
    {
        func: (chat) => chat.pinned,
        label: 'Pinned',
    },
    {
        func: (chat) =>
            new Date(chat.updatedAt).toDateString() === new Date().toDateString() && !chat.pinned,
        label: 'Today',
    },
    {
        func: (chat) =>
            new Date(chat.updatedAt).toDateString() ===
                new Date(Date.now() - 86400000).toDateString() && !chat.pinned,
        label: 'Yesterday',
    },
    {
        func: (chat) => {
            const chatDate = new Date(chat.updatedAt);
            const now = new Date();
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            startOfWeek.setHours(0, 0, 0, 0);
            return (
                chatDate >= startOfWeek &&
                chatDate.toDateString() !== new Date().toDateString() &&
                chatDate.toDateString() !== new Date(Date.now() - 86400000).toDateString() &&
                !chat.pinned
            );
        },
        label: 'This Week',
    },
    {
        func: (chat) => {
            const chatDate = new Date(chat.updatedAt);
            const now = new Date();
            return (
                chatDate.getMonth() === now.getMonth() &&
                chatDate.getFullYear() === now.getFullYear() &&
                chatDate < new Date(now.setDate(now.getDate() - now.getDay())) &&
                !chat.pinned
            );
        },
        label: 'This Month',
    },
    {
        func: (chat) => {
            const chatDate = new Date(chat.updatedAt);
            const now = new Date();
            return (
                chatDate.getFullYear() === now.getFullYear() &&
                chatDate.getMonth() !== now.getMonth() &&
                !chat.pinned
            );
        },
        label: 'This Year',
    },
    {
        func: (chat) =>
            (new Date(chat.updatedAt).getFullYear() < new Date().getFullYear() ||
                !chat.updatedAt) &&
            !chat.pinned,
        label: 'Older',
    },
];

export type ChatHisory = AsyncIterableData<Outputs['chat']['getAll']>;
export type userData = Outputs['auth']['info'];

export function AppSidebar() {
    const trpc = useTRPC();
    const { data: userData } = useQuery(trpc.auth.info.queryOptions());
    const { data: chatsHistory } = useSubscription(trpc.chat.getAll.subscriptionOptions());

    // useEffect(() => {
    //     if (chatsHistory.data as ChatHisory) {
    //         console.log('chatsHistory.data', chatsHistory.data[0]);

    //         const date = new Date(chatsHistory.data[0].updatedAt);
    //         console.log(date);
    //     }
    // }, [chatsHistory.data]);

    const avatarUrl = useAvatar((userData as userData)?.email);

    return (
        <Sidebar>
            <SidebarHeader className="pb-0 relative">
                <Header
                    logo
                    className="pr-1.5 h-11 pt-1"
                    rightSection={
                        <>
                            <Link href={'/'}>
                                <Button variant="ghost" size="icon">
                                    <IconPlus />
                                </Button>
                            </Link>
                            <SidebarTrigger />
                        </>
                    }
                />
                <Button variant="outline" className="text-muted-foreground text-xs justify-start">
                    <IconSearch />
                    Search Chats
                </Button>
                <SidebarGradient position="top" />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="py-3">
                    <SidebarGroupContent>
                        {!!chatsHistory && (
                            <SidebarTilesSection
                                chats={chatsHistory as ChatHisory}
                                filter={chatFilters}
                            />
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="relative">
                <SidebarGradient position="bottom" />
                <SidebarUser
                    user={{
                        email: (userData as userData)?.email,
                        name: (userData as userData)?.name,
                        avatar: avatarUrl,
                    }}
                />
            </SidebarFooter>
        </Sidebar>
    );
}
