import { protectedProcedure } from '@/trpc';
import { Chat } from '@models/chat';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const withValidChatId = protectedProcedure
    .input(
        z.object({
            chatId: z.string(),
        })
    )
    .use(async ({ ctx, input, next }) => {
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

        return next({
            ctx: {
                ...ctx,
                chat,
            },
        });
    });
