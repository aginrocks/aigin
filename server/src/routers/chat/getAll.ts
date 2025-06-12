import { protectedProcedure } from '@/trpc';
import { getUserEmitter } from '@ai/generation-manager';
import { Chat } from '@models/chat';
import { Types } from 'mongoose';

async function fetchChats(userId: Types.ObjectId) {
    return Chat.find(
        { user: userId },
        {
            name: 1,
            pinned: 1,
        }
    );
}

export const getAll = protectedProcedure.subscription(async function* ({ ctx, signal }) {
    const chats = await fetchChats(ctx.user._id);

    yield chats;

    const emitter = getUserEmitter(ctx.user._id.toString());

    const iterable = emitter.toIterable('chat:changed', {
        signal,
    });

    for await (const [chatId] of iterable) {
        yield await fetchChats(ctx.user._id);
    }
});
