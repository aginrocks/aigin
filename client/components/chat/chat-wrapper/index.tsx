import { useTRPC } from '@lib/trpc';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { MessageInput } from '../message-input';
import { ScrollArea } from '@/components/ui/scroll-area';

type ChatWrapperProps = {
    children?: React.ReactNode;
    chatId?: string;
};

export default function ChatWrapper({ children, chatId }: ChatWrapperProps) {
    const trpc = useTRPC();

    const router = useRouter();

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

    // TODO: Change hardcoded model to user selected model
    return (
        <div className="w-full h-full relative">
            <ScrollArea className="w-full h-full">
                <div className="p-3">{children}</div>
            </ScrollArea>
            <MessageInput
                onSubmit={(d) =>
                    generate.mutate({
                        model: 'anthropic:claude-3-5-sonnet-20241022',
                        prompt: d.prompt,
                        chatId,
                    })
                }
            />
        </div>
    );
}
