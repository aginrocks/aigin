import { protectedProcedure } from '@/trpc';
import { PROVIDER_IDS } from '@constants/providers';
import { User } from '@models/user';
import { z } from 'zod';

export const setEnabled = protectedProcedure
    .input(
        z.object({
            provider: z.enum(PROVIDER_IDS),
            enabled: z.boolean().optional(),
            apiKey: z.string().optional(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const updateQuery: Record<string, any> = {
            [`providers.${input.provider}.enabled`]: input.enabled,
        };

        if (input.apiKey) {
            updateQuery[`providers.${input.provider}.apiKey`] = input.apiKey;
        }

        await User.findByIdAndUpdate(ctx.user._id, updateQuery);

        return {
            success: true,
        };
    });
