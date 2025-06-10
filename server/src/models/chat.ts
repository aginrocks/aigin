import mongoose from 'mongoose';
import { z } from 'zod';
import zodSchema, { zId } from '@zodyac/zod-mongoose';

export const chatSchema = z.object({
    user: zId('User'),
    name: z.string().min(1, 'Name is required'),
    pinned: z.boolean().default(false),
    // TODO: add messages list
});

export type TChat = z.infer<typeof chatSchema>;

const schema = zodSchema(chatSchema);
export const Chat = mongoose.model('Chat', schema);
