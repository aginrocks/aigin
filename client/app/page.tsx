'use client';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@lib/trpc';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSubscription } from '@trpc/tanstack-react-query';
import { useEffect, useState } from 'react';

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

    return (
        <div>
            <Button
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
                onClick={() =>
                    generate.mutate({
                        // prompt: '@{app:outline} write a blog post about AI',
                        prompt: '@{app:mail} read my latest email',
                        // prompt: '@{app:clickup} create a todo that says: "build an ai chat app" in "Personal" list',
                        // prompt: '@{app:fetch} summarize this article: https://medium.com/@platform.engineers/deploying-a-simple-web-application-on-kubernetes-43bbf724c23d',
                        // prompt: '@{app:context7} explain layout routes in nextjs approuter',
                        // prompt: '@{app:memory} which desktop environment am I using?',
                        // model: 'google:gemini-2.5-flash-preview-05-20',
                        // model: 'openrouter:openai/gpt-4.1',
                        // model: 'openrouter:anthropic/claude-sonnet-4',
                        model: 'anthropic:claude-3-5-sonnet-20241022',
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
            {msg}
        </div>
    );
}
