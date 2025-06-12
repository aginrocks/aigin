import { protectedProcedure } from '@/trpc';

export const getUserSettings = protectedProcedure.query(({ ctx }) => {
    const settings = ctx.user.settings;
    return settings;
});
