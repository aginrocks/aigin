import { Setting, SettingsGroup } from '@/components/settings';

export function Appearance() {
    return (
        <>
            <SettingsGroup title="Appearance">
                <Setting
                    title="Theme"
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
                />
                <Setting
                    title="Theme"
                    description="Choose between light and dark mode."
                    type="switch"
                />
            </SettingsGroup>
        </>
    );
}
