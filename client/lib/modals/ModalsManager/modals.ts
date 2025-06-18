import { StrippedApp } from '../../../../server/src/constants/apps';
import { AppSet } from '../AppSet';
import { Confirm } from '../Confirm';
import { InputDialog } from '../Input';
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
            initialValue?: string;
        };
        returnValue: string;
    }>;
    AppSet: ModalDefinition<{
        payload: {
            title: string;
            app: StrippedApp;
        };
        returnValue: undefined;
    }>;
};

export const ModalsBinding: ModalComponentBindings = {
    Settings: Settings,
    Confirm: Confirm,
    Input: InputDialog,
    AppSet: AppSet,
};
