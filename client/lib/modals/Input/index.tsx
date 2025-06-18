import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ModalProps, useModals } from '../ModalsManager';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getHotkeyHandler } from '@mantine/hooks';
import { useRef } from 'react';

export function InputDialog({
    payload,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & ModalProps<'Input'>) {
    const modals = useModals();

    const inputRef = useRef<HTMLInputElement>(null);

    function handleSubmit() {
        modals.hide('Input', inputRef.current?.value);
    }

    return (
        <Dialog {...props}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{payload?.title || 'Input'}</DialogTitle>
                    <DialogDescription>{payload?.description}</DialogDescription>
                </DialogHeader>
                <Input
                    defaultValue={payload?.initialValue}
                    ref={inputRef}
                    onKeyDown={getHotkeyHandler([
                        [
                            'Enter',
                            (e) => {
                                e.preventDefault();
                                handleSubmit();
                            },
                        ],
                    ])}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">{payload?.cancelText || 'Cancel'}</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} type="submit">
                        {payload?.confirmText || 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
