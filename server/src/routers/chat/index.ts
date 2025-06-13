import { router } from '@/trpc';
import { generate } from './generate';
import { stream } from './stream';
import { get } from './get';
import { getAll } from './getAll';
import { modify } from './modify';
import { share } from './share';
import { getShared } from './getShared';

export const chatRouter = router({
    generate,
    stream,
    get,
    getAll,
    modify,
    share,
    getShared,
});
