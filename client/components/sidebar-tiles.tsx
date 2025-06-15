import { IconDots, IconFolder, IconPin, IconShare3, IconTrash } from '@tabler/icons-react';

import {
    SidebarLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from './ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { AppRouter } from '../../server/src';
import { inferOutput } from '@trpc/tanstack-react-query';
import { Outputs, useTRPC } from '@lib/trpc';

type SidebarTileProps = {
    title: string;
};

function SidebarTile({ title }: SidebarTileProps) {
    const { isMobile } = useSidebar();

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <div className="pr-1">
                    <span className="truncate">{title}</span>
                </div>
            </SidebarMenuButton>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuAction
                        showOnHover
                        className="data-[state=open]:bg-accent rounded-sm"
                    >
                        <IconDots />
                        <span className="sr-only">More</span>
                    </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-24 rounded-lg"
                    side={isMobile ? 'bottom' : 'right'}
                    align={isMobile ? 'end' : 'start'}
                >
                    <DropdownMenuItem>
                        <IconPin />
                        <span>Pin</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <IconShare3 />
                        <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                        <IconTrash />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
}

export type chat = Outputs['chat']['getAll'];

type AsyncIterableData<T> = T extends AsyncIterable<infer U> ? U : never;

export type chatSubscriptionData = AsyncIterableData<Outputs['chat']['getAll']>[0];

export type chatFilter = { func: (chat: chatSubscriptionData) => boolean; label: string };

type SidebarTilesSectionProps = {
    chats: chatSubscriptionData[];
    filter?: chatFilter[];
};

function SidebarTilesSection({ chats, filter }: SidebarTilesSectionProps) {
    return (
        <SidebarMenu className="pt-1">
            {filter
                ? filter.map((f, i) => {
                      const elements = chats.filter(f.func);
                      if (elements.length > 0)
                          return (
                              <div key={i}>
                                  <SidebarLabel>{f.label}</SidebarLabel>
                                  {elements.map((chat) => (
                                      <SidebarTile key={chat._id} title={chat.name} />
                                  ))}
                              </div>
                          );
                  })
                : chats.map((chat) => <SidebarTile key={chat._id} title={chat.name} />)}
        </SidebarMenu>
    );
}

export { SidebarTile, SidebarTilesSection };
