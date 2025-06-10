import { router } from '@/trpc';
import { logout } from './logout';
import { info } from './info';

export const authRouter = router({
    logout,
    info,
});
