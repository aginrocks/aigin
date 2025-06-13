import { Share } from '@models/share';
import { withValidChatId } from './middlewares';

export const share = withValidChatId.mutation(async ({ ctx }) => {
    const share = await Share.create({
        user: ctx.user._id,
        uuid: crypto.randomUUID(),
        name: ctx.chat.name,
        messages: ctx.chat.messages,
    });

    return {
        uuid: share.uuid,
        name: share.name,
    };
});
