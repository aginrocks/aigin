import { cn } from '@lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { ReactNode } from 'react';

export type HeaderProps = VariantProps<typeof headerVariants> &
    React.ComponentProps<'div'> & {
        children?: ReactNode;
        title?: string;
        rightSection?: ReactNode;
        logo?: boolean;
    };

const headerVariants = cva('flex h-12', {
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
    logo,
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
                        {logo && (
                            <Link href="/" className="hover:opacity-90 transition-opacity">
                                <img src="/logo-dark.svg" className="not-dark:hidden" />
                                <img src="/logo-light.svg" className="dark:hidden" />
                            </Link>
                        )}
                        {children}
                    </div>
                    <div className="flex items-center">{rightSection}</div>
                </>
            )}
        </div>
    );
}
