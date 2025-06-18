import {
    IconDots,
    IconPencil,
    IconPin,
    IconPinnedOff,
    IconShare3,
    IconTrash,
} from '@tabler/icons-react';

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
import { Outputs, useTRPC } from '@lib/trpc';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useModals } from '@lib/modals/ModalsManager';
import { useModifier } from '@lib/hooks';

type SidebarTileProps = {
    title: string;
    isGenerating?: boolean;
    id: string;
    pinned?: boolean;
};

function SidebarTile({ title, id, isGenerating, pinned }: SidebarTileProps) {
    const { isMobile } = useSidebar();

    const active = usePathname() === `/chat/${id}`;

    const trpc = useTRPC();
    const modifyChat = useMutation(trpc.chat.modify.mutationOptions());
    const deleteChat = useMutation(trpc.chat.delete.mutationOptions());

    const skipConfirm = useModifier('Shift');

    const router = useRouter();

    const modals = useModals();

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
                    <DropdownMenuItem
                        onClick={() => modifyChat.mutate({ chatId: id, pinned: !pinned })}
                    >
                        {pinned ? <IconPinnedOff /> : <IconPin />}
                        <span>{pinned ? 'Unpin' : 'Pin'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <IconPencil />
                        <span>Rename</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <IconShare3 />
                        <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={async () => {
                            if (!skipConfirm) {
                                const confirmed = await modals.show('Confirm', {
                                    title: 'Delete Chat',
                                    description: 'Are you sure you want to delete this chat?',
                                    confirmText: 'Delete',
                                    cancelText: 'Cancel',
                                });
                                if (!confirmed) return;
                            }

                            await deleteChat.mutateAsync({ chatId: id });

                            router.replace('/');
                        }}
                    >
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
                                          pinned={chat.pinned}
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
