import { protectedProcedure } from '@/trpc';
import { settingsSchema, User } from '@models/user';

export const setUserSettings = protectedProcedure
    .input(settingsSchema)
    .mutation(async ({ ctx, input }) => {
        const newUser = await User.findByIdAndUpdate(
            ctx.user._id,
            {
                settings: input,
            },
            {
                returnDocument: 'after',
            }
        );

        return newUser?.settings;
    });
