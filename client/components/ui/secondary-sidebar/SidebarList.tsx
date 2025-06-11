import { cn } from '@lib/utils';
import { ReactNode } from 'react';

export type SidebarListProps = React.ComponentProps<'div'> & {
    children?: ReactNode;
};

export function SidebarList({ children, className, ...props }: SidebarListProps) {
    return (
        <div className={cn('px-1.5 py-1.5 flex flex-col gap-0.5', className)} {...props}>
            {children}
        </div>
    );
}
