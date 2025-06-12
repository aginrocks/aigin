'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ModalProps } from '../ModalsManager';
import {
    IconApps,
    IconBrush,
    IconHelp,
    IconKey,
    IconMessage,
    IconUsers,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Appearance } from './Appearance';
import { SettingsSidebar, SidebarTab, SidebarTabProps } from '@/components/settings';
import { SettingsPage } from '@/components/settings/settings-page';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { FormProvider, useForm } from 'react-hook-form';
import { AppRouter } from '../../../../server/src';
import { useTRPC } from '@lib/trpc';
import { useQuery } from '@tanstack/react-query';

export type SettingsTabName =
    | 'account'
    | 'appearance'
    | 'models'
    | 'api-keys'
    | 'applications'
    | 'about';

type SettingsTab = Omit<SidebarTabProps, 'active'>;

const tabs: SettingsTab[] = [
    {
        id: 'account',
        icon: IconUsers,
        label: 'Account',
    },
    {
        id: 'appearance',
        icon: IconBrush,
        label: 'Appearance',
    },
    {
        id: 'models',
        icon: IconMessage,
        label: 'Models',
    },
    {
        id: 'api-keys',
        icon: IconKey,
        label: 'Api Keys',
    },
    {
        id: 'applications',
        icon: IconApps,
        label: 'Applications',
    },
    {
        id: 'about',
        icon: IconHelp,
        label: 'About',
    },
];

export type Settings = Awaited<ReturnType<AppRouter['settings']['getUserSettings']>>;

export function Settings({
    payload,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & ModalProps<'Settings'>) {
    const [tab, setTab] = useState<SettingsTabName>(payload?.initialTab || 'account');

    const trpc = useTRPC();
    const settingsData = useQuery(trpc.settings.getUserSettings.queryOptions());

    const settingForm = useForm<Settings>({
        values: settingsData.data,
    });

    const nerd = settingForm.watch('statsForNerds');

    return (
        <FormProvider {...settingForm}>
            <Dialog {...props}>
                <DialogContent className="sm:max-w-3xl h-150 p-0 bg overflow-hidden">
                    <DialogTitle className="sr-only">Settings</DialogTitle>
                    <div className="flex w-full h-full">
                        {nerd && 'nerd'}
                        <SettingsSidebar title="Settings">
                            {tabs.map((t) => (
                                <SidebarTab
                                    key={t.id}
                                    {...t}
                                    active={t.id === tab}
                                    onClick={() => setTab(t.id as SettingsTabName)}
                                />
                            ))}
                        </SettingsSidebar>
                        <SettingsPage>{tab === 'appearance' && <Appearance />}</SettingsPage>
                    </div>
                </DialogContent>
            </Dialog>
        </FormProvider>
    );
}
