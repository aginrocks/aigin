import { router } from '@/trpc';
import { providersRouter } from './providers';

export const modelsRouter = router({
    providers: providersRouter,
});
