import { router } from '@/trpc';
import { logout } from './logout';

export const authRouter = router({
    logout,
});
