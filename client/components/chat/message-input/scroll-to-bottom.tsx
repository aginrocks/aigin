import { Button } from '@/components/ui/button';
import { cn } from '@lib/utils';
import { IconChevronDown } from '@tabler/icons-react';
import React from 'react';

export function ScrollToBottom({
    visible,
    ...props
}: React.ComponentProps<'button'> & { visible?: boolean }) {
    return (
        <div className="flex justify-center pb-4 pointer-events-none">
            <Button
                variant="secondary"
                size="icon"
                className={cn(
                    'rounded-full shadow-lg z-10 bg-popover/80 backdrop-blur-sm border pointer-events-auto transition-all',
                    visible ? 'opacity-100' : 'opacity-0 inisible'
                )}
                aria-label="Scroll to bottom"
                {...props}
            >
                <IconChevronDown className="h-4 w-4" />
            </Button>
        </div>
    );
}
