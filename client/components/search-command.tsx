import { useEffect, useState } from 'react';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from './ui/command';
import { useAtom } from 'jotai';
import { searchCommandAtom } from '@lib/atoms/search-command';
import { useTRPC } from '@lib/trpc';
import { useSubscription } from '@trpc/tanstack-react-query';

export function CommandMenu() {
    const trpc = useTRPC();

    const [open, setOpen] = useAtom(searchCommandAtom);

    const { data: chatsHistory } = useSubscription(trpc.chat.getAll.subscriptionOptions());

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const pinned = chatsHistory?.filter((f) => f.pinned);

    const chatsHistoryWithoutPinned = chatsHistory?.filter((f) => !f.pinned);

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search in chats history..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {pinned?.length != 0 && (
                    <CommandGroup heading="pinned">
                        {pinned?.map((chat) => (
                            <CommandItem key={chat._id} value={chat._id}>
                                {chat.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
                <CommandGroup heading="Chat History">
                    {chatsHistoryWithoutPinned?.map((chat) => (
                        <CommandItem key={chat._id} value={chat._id}>
                            {chat.name}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
