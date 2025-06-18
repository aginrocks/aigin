import { Button } from '@/components/ui/button';
import { cn } from '@lib/utils';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { ComponentProps, useState } from 'react';

interface CopyProps extends ComponentProps<'button'> {
    content: string;
}

export default function Copy({ className, ...props }: CopyProps) {
    const [animate, setAnimate] = useState(false);

    return (
        <Button
            size={'icon'}
            variant={'ghost'}
            onClick={() => {
                navigator.clipboard.writeText(props.content);
                setAnimate(true);
                setTimeout(() => setAnimate(false), 2000);
            }}
            className={cn('z-10', className)}
            {...props}
        >
            {animate ? <IconCheck /> : <IconCopy />}
        </Button>
    );
}
