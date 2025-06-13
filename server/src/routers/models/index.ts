import { router } from '@/trpc';
import { providersRouter } from './providers';
import { get } from './get';

export const modelsRouter = router({
    providers: providersRouter,
    get,
});
