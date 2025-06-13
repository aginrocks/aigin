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

export const MODEL_FAMILIES = [
    'openai',
    'claude',
    'gemini',
    'llama',
    'deepseek',
    'grok',
    'qwen',
    'other',
] as const;

export const modelProviderMapping = z.object({
    modelId: z.string(),
    provider: z.enum(PROVIDER_IDS),
    comment: z.string().optional(),
});

export const modelSchema = z.object({
    /**
     * A model is considered flagship if it's hard-coded in @constants/flagship-models.ts
     * The 'other' category exists to allow users to interact with any OpenRouter model
     */
    category: z.enum(['flagship', 'other']),
    slug: z.string().unique(),
    name: z.string(),
    description: z.string(),
    capabilities: z.array(z.enum(MODEL_CAPABILITIES)),
    providers: z.array(modelProviderMapping),
    family: z.enum(MODEL_FAMILIES),
});

export type TModel = z.infer<typeof modelSchema> & {
    _id: Types.ObjectId;
};

const schema = zodSchema(modelSchema);
export const Model = mongoose.model('Model', schema);
