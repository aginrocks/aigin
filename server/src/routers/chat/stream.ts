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
        const chat = chatsStore.get(input.chatId);
        if (!chat) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Chat not found',
            });
        }

        console.log(`Starting stream for chat ${input.chatId} with signal`, signal);
        console.log(chatsStore);
        const iterable = chat.emitter.toIterable('message:delta', {
            signal,
        });

        for await (const [part] of iterable) {
            console.log(`Streaming part for chat ${input.chatId}:`, part);

            yield part;
        }
    });
