'use client';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@lib/trpc';
import { useMutation, useQuery } from '@tanstack/react-query';

export default function Page() {
    const trpc = useTRPC();

    const test = useQuery(trpc.auth.info.queryOptions());

    const logout = useMutation(trpc.auth.logout.mutationOptions());

    return (
        <div>
            <Button onClick={() => logout.mutate()}>b</Button>
            {test.data && <div>{JSON.stringify(test.data)}</div>}
        </div>
    );
}
