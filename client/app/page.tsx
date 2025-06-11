'use client';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@lib/trpc';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSubscription } from '@trpc/tanstack-react-query';
import { useState } from 'react';

export default function Page() {
    const trpc = useTRPC();

    const test = useQuery(trpc.auth.info.queryOptions());

    const generate = useMutation(
        trpc.chat.generate.mutationOptions({
            onSuccess: (data) => {
                console.log('Generate success:', data);
            },
            onError: (error) => {
                console.error('Generate error:', error);
            },
        })
    );

    const [msg, setMsg] = useState('');

    const subscription = useSubscription(
        trpc.chat.stream.subscriptionOptions(
            {
                chatId: '684a07d0e4d1230fcaaf67b1',
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

    return (
        <div>
            <Button
                onClick={() =>
                    generate.mutate({
                        prompt: 'write me a poem',
                        model: 'google:gemini-2.5-flash-preview-05-20',
                        chatId: '684a07d0e4d1230fcaaf67b1',
                        // model: 'openai:gpt-4o-mini',
                    })
                }
            >
                b
            </Button>
            {test.data && <div>{JSON.stringify(test.data)}</div>}
            {msg}
        </div>
    );
}
