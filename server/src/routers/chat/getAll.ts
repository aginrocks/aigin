import { protectedProcedure } from '@/trpc';
import { Chat } from '@models/chat';

export const getAll = protectedProcedure.subscription(async function* ({ ctx, signal }) {
    const chats = await Chat.find(
        { user: ctx.user._id },
        {
            name: 1,
            pinned: 1,
        }
    );

    yield chats;

    // TODO: Implement updates
});
