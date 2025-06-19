'use client';
import { GetModelsOutput, useTRPC } from '@lib/trpc';
import { useQuery } from '@tanstack/react-query';
import { atom, useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';

export const selectedModelAtom = atom<GetModelsOutput[number]>();

export function useBindSelectedModels() {
    const trpc = useTRPC();
    const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);
    const { data: models } = useQuery(trpc.models.get.queryOptions({}));
    useEffect(() => {
        if (models && !selectedModel) {
            setSelectedModel(models[1]);
        }
    }, [models]);
}
