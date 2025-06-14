import { z } from 'zod';
import { withValidAppSlug } from './middlewares';
import { configOptionSchema } from '@constants/apps';
import { AppConfig } from '@models/app-config';

export const configure = withValidAppSlug
    .input(
        z.object({
            appSlug: z.string(),
            config: z.array(configOptionSchema).optional(),
            enabled: z.boolean(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        await AppConfig.findOneAndUpdate(
            {
                user: ctx.user._id,
                appSlug: input.appSlug,
            },
            {
                user: ctx.user._id,
                appSlug: input.appSlug,
                config: input.config,
                enabled: input.enabled,
            },
            {
                upsert: true,
            }
        );

        return {
            success: true,
            message: 'App configuration updated successfully',
        };
    });
