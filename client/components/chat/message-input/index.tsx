import { Button } from '@components/ui/button';
import { IconChevronDown, IconSend2 } from '@tabler/icons-react';
import TextareaAutosize from 'react-textarea-autosize';
import { AttachButton } from './attach-button';
import { getHotkeyHandler } from '@mantine/hooks';
import { useEffect, useRef } from 'react';
import { useStartTyping } from 'react-use';

export function MessageInput() {
    const ref = useRef<HTMLTextAreaElement>(null);

    useStartTyping(() => ref.current?.focus());
    useEffect(() => ref.current?.focus(), []);

    return (
        <div className="w-full max-w-4xl mx-auto p-1">
            <div className="relative bg-secondary border rounded-2xl flex flex-col p-4">
                <TextareaAutosize
                    className="flex-1 focus:outline-none  resize-none text-base"
                    placeholder="Type your message here..."
                    onKeyDown={getHotkeyHandler([['Enter', (e) => e.preventDefault()]])}
                    maxRows={8}
                    minRows={1}
                    ref={ref}
                />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AttachButton />
                        <Button size="sm" variant="outline">
                            <span>Claude 3.5</span>
                            <IconChevronDown />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 ">
                        <Button size="sm" variant="ghost">
                            <IconSend2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
