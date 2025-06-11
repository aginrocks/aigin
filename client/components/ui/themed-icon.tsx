import { cn } from '@lib/utils';
import { Icon } from '@tabler/icons-react';
import { cva, VariantProps } from 'class-variance-authority';

export type ThemedIconProps = React.ComponentProps<'div'> &
    VariantProps<typeof themedIconVariants> & {
        icon: Icon;
    };

const themedIconVariants = cva('rounded-[99999px] flex justify-center items-center', {
    variants: {
        color: {
            red: 'bg-red-600/20',
            blue: 'bg-blue-600/20',
            green: 'bg-green-600/20',
        },
        size: {
            md: 'w-8 h-8',
            lg: 'w-12 h-12',
        },
    },
});

const themedIconIconVariants = cva('', {
    variants: {
        color: {
            red: 'text-red-400',
            blue: 'text-blue-400',
            green: 'text-green-400',
        },
    },
});

export function ThemedIcon({
    icon: Icon,
    className,
    color = 'blue',
    size = 'lg',
    ...props
}: ThemedIconProps) {
    const iconSizes = {
        md: 18,
        lg: 22,
    };

    return (
        <div className={cn(themedIconVariants({ color, size }), className)} {...props}>
            <Icon
                size={iconSizes[size ?? 'lg']}
                className={cn(themedIconIconVariants({ color }))}
            />
        </div>
    );
}
