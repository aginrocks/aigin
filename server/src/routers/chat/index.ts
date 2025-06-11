import { router } from '@/trpc';
import { generate } from './generate';
import { stream } from './stream';

export const chatRouter = router({
    generate,
    stream,
});
