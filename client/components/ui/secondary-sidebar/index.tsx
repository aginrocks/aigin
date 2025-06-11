import { cn } from '@lib/utils';
import { ReactNode } from 'react';

export type SecondarySidebarProps = React.ComponentProps<'div'> & {
    children?: ReactNode;
};

export function SecondarySidebar({ children, className, ...props }: SecondarySidebarProps) {
    return (
        <div className={cn('flex flex-col h-full max-h-full w-65', className)} {...props}>
            {children}
        </div>
    );
}

export * from './wrapper';
