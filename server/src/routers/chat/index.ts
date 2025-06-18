import { router } from '@/trpc';
import { generate } from './generate';
import { stream } from './stream';
import { get } from './get';
import { getAll } from './getAll';
import { modify } from './modify';
import { share } from './share';
import { getShared } from './getShared';
import { deleteChat } from './delete';
import { confirmMCPCall } from './confirmMCPCall';

export const chatRouter = router({
    generate,
    stream,
    get,
    getAll,
    modify,
    share,
    getShared,
    delete: deleteChat,
    confirmMCPCall,
});
