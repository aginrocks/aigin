import { ReactNode } from 'react';
import { SecondarySidebar } from '../ui/secondary-sidebar';
import { SidebarList } from '../ui/secondary-sidebar/SidebarList';

export type SettingsSidebarProps = {
    title: string;
    children?: ReactNode;
};
export function SettingsSidebar({ title, children }: SettingsSidebarProps) {
    return (
        <SecondarySidebar className="w-45 px-2 py-4 border-r">
            <div className="text-xl font-semibold px-4 pb-2">{title}</div>
            <SidebarList className="gap-1">{children}</SidebarList>
        </SecondarySidebar>
    );
}
