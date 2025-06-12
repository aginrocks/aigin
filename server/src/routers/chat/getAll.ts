import { protectedProcedure } from '@/trpc';
import { chatsStore, getUserEmitter, isChatGenerating } from '@ai/generation-manager';
import { Chat } from '@models/chat';
import { Types } from 'mongoose';

async function fetchChats(userId: Types.ObjectId) {
    const chats = await Chat.find(
        { user: userId },
        {
            name: 1,
            pinned: 1,
        }
    );

    const mappedChats = chats.map((c) => ({
        ...c,
        isGenerating: isChatGenerating(c._id.toString()),
    }));

    return mappedChats;
}

export const getAll = protectedProcedure.subscription(async function* ({ ctx, signal }) {
    const chats = await fetchChats(ctx.user._id);

    yield chats;

    const emitter = getUserEmitter(ctx.user._id.toString());

    const iterable = emitter.toIterable('chat:changed', {
        signal,
    });

    for await (const [chatId] of iterable) {
        // TODO: Optimize the event system to avoid unnecessary queries to the database
        yield await fetchChats(ctx.user._id);
    }
});
