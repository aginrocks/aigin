import mongoose from 'mongoose';
import { z } from 'zod';
import zodSchema from '@zodyac/zod-mongoose';
import { PROVIDER_IDS } from '@constants/providers';

const modelProvider = z.object({
    enabled: z.boolean().default(false),
    apiKey: z.string().nullable().default(null),
});

export const userSchema = z.object({
    subject: z.string().min(1),
    name: z.string().min(1, 'Name is required'),
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Invalid email address'),
    providers: z.object(
        PROVIDER_IDS.reduce((acc, id) => {
            acc[id] = modelProvider;
            return acc;
        }, {} as Record<(typeof PROVIDER_IDS)[number], typeof modelProvider>)
    ),
});

export type TUser = z.infer<typeof userSchema>;

const schema = zodSchema(userSchema, { versionKey: false });
export const User = mongoose.model('User', schema);
