import { protectedProcedure } from '@/trpc';
import { POSSIBLE_PROVIDERS, TUser, User } from '@models/user';
import { z } from 'zod';

export const setEnabled = protectedProcedure
    .input(
        z.object({
            provider: z.enum(POSSIBLE_PROVIDERS),
            enabled: z.boolean(),
            apiKey: z.string().optional(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const updateQuery: Partial<TUser['providers']['anthropic']> = {
            enabled: input.enabled,
        };

        if (input.apiKey) {
            updateQuery.apiKey = input.apiKey;
        }

        await User.findByIdAndUpdate(ctx.user._id, {
            providers: {
                [input.provider]: updateQuery,
            },
        });

        return {
            success: true,
        };
    });
