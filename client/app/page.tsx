'use client';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@lib/trpc';
import { useQuery } from '@tanstack/react-query';

export default function Page() {
    const trpc = useTRPC();

    const greeting = useQuery(trpc.greeting1.queryOptions());

    return (
        <div>
            <Button>a</Button>
            {greeting.data}
        </div>
    );
}
