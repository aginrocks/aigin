import { protectedProcedure } from '@/trpc';
import { CachedChatEventsMap, chatsStore, loadContext } from '@ai/generation-manager';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { generate } from './generate';
import { constructUnconfirmedToolCall, ExtendedToolCall } from '@ai/mcp/mcp-app';

export const stream = protectedProcedure
    .input(
        z.object({
            chatId: z.string(),
        })
    )
    .subscription(async function* ({
        ctx,
        input,
        signal,
    }): AsyncGenerator<CachedChatEventsMap['message:changed'][0]> {
        console.log(
            `Stream subscription requested for chat ${input.chatId} by user ${ctx.user._id}`
        );
        console.log('Current chats in store:', Array.from(chatsStore.keys()));

        const chat = await loadContext(ctx.user, input.chatId);
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

        try {
            const allToolCalls = chat.simpleCalls.map((c) => constructUnconfirmedToolCall(c));
            console.log({ allToolCalls });

            if (allToolCalls) {
                for (const call of allToolCalls) {
                    if (call)
                        yield {
                            type: 'tool:call-metadata',
                            data: [call],
                        };
                }
            }
        } catch (e) {
            console.log(e);
        }

        if (chat.isGenerating) {
            const lastMessage = chat.getMessages().slice(-1)[0];

            // Sending already created message parts on connection
            if (lastMessage.role === 'assistant') {
                yield {
                    type: 'message:created',
                    data: [lastMessage],
                };
            }
        }

        const iterable = chat.emitter.toIterable('message:changed', {
            signal,
        });

        try {
            for await (const [part] of iterable) {
                // console.log(`Streaming part for chat ${input.chatId}:`, part);
                yield part;
            }
        } catch (error) {
            console.error(`Stream error for chat ${input.chatId}:`, error);
            throw error;
        }

        console.log(`Stream ended for chat ${input.chatId}`);
    });
