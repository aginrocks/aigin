'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ModalProps } from '../ModalsManager';
import {
    IconBell,
    IconBrush,
    IconDevices,
    IconHelp,
    IconKey,
    IconKeyboard,
    IconMicrophone,
    IconUsers,
} from '@tabler/icons-react';
import { useState } from 'react';
import { Appearance } from './Appearance';
import { SettingsSidebar, SidebarTab, SidebarTabProps } from '@/components/settings';
import { SettingsPage } from '@/components/settings/settings-page';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export type SettingsTabName =
    | 'accounts'
    | 'appearance'
    | 'devices'
    | 'encryption'
    | 'notifications'
    | 'voice-video'
    | 'keybinds'
    | 'about';

type SettingsTab = Omit<SidebarTabProps, 'active'>;

const tabs: SettingsTab[] = [
    {
        id: 'accounts',
        icon: IconUsers,
        label: 'Accounts',
    },
    {
        id: 'appearance',
        icon: IconBrush,
        label: 'Appearance',
    },
    {
        id: 'devices',
        icon: IconDevices,
        label: 'Devices',
    },
    {
        id: 'encryption',
        icon: IconKey,
        label: 'Encryption',
    },
    {
        id: 'notifications',
        icon: IconBell,
        label: 'Notifications',
    },
    {
        id: 'voice-video',
        icon: IconMicrophone,
        label: 'Voice & Video',
    },
    {
        id: 'keybinds',
        icon: IconKeyboard,
        label: 'Keybinds',
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
    const [tab, setTab] = useState<SettingsTabName>(payload?.initialTab || 'accounts');

    return (
        <Dialog {...props}>
            <DialogContent className="w-4xl h-150 p-0 bg overflow-hidden">
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
