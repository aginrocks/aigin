import { protectedProcedure } from '@/trpc';

export const info = protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
});
