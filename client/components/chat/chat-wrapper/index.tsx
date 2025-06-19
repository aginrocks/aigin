import { generateChatInputs, generateChatOutput, useTRPC } from '@lib/trpc';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { MessageInput } from '../message-input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useRef, useEffect, useState, Dispatch } from 'react';
import { useAutoScroll } from '@/lib/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { SetStateAction, useAtom } from 'jotai';
import { selectedModelAtom } from '@lib/atoms/selectedmodel';

type ChatWrapperProps = {
    children?: React.ReactNode;
    chatId?: string;
    messages?: unknown[];
    setGenerate: Dispatch<SetStateAction<boolean>>;
};

export default function ChatWrapper({
    children,
    chatId,
    messages = [],
    setGenerate,
}: ChatWrapperProps) {
    const trpc = useTRPC();
    const router = useRouter();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

    const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);

    const generate = useMutation(
        trpc.chat.generate.mutationOptions({
            onSuccess: (data: generateChatOutput) => {
                console.log('Generate success:', data);
                router.push(`/chat/${data.chatId}`);
            },
            // Remove onError since it's handled globally now
        })
    );

    // Find the actual scrollable element inside ScrollArea
    useEffect(() => {
        if (scrollAreaRef.current) {
            // ScrollArea from Radix/shadcn uses data-slot="scroll-area-viewport" for the viewport
            const viewport = scrollAreaRef.current.querySelector(
                '[data-slot="scroll-area-viewport"]'
            ) as HTMLElement;
            setScrollElement(viewport);
        }
    }, []);

    // Use auto scroll hook
    const autoScroll = useAutoScroll({
        scrollElement,
        dependencies: [messages, children],
        threshold: 100,
        smooth: true,
    });

    // TODO: Change hardcoded model to user selected model
    return (
        <div className="w-full h-full relative">
            <ScrollArea className="w-full h-full" ref={scrollAreaRef}>
                <div className="p-3">{children}</div>
            </ScrollArea>

            <MessageInput
                onSubmit={(d) => {
                    generate.mutate({
                        model: d.provider + ':' + d.model,
                        prompt: d.prompt,
                        modelSlug: selectedModel?.slug,
                        chatId,
                    } as generateChatInputs);
                    setGenerate?.(true);
                }}
                scrollToBottomVisible={!autoScroll.isNearBottom && !autoScroll.shouldAutoScroll}
                scrollToBottom={autoScroll.scrollToBottom}
            />
        </div>
    );
}
