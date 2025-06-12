import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';
import { IconPlus } from '@tabler/icons-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { SidebarUser } from './sidebar-user';
import { Header } from './ui/header';
import { Button } from './ui/button';

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
    },
    {
        title: 'Template chat',
        id: 'asdfgafgadfgg',
    },
    {
        title: 'Template chat',
        id: 'asdfgafgadfgg',
    },
    {
        title: 'Template chat',
        id: 'asdfgafgadfgg',
    },
    {
        title: 'Template chat',
        id: 'asdfgafgadfgg',
    },
];

export function AppSidebar() {
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
                            {chats.map((chat) => (
                                <SidebarMenuItem key={chat.title}>
                                    <SidebarMenuButton asChild>
                                        <span>{chat.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarUser user={{ email: 'asdsad', name: 'User', avatar: '' }} />
            </SidebarFooter>
        </Sidebar>
    );
}
