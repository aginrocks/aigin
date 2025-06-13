/**
 * TypeScript types for OpenRouter Models API
 * Based on: https://openrouter.ai/docs/overview/models
 */

import { FLAGSHIP_MODELS } from '@constants/flagship-models';
import { Model, ModelCapability, TModel } from '@models/model';

// Supported input/output modalities
export type InputModality = 'file' | 'image' | 'text';
export type OutputModality = 'text';

// Supported API parameters
export type SupportedParameter =
    | 'tools'
    | 'tool_choice'
    | 'max_tokens'
    | 'temperature'
    | 'top_p'
    | 'reasoning'
    | 'include_reasoning'
    | 'structured_outputs'
    | 'response_format'
    | 'stop'
    | 'frequency_penalty'
    | 'presence_penalty'
    | 'seed';

/**
 * Architecture object describing the model's technical capabilities
 */
export interface Architecture {
    /** Supported input types */
    input_modalities: InputModality[];
    /** Supported output types */
    output_modalities: OutputModality[];
    /** Tokenization method used */
    tokenizer: string;
    /** Instruction format type (null if not applicable) */
    instruct_type: string | null;
}

/**
 * Pricing structure for using the model
 * All values are in USD per token/request/unit
 * A value of "0" indicates the feature is free
 */
export interface Pricing {
    /** Cost per input token */
    prompt: string;
    /** Cost per output token */
    completion: string;
    /** Fixed cost per API request */
    request: string;
    /** Cost per image input */
    image: string;
    /** Cost per web search operation */
    web_search: string;
    /** Cost for internal reasoning tokens */
    internal_reasoning: string;
    /** Cost per cached input token read */
    input_cache_read: string;
    /** Cost per cached input token write */
    input_cache_write: string;
}

/**
 * Configuration details for the primary provider
 */
export interface TopProvider {
    /** Provider-specific context limit */
    context_length: number;
    /** Maximum tokens in response */
    max_completion_tokens: number;
    /** Whether content moderation is applied */
    is_moderated: boolean;
}

/**
 * Individual model object with standardized fields
 */
export interface Model {
    /** Unique model identifier used in API requests (e.g., "google/gemini-2.5-pro-preview") */
    id: string;
    /** Permanent slug for the model that never changes */
    canonical_slug: string;
    /** Human-readable display name for the model */
    name: string;
    /** Unix timestamp of when the model was added to OpenRouter */
    created: number;
    /** Detailed description of the model's capabilities and characteristics */
    description: string;
    /** Maximum context window size in tokens */
    context_length: number;
    /** Object describing the model's technical capabilities */
    architecture: Architecture;
    /** Lowest price structure for using this model */
    pricing: Pricing;
    /** Configuration details for the primary provider */
    top_provider: TopProvider;
    /** Rate limiting information (null if no limits) */
    per_request_limits: unknown | null;
    /** Array of supported API parameters for this model */
    supported_parameters: SupportedParameter[];
}

/**
 * Root response object from the Models API
 */
export interface ModelsApiResponse {
    /** Array of Model objects */
    data: Model[];
}

/**
 * Fetches available models from OpenRouter API
 */
export async function fetchModels(): Promise<ModelsApiResponse> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const response = await fetch('https://openrouter.ai/api/v1/models', {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<ModelsApiResponse>;
}

export async function fetchAndParseModels(): Promise<Omit<TModel, '_id'>[]> {
    try {
        const response = await fetchModels();

        const models = response.data.map((model): Omit<TModel, '_id'> => {
            const capabilities: ModelCapability[] = model.architecture.input_modalities
                .map((modality) => {
                    if (modality === 'file') return 'file';
                    if (modality === 'image') return 'vision';
                })
                .filter((x) => !!x);

            if (model.supported_parameters.includes('reasoning')) capabilities.push('reasoning');
            if (model.supported_parameters.includes('tools')) capabilities.push('tools');

            return {
                category: 'other',
                slug: model.canonical_slug,
                name: model.name.includes(':') ? model.name.split(':')[1].trim() : model.name,
                description: model.description.split('.')[0].trim() + '.',
                capabilities,
                providers: [
                    {
                        provider: 'openrouter',
                        modelId: model.canonical_slug,
                    },
                ],
                family: 'other',
            };
        });

        return models;
    } catch (error) {
        console.error('Error fetching models:', error);
        throw error;
    }
}

export async function updateAllModels() {
    const openRouterModels = await fetchAndParseModels();

    const notFlagshipModels = openRouterModels.filter(
        (m) =>
            FLAGSHIP_MODELS.find(
                (f) =>
                    f.providers.find((p) => p.provider === 'openrouter')?.modelId ===
                    m.providers[0].modelId
            ) === undefined
    );

    const allModels = [...FLAGSHIP_MODELS, ...notFlagshipModels];

    const operations = allModels.map((model) => ({
        updateOne: {
            filter: { slug: model.slug },
            update: {
                $set: model,
            },
            upsert: true,
        },
    }));

    await Model.bulkWrite(operations, { ordered: false });

    console.log(`Updated ${allModels.length} models in the database.`);
}
