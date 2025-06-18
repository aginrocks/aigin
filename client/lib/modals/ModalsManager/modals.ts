import { Confirm } from '../Confirm';
import { Input } from '../Input';
import { Settings, SettingsTabName } from '../Settings';
import { ModalComponentBindings, ModalDefinition } from './types';

export type Modals = {
    Settings: ModalDefinition<{
        payload: {
            initialTab?: SettingsTabName;
        };
        returnValue: undefined;
    }>;
    Confirm: ModalDefinition<{
        payload: {
            title: string;
            description?: string;
            confirmText?: string;
            cancelText?: string;
        };
        returnValue: boolean;
    }>;
    Input: ModalDefinition<{
        payload: {
            title: string;
            description?: string;
            confirmText?: string;
            cancelText?: string;
        };
        returnValue: string;
    }>;
};

export const ModalsBinding: ModalComponentBindings = {
    Settings: Settings,
    Confirm: Confirm,
    Input: Input,
};
