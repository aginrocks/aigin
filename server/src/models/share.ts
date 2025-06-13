import mongoose, { Types } from 'mongoose';
import { z } from 'zod';
import zodSchema, { zId, zUUID } from '@zodyac/zod-mongoose';
import { messageSchema } from './chat';

export const shareSchema = z.object({
    user: zId('User'),
    uuid: zUUID(),
    name: z.string().min(1, 'Name is required'),
    messages: z.array(messageSchema).default([]),
});

export type TChat = z.infer<typeof shareSchema> & {
    _id: Types.ObjectId;
};

const schema = zodSchema(shareSchema);
export const Share = mongoose.model('Share', schema);
