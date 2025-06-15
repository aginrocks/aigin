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

type SidebarTileProps = {
    title: string;
};

function SidebarTile({ title }: SidebarTileProps) {
    const { isMobile } = useSidebar();

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <span>{title}</span>
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

export type chat = { id: string; title: string; date: Date };
export type chatFilter = { func: (chat: chat) => boolean; label: string };

type SidebarTilesSectionProps = {
    chats: chat[];
    filter?: chatFilter[];
};

function SidebarTilesSection({ chats, filter }: SidebarTilesSectionProps) {
    return (
        <SidebarMenu>
            {filter
                ? filter.map((f, i) => {
                      const elements = chats.filter(f.func);
                      if (elements.length > 0)
                          return (
                              <div key={i}>
                                  <SidebarLabel>{f.label}</SidebarLabel>
                                  {elements.map((chat) => (
                                      <SidebarTile key={chat.id} title={chat.title} />
                                  ))}
                              </div>
                          );
                  })
                : chats.map((chat) => <SidebarTile key={chat.id} title={chat.title} />)}
        </SidebarMenu>
    );
}

export { SidebarTile, SidebarTilesSection };
