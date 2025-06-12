import { z } from 'zod';
import { withValidChatId } from './middlewares';
import { Chat } from '@models/chat';
import { getUserEmitter } from '@ai/generation-manager';

export const modify = withValidChatId
    .input(
        z.object({
            chatId: z.string(),
            name: z.string().optional(),
            pinned: z.boolean().optional(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const updateData: Record<string, any> = {};
        if (input.name !== undefined) {
            updateData.name = input.name;
        }
        if (input.pinned !== undefined) {
            updateData.pinned = input.pinned;
        }

        const oldChat = await Chat.findByIdAndUpdate(input.chatId, updateData, {
            returnDocument: 'before',
        });

        const userEmitter = getUserEmitter(ctx.user._id.toString());

        userEmitter.emit('chat:changed', input.chatId);
        if (input.name !== undefined) {
            userEmitter.emit('chat:renamed', input.chatId, oldChat!.name, input.name);
        }
        if (input.pinned !== undefined) {
            userEmitter.emit('chat:pinned', input.chatId, input.pinned);
        }

        return { success: true };
    });
