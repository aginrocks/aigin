import { Button } from '@components/ui/button';
import { IconArrowUp, IconChevronDown, IconSend2 } from '@tabler/icons-react';
import TextareaAutosize from 'react-textarea-autosize';
import { AttachButton } from './attach-button';
import { getHotkeyHandler, useMergedRef } from '@mantine/hooks';
import { useEffect, useMemo, useRef } from 'react';
import { useStartTyping } from 'react-use';
import { useForm } from 'react-hook-form';

export function MessageInput() {
    const ref = useRef<HTMLTextAreaElement>(null);

    useStartTyping(() => ref.current?.focus());
    useEffect(() => ref.current?.focus(), []);

    const messageForm = useForm();
    const isNotEmpty = messageForm.watch('message')?.trim().length > 0;

    const { ref: inputRef, ...inputProps } = messageForm.register('message');

    const mergedRef = useMergedRef(inputRef, ref);

    return (
        <div className="w-full max-w-4xl min-h-fit mx-auto p-1">
            <div className="bg-popover border rounded-2xl flex flex-col p-3">
                <TextareaAutosize
                    className="focus:outline-none  resize-none text-base px-2 pb-2 pt-1"
                    placeholder="Type your message here..."
                    onKeyDown={getHotkeyHandler([['Enter', (e) => e.preventDefault()]])}
                    maxRows={8}
                    minRows={1}
                    {...inputProps}
                    ref={mergedRef}
                />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <AttachButton />
                        <Button size="sm" variant="ghost">
                            <span>Claude 3.5</span>
                            <IconChevronDown />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 ">
                        <Button
                            size="md-icon"
                            variant={isNotEmpty ? 'default' : 'ghost'}
                            disabled={!isNotEmpty}
                        >
                            <IconArrowUp />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
