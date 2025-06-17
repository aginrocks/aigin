import { Setting, SettingsGroup } from '@/components/settings';
import { useTheme } from 'next-themes';
import { useFormContext } from 'react-hook-form';
import { Settings } from '.';

export function Account() {
    const form = useFormContext<Settings>();

    return (
        <>
            <SettingsGroup title="Account">
                <Setting
                    title="Call name"
                    name="callName"
                    description="What should we call you?"
                    type="text"
                    formControl={form.control}
                />
                <Setting
                    title="Profession"
                    description="What do you do?"
                    type="text"
                    name="profession"
                    formControl={form.control}
                />
            </SettingsGroup>
        </>
    );
}
