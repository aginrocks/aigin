import { useTRPC } from '@lib/trpc';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { MessageInput } from '../message-input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useRef, useEffect, useState } from 'react';
import { useAutoScroll } from '@/lib/hooks';
import { ChevronDown } from 'lucide-react';

type ChatWrapperProps = {
    children?: React.ReactNode;
    chatId?: string;
    messages?: unknown[]; // Add messages prop to track changes
};

export default function ChatWrapper({ children, chatId, messages = [] }: ChatWrapperProps) {
    const trpc = useTRPC();
    const router = useRouter();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

    const generate = useMutation(
        trpc.chat.generate.mutationOptions({
            onSuccess: (data) => {
                console.log('Generate success:', data);
                router.push(`/chat/${data.chatId}`);
            },
            onError: (error) => {
                console.error('Generate error:', error);
            },
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

            {/* Scroll to bottom button - only show when user is not near bottom and auto-scroll is disabled */}
            {!autoScroll.isNearBottom && !autoScroll.shouldAutoScroll && (
                <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-3 right-3 rounded-full shadow-lg z-10 p-2 h-10 w-10"
                    onClick={() => {
                        autoScroll.scrollToBottom();
                        autoScroll.enableAutoScroll();
                    }}
                    aria-label="Scroll to bottom"
                >
                    <ChevronDown className="h-4 w-4" />
                </Button>
            )}

            <MessageInput
                onSubmit={(d) =>
                    generate.mutate({
                        model: 'google:gemini-2.5-flash-preview-05-20',
                        prompt: d.prompt,
                        chatId,
                    })
                }
            />
        </div>
    );
}
