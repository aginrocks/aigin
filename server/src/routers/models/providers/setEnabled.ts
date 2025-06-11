import { protectedProcedure } from '@/trpc';
import { PROVIDER_IDS } from '@constants/providers';
import { TUser, User } from '@models/user';
import { z } from 'zod';

export const setEnabled = protectedProcedure
    .input(
        z.object({
            provider: z.enum(PROVIDER_IDS),
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
