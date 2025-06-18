import { Button } from '@/components/ui/button';
import { IconCheck, IconChevronDown, IconFilter, IconSearch } from '@tabler/icons-react';
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
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Capabilities } from './capabilities';
import { GetModelsOutput, Outputs } from '@lib/trpc';

type ModelSelectorProps = {
    models?: inferProcedureOutput<AppRouter['models']['get']>;
    selectedModel: GetModelsOutput[number] | undefined;
    avabileProviders?: GetModelsOutput[number]['providers'];
    selectedProviderModel: string;
    selectedProvider: string;
    onModelChange: (modelSlug: GetModelsOutput[number]) => void;
    onProviderChange: (
        provider: inferProcedureOutput<AppRouter['models']['get']>[number]['providers'][number]
    ) => void;
    providers?: Outputs['models']['providers']['get'];
};

export default function ModelSelector({
    selectedModel: selectedModelSlug,
    avabileProviders,
    selectedProvider: selectedProviderID,
    models,
    providers,
    onModelChange,
    onProviderChange,
    selectedProviderModel,
}: ModelSelectorProps) {
    const BaseComponent = ({ type }: { type: 'model' | 'provider' }) => {
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
            models?.filter((model) =>
                model.name.toLowerCase().includes(searchQuery.toLowerCase())
            ) || [];

        const handleModelSelect = (modelSlug: GetModelsOutput[number]) => {
            onModelChange?.(modelSlug);
            setIsOpen(false);
            setSearchQuery('');
        };

        const handleProviderSelect = (
            provider: inferProcedureOutput<AppRouter['models']['get']>[number]['providers'][number]
        ) => {
            onProviderChange?.(provider);
            setIsOpen(false);
            setSearchQuery('');
        };

        const selectedModel = useMemo(
            () => models?.find((f) => f.slug == selectedModelSlug?.slug),
            [selectedModelSlug]
        );
        const selectedProvider = useMemo(
            () => providers?.find((f) => f.id == selectedProviderID),
            [selectedProviderID]
        );

        return (
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger
                    // disabled={type == 'provider' && enabledProviders?.length == 0}
                    asChild
                >
                    <Button
                        size="sm"
                        variant="ghost"
                        type="button"
                        // disabled={type == 'provider' && enabledProviders?.length == 0}
                    >
                        {type == 'model' && <span>{selectedModel?.name}</span>}
                        {type == 'provider' && (
                            <span>
                                {avabileProviders?.length == 0
                                    ? 'No enabled providers'
                                    : selectedProvider?.name}
                            </span>
                        )}
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
                            {type == 'model' &&
                                (filteredModels.length > 0 ? (
                                    filteredModels.map((model) => (
                                        <Button
                                            key={model.slug}
                                            variant={
                                                model.slug === selectedModel?.slug
                                                    ? 'light'
                                                    : 'ghost'
                                            }
                                            size="sm"
                                            className="w-full justify-start"
                                            onClick={() =>
                                                handleModelSelect(model as GetModelsOutput[number])
                                            }
                                        >
                                            <div className="flex items-center gap-2 justify-between w-full">
                                                <span>{model.name}</span>
                                                <Capabilities
                                                    modelCapabilities={model.capabilities}
                                                />
                                            </div>
                                        </Button>
                                    ))
                                ) : (
                                    <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
                                        No models found
                                    </div>
                                ))}
                            {type == 'provider' &&
                                selectedModel?.providers?.map((provider) => {
                                    const userProvider = providers?.find(
                                        (f) => f.id == provider.provider
                                    );
                                    return (
                                        <Button
                                            key={provider.modelId + provider.provider}
                                            disabled={!userProvider?.enabled}
                                            variant={
                                                selectedProvider?.id === provider.provider
                                                    ? 'light'
                                                    : 'ghost'
                                            }
                                            size="sm"
                                            className="w-full justify-start"
                                            onClick={() => handleProviderSelect(provider)}
                                        >
                                            <div className="flex items-center gap-2 justify-between w-full">
                                                <span>{userProvider?.name}</span>
                                                {userProvider?.enabled && <IconCheck />}
                                                {/* <Capabilities modelCapabilities={provider.capabilities} /> */}
                                            </div>
                                        </Button>
                                    );
                                })}
                        </div>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    return (
        <div className="flex items-center gap-2">
            <BaseComponent type="model" />
            <BaseComponent type="provider" />
        </div>
    );
}
