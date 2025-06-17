import { Button } from '@/components/ui/button';
import { IconChevronDown, IconFilter, IconSearch } from '@tabler/icons-react';
import { AppRouter } from '../../../../server/src';
import { inferProcedureOutput } from '@trpc/server';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from 'react';
import { Capabilities } from './capabilities';

type ModelSelectorProps = {
    models?: inferProcedureOutput<AppRouter['models']['get']>;
    selectedModel: string;
    onModelChange?: (modelSlug: string) => void;
};

export default function ModelSelector({
    selectedModel,
    models,
    onModelChange,
}: ModelSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                searchInputRef.current?.focus();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const filteredModels =
        models?.filter((model) => model.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        [];

    const handleModelSelect = (modelSlug: string) => {
        onModelChange?.(modelSlug);
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" type="button">
                    <span>{models?.find((f) => f.slug == selectedModel)?.name}</span>
                    <IconChevronDown />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                className="bg-popover/40 backdrop-blur-md border rounded-lg p-2"
            >
                <div className="flex gap-2 items-center pb-1">
                    <div className="px-1">
                        <IconSearch size={20} />
                    </div>
                    <Input
                        ref={searchInputRef}
                        placeholder="Search models"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className=" h-8 w-full dark:bg-transparent shadow-none border-none focus-visible:border-none"
                    />
                    <Button variant={'outline'} size={'icon'}>
                        <IconFilter />
                    </Button>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <div className="flex flex-col gap-1  overflow-auto md:max-h-106 sm:max-h-60 max-h-60">
                        {filteredModels.length > 0 ? (
                            filteredModels.map((model) => (
                                <Button
                                    key={model.slug}
                                    variant={model.slug === selectedModel ? 'light' : 'ghost'}
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => handleModelSelect(model.slug)}
                                >
                                    <div className="flex items-center gap-2 justify-between w-full">
                                        <span>{model.name}</span>
                                        <Capabilities modelCapabilities={model.capabilities} />
                                    </div>
                                </Button>
                            ))
                        ) : (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
                                No models found
                            </div>
                        )}
                    </div>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
