import { cn } from '@lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const gradientVariants = cva(
    'absolute left-0 right-0 from-sidebar to-transparent h-4 z-1 pointer-events-none',
    {
        variants: {
            position: {
                top: 'bg-gradient-to-b bottom-0 translate-y-full',
                bottom: 'bg-gradient-to-t top-0 -translate-y-full',
            },
        },
    }
);

export type SidebarGradientProps = React.ComponentProps<'div'> &
    VariantProps<typeof gradientVariants>;

export function SidebarGradient({ className, position }: SidebarGradientProps) {
    return <div className={cn(gradientVariants({ position }), className)} />;
}
