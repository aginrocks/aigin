import { initTRPC, TRPCError } from '@trpc/server';
import type { TRPCContext } from './context';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<TRPCContext>().create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
    const auth = await ctx.getAuth();
    if (!auth) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to access this resource.',
        });
    }
    return next({
        ctx: {
            ...ctx,
            auth,
        },
    });
});
