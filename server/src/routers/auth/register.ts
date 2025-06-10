import { publicProcedure } from '@/trpc';
import { TUser, User, userSchema } from '@models/user';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';

export const register = publicProcedure.input(userSchema).mutation(async ({ input }) => {
    const user = await User.findOne({ email: input.email });

    if (user) {
        throw new TRPCError({
            code: 'CONFLICT',
            message: 'User with this email already exists',
        });
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const newUser: TUser = {
        ...input,
        password: hashedPassword,
    };

    await User.create(newUser);

    return {
        success: true,
    };
});
