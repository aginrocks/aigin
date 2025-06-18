import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GetAppsOutput, useTRPC } from '@lib/trpc';
import { IconApps } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

interface AppSelectProps {
    onClick?: (app: GetAppsOutput[number]) => void;
}

export default function AppSelect({ onClick }: AppSelectProps) {
    const trpc = useTRPC();

    const { data: apps } = useQuery(trpc.apps.getAll.queryOptions());

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="md-icon" className="dark:hover:bg-secondary-hover-2">
                    <IconApps />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {apps?.map((app) => (
                    <DropdownMenuItem key={app.slug} onClick={() => onClick?.(app)}>
                        {app.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
