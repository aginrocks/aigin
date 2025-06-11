import { cva } from 'class-variance-authority';

export const sidebarItem = cva(
    'flex items-center px-2.5 py-2 rounded-md hover:bg-light-background cursor-pointer transition active:bg-secondary-hover text-muted-foreground',
    {
        variants: {
            active: {
                true: 'bg-secondary text-secondary-foreground hover:bg-secondary',
            },
        },
    }
);
