import { cn } from '@lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';

export type HeaderProps = VariantProps<typeof headerVariants> &
    React.ComponentProps<'div'> & {
        children?: ReactNode;
        title?: string;
        rightSection?: ReactNode;
    };

const headerVariants = cva('flex h-12 border-b border-light-border', {
    variants: {
        custom: {
            false: 'px-4 items-center justify-between',
        },
    },
    defaultVariants: {
        custom: false,
    },
});

export function Header({
    children,
    title,
    rightSection,
    custom = false,
    className,
    ...props
}: HeaderProps) {
    return (
        <div className={cn(headerVariants({ custom }), className)} {...props}>
            {custom ? (
                children
            ) : (
                <>
                    <div className="flex items-center gap-2">
                        {title && <div className="font-semibold">{title}</div>}
                        {children}
                    </div>
                    <div className="flex items-center">{rightSection}</div>
                </>
            )}
        </div>
    );
}
