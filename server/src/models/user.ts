import mongoose from 'mongoose';
import { z } from 'zod';
import zodSchema from '@zodyac/zod-mongoose';

const modelProvider = z.object({
    enabled: z.boolean().default(false),
    apiKey: z.string().nullable().default(null),
});

export const POSSIBLE_PROVIDERS = [
    'google',
    'openai',
    'openrouter',
    'groq',
    'github',
    'anthropic',
] as const;

export const userSchema = z.object({
    subject: z.string().min(1),
    name: z.string().min(1, 'Name is required'),
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Invalid email address'),
    providers: z.object({
        google: modelProvider,
        openai: modelProvider,
        openrouter: modelProvider,
        groq: modelProvider,
        github: modelProvider,
        anthropic: modelProvider,
    }),
});

export type TUser = z.infer<typeof userSchema>;

const schema = zodSchema(userSchema, { versionKey: false });
export const User = mongoose.model('User', schema);
