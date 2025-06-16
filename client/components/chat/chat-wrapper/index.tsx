import { useTRPC } from '@lib/trpc';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { MessageInput } from '../message-input';

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

    return (
        <div className="w-full h-full relative">
            <div className="h-full w-full overflow-auto p-3">{children}</div>
            <MessageInput
                onSubmit={(d) => generate.mutate({ model: d.model, prompt: d.prompt, chatId })}
            />
        </div>
    );
}
