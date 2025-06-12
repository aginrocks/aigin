import { router } from '@/trpc';
import { generate } from './generate';
import { stream } from './stream';
import { get } from './get';
import { getAll } from './getAll';
import { modify } from './modify';

export const chatRouter = router({
    generate,
    stream,
    get,
    getAll,
    modify,
});
