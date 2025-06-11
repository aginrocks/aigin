import { router } from '@/trpc';
import { generate } from './generate';

export const chatRouter = router({
    generate,
});
