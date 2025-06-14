import { protectedProcedure } from '@/trpc';
import { APPS } from '@constants/apps';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const withValidAppSlug = protectedProcedure
    .input(
        z.object({
            appSlug: z.string(),
        })
    )
    .use(async ({ ctx, input, next }) => {
        const app = APPS.find((app) => app.slug === input.appSlug);
        if (!app) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'App not found',
            });
        }

        return next({
            ctx: {
                ...ctx,
                app,
            },
        });
    });
