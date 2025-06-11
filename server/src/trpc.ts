import { initTRPC, TRPCError } from '@trpc/server';
import type { TRPCContext } from './context';
import { User } from '@models/user';

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

    const user = (
        await User.findOneAndUpdate(
            {
                email: auth.email,
                name: auth.given_name,
                username: auth.preferred_username,
                subject: auth.sub,
            },
            {
                subject: auth.sub,
            },
            {
                upsert: true,
                returnDocument: 'after',
            }
        )
    ).toObject();

    return next({
        ctx: {
            ...ctx,
            auth,
            user,
        },
    });
});
