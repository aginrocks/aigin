import { ReactNode } from 'react';

export type SettingsPageProps = {
    children?: ReactNode;
};

export function SettingsPage({ children }: SettingsPageProps) {
    // pt-4
    return <div className="pt-4 w-full h-full flex-1 px-4 flex flex-col gap-3">{children}</div>;
}
