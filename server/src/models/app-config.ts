import mongoose, { Types } from 'mongoose';
import { z } from 'zod';
import zodSchema, { zId } from '@zodyac/zod-mongoose';

export const configOptionSchema = z.object({
    id: z.string(),
    value: z.string(),
});

export const configSchema = z.object({
    user: zId('User'),
    appSlug: z.string(),
    config: z.array(configOptionSchema),
});

export type TAppConfig = z.infer<typeof configSchema> & {
    _id: Types.ObjectId;
};

const schema = zodSchema(configSchema);
export const AppConfig = mongoose.model('AppConfig', schema);
