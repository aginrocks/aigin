/**
 * TypeScript types for OpenRouter Models API
 * Based on: https://openrouter.ai/docs/overview/models
 */

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
export async function fetchModels(apiKey?: string): Promise<ModelsApiResponse> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch('https://openrouter.ai/api/v1/models', {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<ModelsApiResponse>;
}

/**
 * Filters models by supported parameters
 */
export function filterModelsByParameters(
    models: Model[],
    requiredParameters: SupportedParameter[]
): Model[] {
    return models.filter((model) =>
        requiredParameters.every((param) => model.supported_parameters.includes(param))
    );
}

/**
 * Filters models by input modalities
 */
export function filterModelsByInputModality(
    models: Model[],
    requiredModalities: InputModality[]
): Model[] {
    return models.filter((model) =>
        requiredModalities.every((modality) =>
            model.architecture.input_modalities.includes(modality)
        )
    );
}

/**
 * Sorts models by cost (prompt + completion tokens)
 */
export function sortModelsByCost(models: Model[], ascending = true): Model[] {
    return [...models].sort((a, b) => {
        const aCost = parseFloat(a.pricing.prompt) + parseFloat(a.pricing.completion);
        const bCost = parseFloat(b.pricing.prompt) + parseFloat(b.pricing.completion);
        return ascending ? aCost - bCost : bCost - aCost;
    });
}

/**
 * Finds models by context length range
 */
export function filterModelsByContextLength(
    models: Model[],
    minContextLength: number,
    maxContextLength?: number
): Model[] {
    return models.filter((model) => {
        const contextLength = model.context_length;
        return (
            contextLength >= minContextLength &&
            (maxContextLength === undefined || contextLength <= maxContextLength)
        );
    });
}
