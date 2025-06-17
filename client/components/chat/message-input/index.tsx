import { Button } from '@components/ui/button';
import { IconArrowUp } from '@tabler/icons-react';
import TextareaAutosize from 'react-textarea-autosize';
import { AttachButton } from './attach-button';
import { getHotkeyHandler, useMergedRef } from '@mantine/hooks';
import { useEffect, useRef } from 'react';
import { useStartTyping } from 'react-use';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AppRouter } from '../../../../server/src';
import { inferProcedureInput } from '@trpc/server';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@lib/trpc';
import ModelSelector from './model-selector';
import { ScrollToBottom } from './scroll-to-bottom';

export type generateProps = inferProcedureInput<AppRouter['chat']['generate']>;

export type MessageInputProps = {
    onSubmit: SubmitHandler<generateProps>;
    scrollToBottomVisible?: boolean;
    scrollToBottom?: () => void;
};

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

    const { data: models } = useQuery(trpc.models.get.queryOptions({}));

    const messageForm = useForm<generateProps>();

    useEffect(() => {
        if (!models || models.length === 0) {
            return;
        }
        messageForm.setValue('model', models[1].slug);
        console.log('Models loaded:', models);
    }, [models, messageForm]);

    const { ref: inputRef, ...inputProps } = messageForm.register('prompt');

    const mergedRef = useMergedRef(inputRef, ref);

    const isNotEmpty = messageForm.watch('prompt')?.trim().length > 0;

    const selectedModel = messageForm.watch('model');

    useEffect(() => {
        console.log('Selected model changed:', selectedModel);
    }, [selectedModel]);

    return (
        <form
            onSubmit={messageForm.handleSubmit((...args) => {
                onSubmit(...args);
                messageForm.resetField('prompt', { defaultValue: '' });
            })}
            ref={formRef}
        >
            <div className="w-full max-w-4xl min-h-fit mx-auto p-1 absolute bottom-2 left-1/2 -translate-x-1/2 ">
                <ScrollToBottom onClick={scrollToBottom} visible={scrollToBottomVisible} />
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
                            <ModelSelector
                                models={models}
                                selectedModel={selectedModel}
                                onModelChange={(modelSlug) =>
                                    messageForm.setValue('model', modelSlug)
                                }
                            />
                        </div>
                        <div className="flex items-center gap-2 ">
                            <Button
                                size="md-icon"
                                variant="light"
                                disabled={!isNotEmpty}
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
