import { router } from '@/trpc';
import { register } from './register';

export const authRouter = router({
    register,
});
