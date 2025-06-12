import { router } from '@/trpc';
import { getUserSettings } from './getUserSettings';
import { setUserSettings } from './setUserSettings';

export const settingsRouter = router({
    getUserSettings,
    setUserSettings,
});
