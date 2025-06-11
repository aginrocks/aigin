import { Settings, SettingsTabName } from '../Settings';
import { ModalComponentBindings, ModalDefinition } from './types';

export type Modals = {
    Settings: ModalDefinition<{
        payload: {
            initialTab?: SettingsTabName;
        };
        returnValue: undefined;
    }>;
};

export const ModalsBinding: ModalComponentBindings = {
    Settings: Settings,
};
