import { protectedProcedure } from '@/trpc';
import { loadContext } from '@ai/generation-manager';
import { Chat, deserializeMessages } from '@models/chat';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { withValidChatId } from './middlewares';

export const get = withValidChatId
    .input(
        z.object({
            chatId: z.string(),
        })
    )
    .subscription(async function* ({ ctx, input, signal }) {
        const chatObject = {
            ...ctx.chat.toObject(),
            messages: deserializeMessages(ctx.chat.messages),
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
