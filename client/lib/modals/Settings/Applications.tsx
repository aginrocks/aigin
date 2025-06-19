import { SettingsGroup } from '@/components/settings';
import { useTRPC } from '@lib/trpc';
import { useQuery } from '@tanstack/react-query';
import { useModals } from '../ModalsManager';

export default function Applications() {
    const trpc = useTRPC();

    const modals = useModals();

    const { data: apps } = useQuery(trpc.apps.getAll.queryOptions());

    return (
        <>
            <SettingsGroup title="Appications">
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
                            <img
                                src={app.icon || undefined}
                                alt={app.name}
                                className="w-12 h-12 mb-2"
                            />
                            <span className="text-sm font-bold text-center">{app.name}</span>
                        </div>
                    ))}
                </div>
            </SettingsGroup>
        </>
    );
}
