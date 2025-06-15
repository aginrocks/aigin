import { SidebarLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';

type SidebarTileProps = {
    title: string;
};

function SidebarTile({ title }: SidebarTileProps) {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <span>{title}</span>
            </SidebarMenuButton>
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
