import { protectedProcedure } from '@/trpc';
import { loadContext } from '@ai/generation-manager';
import { parseAppMentions, validateAppsRequest } from '@lib/util';
import { TRPCError } from '@trpc/server';
import z from 'zod';

export const generate = protectedProcedure
    .input(
        z.object({
            prompt: z.string().min(1, 'Prompt is required'),
            model: z.string().refine((val) => /^.+:.+$/.test(val), {
                message: 'Model must be in the format "provider:model"',
            }),
            /**
             * Optional chat ID to load an existing chat context.
             * If not provided, a new chat will be created.
             */
            chatId: z.string().optional(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const chat = await loadContext(ctx.user, input.chatId);

        await chat.sendMessage({
            model: input.model as `${string}:${string}`,
            content: input.prompt,
        });

        return { chatId: chat.id, status: 'Message sent successfully' };
    });
