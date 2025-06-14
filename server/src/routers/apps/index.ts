import { router } from '@/trpc';
import { getAll } from './getAll';
import { configure } from './configure';

export const appsRouter = router({
    getAll,
    configure,
});
