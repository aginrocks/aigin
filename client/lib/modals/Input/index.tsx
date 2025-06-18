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

export function Input({
    payload,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & ModalProps<'Input'>) {
    const modals = useModals();
    return (
        <AlertDialog {...props}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{payload?.title}</AlertDialogTitle>
                    {payload?.description && (
                        <AlertDialogDescription>{payload.description}</AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => modals.hide('Confirm', false)}>
                        {payload?.cancelText || 'Cancel'}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => modals.hide('Confirm', true)}>
                        {payload?.confirmText || 'Confirm'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
