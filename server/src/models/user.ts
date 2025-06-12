import mongoose, { Types } from 'mongoose';
import { z } from 'zod';
import zodSchema from '@zodyac/zod-mongoose';
import { PROVIDER_IDS } from '@constants/providers';

const modelProvider = z.object({
    enabled: z.boolean().default(false),
    apiKey: z.string().nullable().default(null),
});

export const settingsSchema = z.object({
    /**
     * The name that will be used to call the user in chat.
     */
    callName: z.string().optional(),

    /**
     * The user's profession or role, used to provide context in conversations.
     */
    profession: z.string().optional(),

    /**
     * Displays token information in the chat UI.
     */
    statsForNerds: z.boolean().default(false),
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
    settings: settingsSchema.default({}),
});

export type TUser = z.infer<typeof userSchema> & {
    _id: Types.ObjectId;
};

const schema = zodSchema(userSchema);
export const User = mongoose.model('User', schema);
