import { protectedProcedure } from '@/trpc';
import { chatsStore } from '@ai/generation-manager';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const stream = protectedProcedure
    .input(
        z.object({
            chatId: z.string(),
        })
    )
    .subscription(async function* ({ ctx, input, signal }) {
        console.log(
            `Stream subscription requested for chat ${input.chatId} by user ${ctx.user._id}`
        );
        console.log('Current chats in store:', Array.from(chatsStore.keys()));

        const chat = chatsStore.get(input.chatId);
        if (!chat) {
            console.log(`Chat ${input.chatId} not found in store`);
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Chat not found',
            });
        }

        if (chat.user._id.toString() !== ctx.user._id.toString()) {
            console.log(`User ${ctx.user._id} is not authorized to access chat ${input.chatId}`);
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'You do not have permission to access this chat',
            });
        }

        console.log(`Starting stream for chat ${input.chatId}, isGenerating: ${chat.isGenerating}`);

        const events = ['message:delta', 'message:completed', 'message:created'] as const;
        const iterables = events.map((event) => chat.emitter.toIterable(event, { signal }));

        try {
            for await (const [eventData, eventIndex] of race(iterables)) {
                const eventType = events[eventIndex];
                console.log(`Streaming ${eventType} for chat ${input.chatId}:`, eventData);
                yield { type: eventType, data: eventData };
            }
        } catch (error) {
            console.error(`Stream error for chat ${input.chatId}:`, error);
            throw error;
        }

        console.log(`Stream ended for chat ${input.chatId}`);
    });

async function* race<T>(iterables: AsyncIterable<T>[]): AsyncGenerator<[T, number]> {
    const promises = iterables.map(async (iterable, index) => {
        const iterator = iterable[Symbol.asyncIterator]();
        const result = await iterator.next();
        return { value: result.value, done: result.done, index };
    });

    while (promises.length > 0) {
        const { value, done, index } = await Promise.race(promises);

        if (done) {
            promises.splice(
                promises.findIndex((p) => p === promises[index]),
                1
            );
            continue;
        }

        yield [value, index];

        // Replace the resolved promise with a new one for the same iterator
        const iterable = iterables[index];
        const iterator = iterable[Symbol.asyncIterator]();
        promises[index] = (async () => {
            const result = await iterator.next();
            return { value: result.value, done: result.done, index };
        })();
    }
}
