import { cn } from '@lib/utils';
import { sidebarItem } from '@components/ui/secondary-sidebar/SidebarItem';
import { Icon } from '@tabler/icons-react';
import { VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

export type SidebarTabProps = VariantProps<typeof sidebarItem> &
    React.ComponentProps<'div'> & {
        id: string;
        icon: Icon;
        label: string;
    };

export function SidebarTab({ icon: Icon, label, active, className, ...props }: SidebarTabProps) {
    return (
        <div className={cn(sidebarItem({ active }), 'gap-2', className)} {...props}>
            <Icon size={18} />
            <div
                className={cn(
                    'text-sm',
                    clsx({
                        'font-semibold': active,
                        'font-medium': !active,
                    })
                )}
            >
                {label}
            </div>
        </div>
    );
}
