import { protectedProcedure } from '@/trpc';
import { getUserRegistry } from '@ai/registry';
import { streamText } from 'ai';
import z from 'zod';
export const generate = protectedProcedure
    .input(
        z.object({
            prompt: z.string().min(1, 'Prompt is required'),
            model: z.string().refine((val) => /^.+:.+$/.test(val), {
                message: 'Model must be in the format "provider:model"',
            }),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const registry = getUserRegistry(ctx.user);

        const response = streamText({
            model: registry.languageModel(input.model as `${string}:${string}`),
            prompt: input.prompt,
        });

        for await (const part of response.fullStream) {
            console.log(part);
        }

        return { response };
    });
