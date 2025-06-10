'use client';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@lib/trpc';
import { useMutation, useQuery } from '@tanstack/react-query';

export default function Page() {
    const trpc = useTRPC();

    const register = useMutation(trpc.auth.register.mutationOptions());

    const test = useQuery(trpc.test2.queryOptions());

    return (
        <div>
            <Button
                onClick={() =>
                    register.mutate({
                        email: 'test@test.test',
                        password: 'test',
                        name: 'Test User',
                    })
                }
            >
                a
            </Button>
            {test.data && <div>{JSON.stringify(test.data)}</div>}
        </div>
    );
}
