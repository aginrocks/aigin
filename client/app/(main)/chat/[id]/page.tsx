'use client';
import ChatWrapper from '@/components/chat/chat-wrapper';
import { Outputs, useTRPC } from '@lib/trpc';
import { useSubscription } from '@trpc/tanstack-react-query';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AsyncIterableData } from '@/components/sidebar-tiles';
import MarkdownRenderer from '@/components/chat/markdown';
import UserMessage from '@/components/chat/user-message';
import { useQuery } from '@tanstack/react-query';

export type Chat = Outputs['chat']['get'];

export type ChatStream = AsyncIterableData<Outputs['chat']['stream']>;

export default function ChatPage() {
    const trpc = useTRPC();

    const { id: chatId } = useParams();

    const [msg, setMsg] = useState<Chat['messages']>([]);
    const messagesRef = useRef<Chat['messages']>([]);

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

            // console.log('Updated message:', lastMessage);
            setMsg((msg: Chat['messages']) => [...msg.slice(0, -1), lastMessage]);
            messagesRef.current = [...messagesRef.current.slice(0, -1), lastMessage];
        }
    }

    //data fetching
    const data = useQuery(trpc.chat.get.queryOptions({ chatId: chatId?.toString() || '' }));

    useEffect(() => {
        if (!data.data) return;
        const chatData = data.data as Chat;
        setMsg(chatData.messages || []);
    }, [data.data]);

    return (
        <ChatWrapper chatId={chatId?.toString()} messages={msg}>
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
            </div>

            {/* <Button
                    onClick={() =>
                    share.mutate({
                        chatId: '684ca6cc15ea4a1b1032395b',
                        })
                        }
                        >
                        share
                        </Button>
                        <Button
                        onClick={() =>
                        configureApp.mutate({
                            appSlug: 'notion',
                            enabled: true,
                            config: [
                                {
                                    id: 'api_key',
                                    value: prompt('API Key')!,
                                    },
                                    ],
                                    })
                                    }
                                    >
                                    configure notion
                                    </Button>
                                    <Button
                                    variant="secondary"
                                    onClick={() =>
                                    generate.mutate({
                                        // prompt: '@{app:outline} write a blog post about AI',
                                        // prompt: '@{app:mail} read my latest email',
                                        // prompt: '@{app:clickup} create a todo that says: "build an ai chat app" in "Personal" list',
                                        // prompt: '@{app:fetch} summarize this article: https://medium.com/@platform.engineers/deploying-a-simple-web-application-on-kubernetes-43bbf724c23d',
                                        // prompt: '@{app:context7} explain layout routes in nextjs approuter',
                                        // prompt: '@{app:memory} which desktop environment am I using?',
                                        prompt: 'how to use mongodb in js',
                                        model: 'google:gemini-2.5-flash-preview-05-20',
                                        // model: 'openrouter:openai/gpt-4.1',
                                        // model: 'openrouter:anthropic/claude-sonnet-4',
                            // model: 'anthropic:claude-3-5-sonnet-20241022',
                            // model: 'groq:deepseek-r1-distill-llama-70b',
                            // model: 'groq:meta-llama/llama-4-scout-17b-16e-instruct',
                            // chatId: '684a07d0e4d1230fcaaf67b1',
                            // model: 'openai:gpt-4o-mini',
                            // model: 'azure:meta/Llama-4-Scout-17B-16E-Instruct',
                            // model: 'azure:openai/gpt-4.1',
                            })
                            }
                            >
                            b
                            </Button>
                            {settings.data && <div>{JSON.stringify(settings.data)}</div>}
                            {test.data && <div>{JSON.stringify(test.data)}</div>}
                            {msg} */}
        </ChatWrapper>
    );
}
