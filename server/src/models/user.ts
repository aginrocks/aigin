import mongoose from 'mongoose';
import { z } from 'zod';
import zodSchema from '@zodyac/zod-mongoose';

export const userSchema = z.object({
    subject: z.string().min(1),
    name: z.string().min(1, 'Name is required'),
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Invalid email address'),
});

export type TUser = z.infer<typeof userSchema>;

const schema = zodSchema(userSchema);
export const User = mongoose.model('User', schema);
