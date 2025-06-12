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
import { useState } from 'react';
import { Appearance } from './Appearance';
import { SettingsSidebar, SidebarTab, SidebarTabProps } from '@/components/settings';
import { SettingsPage } from '@/components/settings/settings-page';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

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

export function Settings({
    payload,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & ModalProps<'Settings'>) {
    const [tab, setTab] = useState<SettingsTabName>(payload?.initialTab || 'account');

    return (
        <Dialog {...props}>
            <DialogContent className="sm:max-w-3xl h-150 p-0 bg overflow-hidden">
                <DialogTitle className="sr-only">Settings</DialogTitle>
                <div className="flex w-full h-full">
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
    );
}
