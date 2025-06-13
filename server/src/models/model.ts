import mongoose, { Types } from 'mongoose';
import { z } from 'zod';
import zodSchema from '@zodyac/zod-mongoose';
import { PROVIDER_IDS } from '@constants/providers';

export const MODEL_CAPABILITIES = [
    'fast',
    'vision',
    'search',
    'file',
    'reasoning',
    'effort-control',
    'image-generation',
    'tools',
] as const;
export type ModelCapability = (typeof MODEL_CAPABILITIES)[number];

export const modelProviderMapping = z.object({
    modelId: z.string(),
    provider: z.enum(PROVIDER_IDS),
});

export const modelSchema = z.object({
    slug: z.string().unique(),
    name: z.string(),
    description: z.string(),
    capabilities: z.array(z.enum(MODEL_CAPABILITIES)),
    providers: z.array(modelProviderMapping),
});

export type TModel = z.infer<typeof modelSchema> & {
    _id: Types.ObjectId;
};

const schema = zodSchema(modelSchema);
export const Model = mongoose.model('Model', schema);
