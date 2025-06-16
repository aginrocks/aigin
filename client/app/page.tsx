'use client';
import ChatWrapper from '@/components/chat/chat-wrapper';
import { MessageInput } from '@/components/chat/message-input';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@lib/trpc';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSubscription } from '@trpc/tanstack-react-query';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

export default function Page() {
    const trpc = useTRPC();

    const test = useQuery(trpc.auth.info.queryOptions());
    const settings = useQuery(trpc.settings.getUserSettings.queryOptions());

    const [chatId, setChatId] = useState<string | null>(null);

    const generate = useMutation(
        trpc.chat.generate.mutationOptions({
            onSuccess: (data) => {
                console.log('Generate success:', data);
                setChatId(data.chatId);
            },
            onError: (error) => {
                console.error('Generate error:', error);
            },
        })
    );

    const share = useMutation(
        trpc.chat.share.mutationOptions({
            onSuccess: (data) => {
                console.log('Share success:', data);
            },
        })
    );

    const configureApp = useMutation(trpc.apps.configure.mutationOptions());

    const [msg, setMsg] = useState('');

    const subscription = useSubscription(
        trpc.chat.stream.subscriptionOptions(
            {
                chatId: chatId || '',
            },
            {
                onData: (data) => {
                    console.log('Subscription data:', data);
                    setMsg((m) => `${m}${data.textDelta}`);
                },
                onError: (error) => {
                    console.error('Subscription error:', error);
                },
            }
        )
    );

    return <ChatWrapper></ChatWrapper>;
}
