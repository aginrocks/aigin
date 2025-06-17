import { IconDots, IconPin, IconShare3, IconTrash } from '@tabler/icons-react';

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
import { Outputs } from '@lib/trpc';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarTileProps = {
    title: string;
    isGenerating?: boolean;
    id: string;
};

function SidebarTile({ title, id }: SidebarTileProps) {
    const { isMobile } = useSidebar();

    const active = usePathname() === `/chat/${id}`;

    return (
        <SidebarMenuItem>
            <Link href={`/chat/${id}`}>
                <SidebarMenuButton isActive={active} asChild>
                    <div className="pr-1">
                        <span className="truncate">{title}</span>
                        {/* TODO: show if chat is generating */}
                    </div>
                </SidebarMenuButton>
            </Link>
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

export type AsyncIterableData<T> = T extends AsyncIterable<infer U> ? U : never;

export type chatSubscriptionData = AsyncIterableData<Outputs['chat']['getAll']>[0];

export type chatFilter = { func: (chat: chatSubscriptionData) => boolean; label: string };

type SidebarTilesSectionProps = {
    chats: chatSubscriptionData[];
    filter?: chatFilter[];
};

function SidebarTilesSection({ chats, filter }: SidebarTilesSectionProps) {
    return (
        <SidebarMenu className="pt-0">
            {filter
                ? filter.map((f, i) => {
                      const elements = chats.filter(f.func);
                      if (elements.length > 0)
                          return (
                              <div key={i} className="space-y-0.5">
                                  <SidebarLabel>{f.label}</SidebarLabel>
                                  {elements.map((chat) => (
                                      <SidebarTile
                                          id={chat._id}
                                          key={chat._id}
                                          title={chat.name}
                                          isGenerating={chat.isGenerating}
                                      />
                                  ))}
                              </div>
                          );
                  })
                : chats.map((chat) => (
                      <SidebarTile id={chat._id} key={chat._id} title={chat.name} />
                  ))}
        </SidebarMenu>
    );
}

export { SidebarTile, SidebarTilesSection };
