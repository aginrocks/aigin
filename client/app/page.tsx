'use client';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@lib/trpc';
import { useMutation, useQuery } from '@tanstack/react-query';

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

    return (
        <div>
            <Button
                onClick={() =>
                    generate.mutate({
                        prompt: 'Write a very long story',
                        // model: 'google:gemini-2.5-flash-preview-05-20',
                        model: 'openai:gpt-4o-mini',
                    })
                }
            >
                b
            </Button>
            {test.data && <div>{JSON.stringify(test.data)}</div>}
        </div>
    );
}
