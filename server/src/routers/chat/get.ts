import { protectedProcedure } from '@/trpc';
import { loadContext } from '@ai/generation-manager';
import { Chat, deserializeMessages } from '@models/chat';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const get = protectedProcedure
    .input(
        z.object({
            chatId: z.string(),
        })
    )
    .subscription(async function* ({ ctx, input, signal }) {
        const chat = await Chat.findById(input.chatId);
        if (!chat) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Chat not found',
            });
        }

        if (chat.user.toString() !== ctx.user._id.toString()) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You do not have permission to access this chat',
            });
        }

        const chatObject = {
            ...chat.toObject(),
            messages: deserializeMessages(chat.messages),
        };

        const cachedChat = await loadContext(ctx.user, input.chatId);

        yield chatObject;

        const iterable = cachedChat.emitter.toIterable('message:created', {
            signal,
        });

        for await (const [message] of iterable) {
            yield {
                ...chatObject,
                messages: [...chatObject.messages, message],
            };
        }
    });
