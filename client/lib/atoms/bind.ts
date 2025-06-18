'use client';
import { useBindModels } from './models';
import { useBindSelectedModels } from './selectedmodel';

export function useBindAtoms() {
    useBindModels();
    useBindSelectedModels();
}
