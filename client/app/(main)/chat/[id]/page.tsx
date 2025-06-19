'use client';
import ChatWrapper from '@/components/chat/chat-wrapper';
import { GetModelsOutput, Outputs, useTRPC } from '@lib/trpc';
import { useSubscription } from '@trpc/tanstack-react-query';
import { useParams } from 'next/navigation';
import { useEffect, useReducer, useRef, useState } from 'react';
import { AsyncIterableData } from '@/components/sidebar-tiles';
import MarkdownRenderer from '@/components/chat/markdown';
import UserMessage from '@/components/chat/user-message';
import { useMutation, useQuery } from '@tanstack/react-query';
import Spinner from '@/components/loaders/spinner';
import { useSetAtom } from 'jotai';
import { selectedModelAtom } from '@lib/atoms/selectedmodel';
import { chatMessagesReducer } from '@lib/reducers';
import { Button } from '@/components/ui/button';
import { ToolCall } from '@/components/ui/tool-call';

export type Chat = Outputs['chat']['get'];

export type ChatStream = AsyncIterableData<Outputs['chat']['stream']>;

export type ToolMapping = (ChatStream & { type: 'tool:call-metadata' })['data'][0];

export default function ChatPage() {
    const trpc = useTRPC();

    const { id: chatId } = useParams();

    const [msg, dispatchMsg] = useReducer(chatMessagesReducer, []);
    const [isGenerating, setGenerating] = useState(false);

    const [toolsMappings, setToolsMappings] = useState<ToolMapping[]>([]);

    const confirmCall = useMutation(trpc.chat.confirmMCPCall.mutationOptions());

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

    useEffect(() => {
        dispatchMsg({
            type: 'SET',
            data: [],
        });
    }, [chatId]);

    function handleData(part: ChatStream) {
        if (part.type == 'message:created') {
            console.log('New message created:', part);

            dispatchMsg({
                type: 'ADD_MESSAGE',
                data: part.data,
            });

            return;
        } else if (part.type === 'message:delta') {
            dispatchMsg({
                type: 'APPEND_LAST_MESSAGE_PART_TEXT',
                data: part.data[0].textDelta,
            });

            setGenerating(false);
        } else if (part.type === 'message:completed') {
            console.log('Message completed:', part);

            setGenerating(false);
            return;
        } else if (part.type === 'message:error') {
            console.log('Message error:', part);

            setGenerating(false);
            return;
        } else if (part.type === 'tool:call-metadata') {
            setToolsMappings((m) => [...m, part.data[0]]);
            console.log('Tool call metadata received:', part.data[0]);
        } else if (part.type === 'tool:call') {
            console.log('Reeived tool call:', part.data[0]);

            dispatchMsg({
                type: 'ADD_LAST_MESSAGE_PART',
                data: part.data[0],
            });
        }
    }

    //data fetching
    const data = useQuery({
        ...trpc.chat.get.queryOptions({ chatId: chatId?.toString() || '' }),
        refetchOnWindowFocus: false,
    });
    const { data: models } = useQuery(trpc.models.get.queryOptions({}));

    const setSelectedModelAtom = useSetAtom(selectedModelAtom);
    useEffect(() => {
        if (!data.data) return;
        console.log('Fetched chat data:', data.data);

        const chatData = data.data as Chat;
        dispatchMsg({
            type: 'PREPEND',
            data: chatData.messages,
        });

        // console.log('modle', data.data?.model);

        if (data.data?.model) {
            console.log('Setting model111:');
            const modelToSet = models?.find((model) =>
                model.providers.some((s) => s.modelId == data.data?.model.split(':')[1])
            );
            setSelectedModelAtom(modelToSet);
        }
    }, [data.data]);

    return (
        <ChatWrapper setGenerate={setGenerating} chatId={chatId?.toString()} messages={msg}>
            <div className="max-w-4xl mx-auto p-7 pb-40 flex flex-col gap-5">
                {msg.map((message: Chat['messages'][0]) => {
                    let parts = message.parts ? [...message.parts] : [];

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
                        } else if (part.type === 'tool-invocation') {
                            const mapping = toolsMappings.find(
                                (m) => m.callId === part.toolInvocation.toolCallId
                            );

                            return (
                                <ToolCall
                                    key={index}
                                    data={mapping}
                                    callId={part.toolInvocation.toolCallId}
                                    toolName={part.toolInvocation.toolName}
                                    args={part.toolInvocation.args}
                                    onConfirm={() => {
                                        confirmCall.mutate({
                                            callId: part.toolInvocation.toolCallId,
                                            canContinue: true,
                                        });
                                    }}
                                />
                            );
                        }
                    });

                    return messageParts;
                })}
                {isGenerating && <Spinner />}
            </div>
        </ChatWrapper>
    );
}
