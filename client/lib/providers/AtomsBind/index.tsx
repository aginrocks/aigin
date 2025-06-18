import { useBindAtoms } from '@lib/atoms/bind';
import { ReactNode } from 'react';

export type AtomsBindProviderProps = {
    children?: ReactNode;
};

export function AtomsBindProvider({ children }: AtomsBindProviderProps) {
    useBindAtoms();

    return <>{children}</>;
}
