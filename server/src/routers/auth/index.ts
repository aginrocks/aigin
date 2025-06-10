import { router } from '@/trpc';
import { register } from './register';
import { logout } from './logout';

export const authRouter = router({
    register,
    logout,
});
