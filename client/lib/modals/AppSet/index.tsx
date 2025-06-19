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
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Inputs, useTRPC } from '@lib/trpc';
import { Switch } from '@/components/ui/switch';

export function AppSet({
    payload,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & ModalProps<'AppSet'>) {
    const modals = useModals();
    const trpc = useTRPC();

    const { data: apps } = useQuery(trpc.apps.getAll.queryOptions());

    const [formState, setFormState] = useState<Inputs['apps']['configure']['config']>();

    const [enabled, setEnabled] = useState<boolean>(true);

    const applicationMutate = useMutation(trpc.apps.configure.mutationOptions());

    const selectedApp = useMemo(
        () => apps?.find((app) => app.slug === payload?.app?.slug),
        [payload?.app?.slug, apps]
    );

    useEffect(() => {
        setEnabled(selectedApp?.isEnabled || false);
        console.log(selectedApp?.isEnabled);
    }, [apps]);

    function handleSubmit() {
        // console.log('handleSubmit', formState);

        if (!payload?.app) return;

        applicationMutate.mutate({
            appSlug: payload?.app.slug,
            enabled: enabled,
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
                <div className="flex text-bold items-center px-1 justify-between">
                    <span>Enable</span>
                    <Switch checked={enabled} onCheckedChange={setEnabled} />
                </div>
                {payload?.app.configuration?.map((config, i) => {
                    const value = formState?.find((f) => f.id == config.id);
                    return (
                        <div className="flex flex-col gap-2" key={config.name}>
                            <div className="flex flex-col items-start gap-2">
                                {/* <span className="text-sm px-1 font-semibold">
                                        {config.name}
                                    </span> */}
                                <span className="text-sm px-1">{config.description}</span>
                            </div>
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
