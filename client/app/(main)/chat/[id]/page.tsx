'use client';
import ChatWrapper from '@/components/chat/chat-wrapper';
import { GetModelsOutput, Outputs, useTRPC } from '@lib/trpc';
import { useSubscription } from '@trpc/tanstack-react-query';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AsyncIterableData } from '@/components/sidebar-tiles';
import MarkdownRenderer from '@/components/chat/markdown';
import UserMessage from '@/components/chat/user-message';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@/components/loaders/spinner';
import { useSetAtom } from 'jotai';
import { selectedModelAtom } from '@lib/atoms/selectedmodel';

export type Chat = Outputs['chat']['get'];

export type ChatStream = AsyncIterableData<Outputs['chat']['stream']>;

export default function ChatPage() {
    const trpc = useTRPC();

    const { id: chatId } = useParams();

    const [msg, setMsg] = useState<Chat['messages']>([]);
    const messagesRef = useRef<Chat['messages']>([]);
    const [isGenerating, setGenerating] = useState(false);

    //data streaming
    useSubscription(
        trpc.chat.stream.subscriptionOptions(
            {
                chatId: chatId?.toString() || '',
            },
            {
                onData: handleData,
                onError: (error) => {
                    console.error('Subscription error:', error);
                },
            }
        )
    );

    function handleData(part: ChatStream) {
        if (part.type == 'message:created') {
            console.log('New message created:', part);

            messagesRef.current.push(part.data[0]);
            setMsg((prev: Chat['messages']) => [...prev, part.data[0]]);

            return;
        } else if (part.type === 'message:delta') {
            const assistantMessages = messagesRef.current.filter(
                (message: Chat['messages'][0]) => message.role === 'assistant'
            );
            const lastMessage = assistantMessages[assistantMessages.length - 1];

            const data = part.data[0];
            if (!lastMessage) {
                console.warn('No matching last message found for delta update:', data);
                return;
            }

            const lastPart = lastMessage.parts?.[lastMessage.parts.length - 1];
            if (lastPart && lastPart.type === 'text') {
                lastPart.text += data.textDelta;
            } else {
                lastMessage.parts = [
                    ...(lastMessage.parts || []),
                    { type: 'text', text: data.textDelta },
                ];
            }

            console.log('Updated message:', lastMessage);
            setMsg((msg: Chat['messages']) => [...msg.slice(0, -1), lastMessage]);
            setGenerating(false);

            messagesRef.current = [...messagesRef.current.slice(0, -1), lastMessage];
        } else if (part.type === 'message:completed') {
            console.log('Message completed:', part);

            setGenerating(false);
            return;
        } else if (part.type === 'message:error') {
            console.log('Message error:', part);

            setGenerating(false);
            return;
        }
    }

    //data fetching
    const data = useQuery(trpc.chat.get.queryOptions({ chatId: chatId?.toString() || '' }));
    const { data: models } = useQuery(trpc.models.get.queryOptions({}));

    const setSelectedModelAtom = useSetAtom(selectedModelAtom);
    useEffect(() => {
        if (!data.data) return;
        console.log('Fetched chat data:', data.data);

        const chatData = data.data as Chat;
        setMsg(chatData.messages || []);
        messagesRef.current = chatData.messages || [];

        console.log('modle', data.data?.model);

        if (data.data?.model) {
            const modelToSet = models?.find((model) =>
                model.providers.some((s) => s.modelId == data.data?.model.split(':')[1])
            );
            console.log('Setting model:', modelToSet);
            setSelectedModelAtom(modelToSet);
        } else {
            setSelectedModelAtom(models?.[1]);
        }
    }, [data.data]);

    return (
        <ChatWrapper setGenerate={setGenerating} chatId={chatId?.toString()} messages={msg}>
            <div className="max-w-4xl mx-auto p-7 pb-40 flex flex-col gap-5">
                {msg.map((message: Chat['messages'][0]) => {
                    let parts = message.parts;

                    if (!parts || parts.length === 0) {
                        parts = [];
                        parts.push({ text: message.content, type: 'text' });
                    }

                    const messageParts = parts.map((part: (typeof parts)[0], index: number) => {
                        if (part.type === 'text') {
                            if (message.role === 'user') {
                                return <UserMessage key={index}>{part.text}</UserMessage>;
                            } else if (message.role === 'assistant') {
                                return <MarkdownRenderer key={index}>{part.text}</MarkdownRenderer>;
                            }
                        }
                    });

                    return messageParts;
                })}
                {isGenerating && <Spinner />}
            </div>
        </ChatWrapper>
    );
}
