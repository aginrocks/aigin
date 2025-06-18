'use client';
import { GetModelsOutput, useTRPC } from '@lib/trpc';
import { useQuery } from '@tanstack/react-query';
import { atom, useSetAtom } from 'jotai';
import { useEffect } from 'react';

export const modelsAtom = atom<GetModelsOutput>();

export function useBindModels() {
    const trpc = useTRPC();

    const setModels = useSetAtom(modelsAtom);

    const { data: models } = useQuery(trpc.models.get.queryOptions({}));
    useEffect(() => {
        if (models) {
            setModels(models);
        }
    }, [models]);
}
