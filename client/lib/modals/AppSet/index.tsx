import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ModalProps, useModals } from '../ModalsManager';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StrippedApp } from '../../../../server/src/constants/apps';
import { useMutation } from '@tanstack/react-query';
import { Inputs, useTRPC } from '@lib/trpc';

export function AppSet({
    payload,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & ModalProps<'AppSet'>) {
    const modals = useModals();
    const trpc = useTRPC();

    const inputRef = useRef<HTMLInputElement>(null);

    const [formState, setFormState] = useState<Inputs['apps']['configure']['config']>();

    const applicationMutate = useMutation(trpc.apps.configure.mutationOptions());

    function handleSubmit() {
        console.log('handleSubmit', formState);

        if (!payload?.app) return;

        applicationMutate.mutate({
            appSlug: payload?.app.slug,
            enabled: true,
            config: formState,
        });

        modals.hide('AppSet');
    }

    return (
        <Dialog {...props}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="px-1">
                        {payload?.title || 'Set Application'}
                    </DialogTitle>
                    {/* <DialogDescription>{'Set Application'}</DialogDescription> */}
                </DialogHeader>
                {payload?.app.configuration?.map((config, i) => {
                    const value = formState?.find((f) => f.id == config.id);
                    return (
                        <div className="flex flex-col gap-1" key={config.name}>
                            <span className="text-sm px-1 font-semibold">{config.name}</span>
                            <span className="text-sm px-1">{config.description}</span>
                            <Input
                                placeholder={config.name}
                                value={value?.value || ''}
                                onChange={(e) =>
                                    setFormState((prev) => {
                                        const existing = prev || [];
                                        const existingIndex = existing.findIndex(
                                            (item) => item.id === config.id
                                        );

                                        if (existingIndex >= 0) {
                                            return existing.map((item, index) =>
                                                index === existingIndex
                                                    ? { ...item, value: e.target.value }
                                                    : item
                                            );
                                        } else {
                                            return [
                                                ...existing,
                                                { id: config.id, value: e.target.value },
                                            ];
                                        }
                                    })
                                }
                            />
                        </div>
                    );
                })}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">{'Cancel'}</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} type="submit">
                        {'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
