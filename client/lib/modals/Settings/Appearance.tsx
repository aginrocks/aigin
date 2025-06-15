import { Setting, SettingsGroup } from '@/components/settings';
import { useSetSettings } from '@lib/hooks';
import { useTRPC } from '@lib/trpc';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Settings } from '.';
import { FormControl, FormField, FormItem } from '@/components/ui/form';

export function Appearance() {
    const { setTheme, theme } = useTheme();
    // const setSetting = useSetSettings();

    // const trpc = useTRPC();
    // const settingsData = useQuery(trpc.settings.getUserSettings.queryOptions()).data;

    // useEffect(() => {
    //     console.log(settingsData);
    // }, [settingsData]);

    const form = useFormContext<Settings>();

    return (
        <>
            <SettingsGroup title="Appearance">
                <Setting
                    title="Theme"
                    defaultValue={theme}
                    description="Choose between light and dark mode."
                    type="select"
                    options={[
                        {
                            label: 'Light',
                            value: 'light',
                        },
                        {
                            label: 'Dark',
                            value: 'dark',
                        },
                        {
                            label: 'System',
                            value: 'system',
                        },
                    ]}
                    onValueChange={(value) => {
                        setTheme(value);
                    }}
                />
                <Setting
                    title="Stats For Nerds"
                    description="Enable or disable additional info for nerds."
                    type="switch"
                    name="statsForNerds"
                    formControl={form.control}
                />
            </SettingsGroup>
        </>
    );
}
