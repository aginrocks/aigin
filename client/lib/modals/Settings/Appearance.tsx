import { Setting, SettingsGroup } from '@/components/settings';
import { useTheme } from 'next-themes';
import { useFormContext } from 'react-hook-form';
import { Settings } from '.';

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
                    name="theme"
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
