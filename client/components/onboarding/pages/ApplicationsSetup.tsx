import { SettingsGroup } from '@/components/settings';
import { OnboardingHeader } from '../onboarding-header';
import { useTRPC } from '@lib/trpc';
import { useModals } from '@lib/modals/ModalsManager';
import { useQuery } from '@tanstack/react-query';
import { IconApps, IconArrowRight, IconCheck } from '@tabler/icons-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ApplicationsSetup() {
    const trpc = useTRPC();

    const modals = useModals();

    const { data: apps } = useQuery(trpc.apps.getAll.queryOptions());

    return (
        <div className="flex flex-col gap-4">
            <OnboardingHeader
                title="Choose your applications"
                description="Select the applications you want to use and configure them."
                icon={IconApps}
            />
            <SettingsGroup>
                <div className="h-140 overflow-auto grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {apps?.map((app) => (
                        <div
                            onClick={() => {
                                modals.show('AppSet', {
                                    title: `Configure ${app.name}`,
                                    app: app,
                                });
                            }}
                            key={app.slug}
                            className="flex flex-col items-center p-4 border rounded-lg hover:bg-secondary"
                        >
                            {/* @ts-ignore */}
                            <img src={app.icon || null} alt={app.name} className="w-12 h-12 mb-2" />
                            <span className="text-sm font-bold text-center">{app.name}</span>
                        </div>
                    ))}
                </div>
            </SettingsGroup>
            <div className="flex justify-end mt-4">
                <Link href={'/'}>
                    <Button size="lg">
                        Done
                        <IconCheck />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
