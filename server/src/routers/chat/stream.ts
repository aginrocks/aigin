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

        console.log(`Starting stream for chat ${input.chatId}, isGenerating: ${chat.isGenerating}`);

        const iterable = chat.emitter.toIterable('message:delta', {
            signal,
        });

        try {
            for await (const [part] of iterable) {
                console.log(`Streaming part for chat ${input.chatId}:`, part);
                yield part;
            }
        } catch (error) {
            console.error(`Stream error for chat ${input.chatId}:`, error);
            throw error;
        }

        console.log(`Stream ended for chat ${input.chatId}`);
    });
