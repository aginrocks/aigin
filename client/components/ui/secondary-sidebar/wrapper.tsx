import { ReactNode } from 'react';
import { SecondarySidebar } from '.';

export type SecondarySidebarWrapperProps = {
    children?: ReactNode;
    sidebarContent?: ReactNode;
};

export function SecondarySidebarWrapper({
    children,
    sidebarContent,
}: SecondarySidebarWrapperProps) {
    return (
        <div className="flex w-full h-full flex-1">
            <SecondarySidebar>{sidebarContent}</SecondarySidebar>
            <div className="flex-1 bg-light-background">{children}</div>
        </div>
    );
}
