import { Button } from '@components/ui/button';
import { IconArrowUp } from '@tabler/icons-react';
import TextareaAutosize from 'react-textarea-autosize';
import { AttachButton } from './attach-button';
import { getHotkeyHandler, useMergedRef } from '@mantine/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useStartTyping } from 'react-use';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AppRouter } from '../../../../server/src';
import { inferProcedureInput } from '@trpc/server';
import { useQuery } from '@tanstack/react-query';
import { GetModelsOutput, useTRPC } from '@lib/trpc';
import ModelSelector from './model-selector';
import { ScrollToBottom } from './scroll-to-bottom';
import { useAtom, useAtomValue } from 'jotai';
import { modelsAtom } from '@lib/atoms/models';
import { selectedModelAtom } from '@lib/atoms/selectedmodel';
import AppSelect from './app-select';

export type generateProps = inferProcedureInput<AppRouter['chat']['generate']>;

export type MessageInputProps = {
    onSubmit: SubmitHandler<FormType>;
    scrollToBottomVisible?: boolean;
    scrollToBottom?: () => void;
};

export type FormType = generateProps & { provider: string };

export function MessageInput({
    onSubmit,
    scrollToBottomVisible,
    scrollToBottom,
}: MessageInputProps) {
    const trpc = useTRPC();

    const ref = useRef<HTMLTextAreaElement>(null);

    const formRef = useRef<HTMLFormElement>(null);

    useStartTyping(() => ref.current?.focus());
    useEffect(() => ref.current?.focus(), []);

    const models = useAtomValue(modelsAtom);
    const { data: providers } = useQuery(trpc.models.providers.get.queryOptions());

    const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);

    const messageForm = useForm<FormType>();

    const avabileProviders = useMemo(
        () =>
            selectedModel?.providers?.filter(
                (p) => providers?.find((f) => f.id == p.provider)?.enabled
            ),
        [selectedModel, providers]
    );

    useEffect(() => {
        if (avabileProviders?.length == 0 || !avabileProviders) {
            return;
        }

        messageForm.setValue('provider', avabileProviders?.[0].provider || '');
        messageForm.setValue('model', avabileProviders?.[0].modelId || '');
    }, [avabileProviders]);

    const { ref: inputRef, ...inputProps } = messageForm.register('prompt');

    const mergedRef = useMergedRef(inputRef, ref);

    const isNotEmpty = messageForm.watch('prompt')?.trim().length > 0;

    const selectedProviderModel = messageForm.watch('model');
    const selectedProvider = messageForm.watch('provider');

    useEffect(() => {
        console.log('Selected provider changed:', selectedProvider);
        console.log('Selected provider model changed:', selectedProviderModel);
        console.log('Selected model changed:', selectedModel);
    }, [selectedProvider, selectedProviderModel, selectedModel]);

    return (
        <form
            onSubmit={messageForm.handleSubmit((...args) => {
                if (!isNotEmpty || avabileProviders?.length == 0) {
                    console.log('Form is empty or no available providers');
                    return;
                }
                onSubmit(...args);
                messageForm.resetField('prompt', { defaultValue: '' });
            })}
            ref={formRef}
        >
            <div className="w-full z-50 max-w-4xl min-h-fit mx-auto p-1 absolute bottom-2 left-1/2 -translate-x-1/2 ">
                <ScrollToBottom
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToBottom?.();
                    }}
                    visible={scrollToBottomVisible}
                />
                <div className="bg-popover/60 backdrop-blur-sm border rounded-2xl flex flex-col p-3">
                    <TextareaAutosize
                        className="focus:outline-none resize-none text-base px-2 pb-2 pt-1"
                        placeholder="Type your message here..."
                        onKeyDown={getHotkeyHandler([
                            [
                                'Enter',
                                (e) => {
                                    e.preventDefault();
                                    formRef.current?.requestSubmit();
                                },
                            ],
                        ])}
                        maxRows={8}
                        minRows={2}
                        {...inputProps}
                        ref={mergedRef}
                    />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <AttachButton />
                            <AppSelect />
                            <ModelSelector
                                onProviderChange={(provider) => {
                                    messageForm.setValue('provider', provider.provider);
                                    messageForm.setValue('model', provider.modelId);
                                }}
                                models={models}
                                avabileProviders={avabileProviders}
                                providers={providers}
                                selectedModel={selectedModel}
                                selectedProviderModel={selectedProviderModel}
                                selectedProvider={selectedProvider}
                                onModelChange={(modelSlug) => setSelectedModel(modelSlug)}
                            />
                        </div>
                        <div className="flex items-center gap-2 ">
                            <Button
                                size="md-icon"
                                variant="light"
                                disabled={!isNotEmpty || avabileProviders?.length == 0}
                                type="submit"
                            >
                                <IconArrowUp />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
