import mongoose from 'mongoose';
import { z } from 'zod';
import zodSchema from '@zodyac/zod-mongoose';

export const userSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().nonempty('Password is required'),
});

export type TUser = z.infer<typeof userSchema>;

const schema = zodSchema(userSchema);
const User = mongoose.model('User', schema);
export default User;
