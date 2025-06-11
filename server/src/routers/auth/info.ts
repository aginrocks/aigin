import { protectedProcedure } from '@/trpc';

export const info = protectedProcedure.query(async ({ ctx }) => {
    const { providers, ...userResponse } = ctx.user;

    return userResponse;
});
