import { publicProcedure } from '@/trpc';

export const logout = publicProcedure.mutation(async ({ ctx }) => {
    await ctx.revokeSession();
    return {
        success: true,
        message: 'You have been successfully logged out!',
    };
});
