'use client';
import { GetModelsOutput, useTRPC } from '@lib/trpc';
import { useQuery } from '@tanstack/react-query';
import { atom, useSetAtom } from 'jotai';
import { useEffect } from 'react';

export const selectedModelAtom = atom<GetModelsOutput[number]>();

export function useBindSelectedModels() {
    // const trpc = useTRPC();
    // const setSelectedModelAtom = useSetAtom(selectedModelAtom);
    // const { data: models } = useQuery(trpc.models.get.queryOptions({}));
    // useEffect(() => {
    //     if (models) {
    //         setSelectedModelAtom(models[1]);
    //     }
    // }, [models]);
}
