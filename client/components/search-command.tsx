import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Command,
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
import { useRouter } from 'next/navigation';
import { set } from 'mongoose';

export function CommandMenu() {
    const trpc = useTRPC();

    const router = useRouter();

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

    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        if (!open) return;
        setSearchValue('');
    }, [open]);

    const ItemsComp = ({ name, items }: { name: string; items: typeof chatsHistory }) =>
        useMemo(
            () => (
                <CommandGroup heading={name}>
                    {items
                        ?.filter((f) => {
                            if (!searchValue || searchValue == '') return true;
                            return f.name.toLowerCase().includes(searchValue.toLowerCase());
                        })
                        ?.map((chat) => (
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false);
                                    router.push(`/chat/${chat._id}`);
                                }}
                                key={chat._id}
                                value={chat._id}
                            >
                                {chat.name}
                            </CommandItem>
                        ))}
                </CommandGroup>
            ),
            [searchValue, open]
        );

    return (
        <CommandDialog
            open={open}
            onOpenChange={(v) => {
                setOpen(v);
            }}
        >
            <Command shouldFilter={false}>
                <CommandInput
                    onValueChange={(value) => {
                        setSearchValue(value);
                    }}
                    placeholder="Search in chats history..."
                />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {pinned && pinned?.length > 0 && (
                        <ItemsComp name="Pinned Chats" items={pinned} />
                    )}
                    {chatsHistoryWithoutPinned && chatsHistoryWithoutPinned?.length > 0 && (
                        <ItemsComp name="Chats History" items={chatsHistoryWithoutPinned} />
                    )}
                </CommandList>
            </Command>
        </CommandDialog>
    );
}
