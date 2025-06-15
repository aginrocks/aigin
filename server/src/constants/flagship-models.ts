import { TModel } from '@models/model';

// TODO: Add 'azure' provider
// TODO: Check validity

/**
 * A model is considered flagship if it's hard-coded in this file.
 * The 'other' category exists to allow users to interact with any OpenRouter model
 */
export const FLAGSHIP_MODELS: Omit<TModel, '_id'>[] = [
    {
        category: 'flagship',
        slug: 'o3-pro',
        name: 'o3 Pro',
        family: 'openai',
        description:
            'The o3 series of models are trained with reinforcement learning to think before they answer and perform complex reasoning.',
        capabilities: ['vision', 'effort-control', 'reasoning', 'file'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'openai/o3-pro',
            },
            {
                provider: 'openai',
                modelId: 'o3-pro-2025-06-10',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'gemini-2-0-flash',
        name: 'Gemini 2.0 Flash',
        family: 'gemini',
        description:
            "Google's flagship model, known for speed and accuracy (and also web search!).",
        capabilities: ['vision', 'file', 'search'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'google/gemini-2.0-flash-001',
            },
            {
                provider: 'google',
                modelId: 'gemini-2.0-flash',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'gemini-2-0-flash-lite',
        name: 'Gemini 2.0 Flash Lite',
        family: 'gemini',
        description: 'Similar to 2.0 Flash, but even faster.',
        capabilities: ['fast', 'vision', 'file'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'google/gemini-2.0-flash-lite-001',
            },
            {
                provider: 'google',
                modelId: 'gemini-2.0-flash-lite',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'gemini-2-5-flash',
        name: 'Gemini 2.5 Flash',
        family: 'gemini',
        description:
            "Google's latest fast model, known for speed and accuracy (and also web search!).",
        capabilities: ['vision', 'file', 'search'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'google/gemini-2.5-flash-preview-05-20',
            },
            {
                provider: 'google',
                modelId: 'gemini-2.5-flash-preview-05-20',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'gemini-2-5-pro',
        name: 'Gemini 2.5 Pro',
        family: 'gemini',
        description:
            "Google's most advanced model, excelling at complex reasoning and problem-solving.",
        capabilities: ['vision', 'file', 'search', 'reasoning', 'effort-control'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'google/gemini-2.5-pro-preview',
            },
            {
                provider: 'google',
                modelId: 'gemini-2.5-pro-preview-06-05',
            },
        ],
    },
    // {
    //     category: 'flagship',
    //     slug: 'gpt-imagegen',
    //     name: 'GPT ImageGen',
    //     family: 'openai',
    //     description:
    //         "OpenAI's latest and greatest image generation model, using lots of crazy tech like custom tools for text and reflections.",
    //     capabilities: ['vision', 'image-generation'],
    //     providers: [
    //         {
    //             provider: 'openai',
    //             modelId: 'gpt-imagegen',
    //         },
    //     ],
    // },
    {
        category: 'flagship',
        slug: 'gpt-4o-mini',
        name: 'GPT-4o-mini',
        family: 'openai',
        description: 'Like gpt-4o, but faster.',
        capabilities: ['vision'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'openai/gpt-4o-mini',
            },
            {
                provider: 'openai',
                modelId: 'gpt-4o-mini-2024-07-18',
            },
            {
                provider: 'azure',
                modelId: 'openai/gpt-4o-mini',
            }
        ],
    },
    {
        category: 'flagship',
        slug: 'gpt-4o',
        name: 'GPT-4o',
        family: 'openai',
        description: "OpenAI's flagship non-reasoning model.",
        capabilities: ['vision'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'openai/gpt-4o',
            },
            {
                provider: 'openai',
                modelId: 'gpt-4o-2024-08-06',
            },
            {
                provider: 'azure',
                modelId: 'openai/gpt-4o',
            }
        ],
    },
    {
        category: 'flagship',
        slug: 'gpt-4-1',
        name: 'GPT-4.1',
        family: 'openai',
        description:
            'GPT-4.1 is a flagship large language model optimized for advanced instruction following, real-world software engineering, and long-context reasoning.',
        capabilities: ['vision'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'openai/gpt-4.1',
            },
            {
                provider: 'openai',
                modelId: 'gpt-4.1-2025-04-14',
            },
            {
                provider: 'azure',
                modelId: 'openai/gpt-4.1',
            }
        ],
    },
    {
        category: 'flagship',
        slug: 'gpt-4-1-mini',
        name: 'GPT-4.1 Mini',
        family: 'openai',
        description:
            'GPT-4.1 Mini is a mid-sized model delivering performance competitive with GPT-4o at substantially lower latency.',
        capabilities: ['vision'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'openai/gpt-4.1-mini',
            },
            {
                provider: 'openai',
                modelId: 'gpt-4.1-mini-2025-04-14',
            },
            {
                provider: 'azure',
                modelId: 'openai/gpt-4.1-mini',
            }
        ],
    },
    {
        category: 'flagship',
        slug: 'gpt-4-1-nano',
        name: 'GPT-4.1 Nano',
        family: 'openai',
        description:
            'For tasks that demand low latency, GPT‑4.1 nano is the fastest model in the GPT-4.1 series.',
        capabilities: ['vision'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'openai/gpt-4.1-nano',
            },
            {
                provider: 'openai',
                modelId: 'gpt-4.1-nano-2025-04-14',
            },
            {
                provider: 'azure',
                modelId: 'openai/gpt-4.1-nano',
            }
        ],
    },
    {
        category: 'flagship',
        slug: 'o3-mini',
        name: 'o3-mini',
        family: 'openai',
        description: 'A small, fast, super smart reasoning model.',
        capabilities: ['reasoning', 'effort-control'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'openai/o3-mini',
            },
            {
                provider: 'openai',
                modelId: 'o3-mini-2025-01-31',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'o4-mini',
        name: 'o4-mini',
        family: 'openai',
        description: 'A small, fast, even smarter reasoning model.',
        capabilities: ['vision', 'reasoning', 'effort-control'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'openai/o4-mini',
            },
            {
                provider: 'openai',
                modelId: 'o4-mini-2025-04-16',
            },
            {
                provider: 'azure',
                modelId: 'openai/o4-mini',
            }
        ],
    },
    {
        category: 'flagship',
        slug: 'o3',
        name: 'o3',
        family: 'openai',
        description: 'o3 is a well-rounded and powerful model across domains.',
        capabilities: ['vision', 'effort-control', 'reasoning'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'openai/o3',
            },
            {
                provider: 'openai',
                modelId: 'o3-2025-04-16',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet',
        family: 'claude',
        description: 'Smart model for complex problems.',
        capabilities: ['vision', 'file'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'anthropic/claude-3.5-sonnet',
            },
            {
                provider: 'anthropic',
                modelId: 'claude-3-5-sonnet-20241022',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'claude-3-7-sonnet',
        name: 'Claude 3.7 Sonnet',
        family: 'claude',
        description: 'The last gen model from Anthropic.',
        capabilities: ['vision', 'file', 'reasoning', 'effort-control'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'anthropic/claude-3.7-sonnet',
            },
            {
                provider: 'anthropic',
                modelId: 'claude-3-7-sonnet-20250219',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'claude-sonnet-4',
        name: 'Claude Sonnet 4',
        family: 'claude',
        description: 'The latest model from Anthropic.',
        capabilities: ['vision', 'file', 'reasoning', 'effort-control'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'anthropic/claude-sonnet-4',
            },
            {
                provider: 'anthropic',
                modelId: 'claude-sonnet-4-20250514',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'claude-opus-4',
        name: 'Claude Opus 4',
        family: 'claude',
        description: 'The latest and greatest from Anthropic.',
        capabilities: ['vision', 'file', 'reasoning'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'anthropic/claude-opus-4',
            },
            {
                provider: 'anthropic',
                modelId: 'claude-opus-4-20250514',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'llama-3-3-70b',
        name: 'Llama 3.3 70b',
        family: 'llama',
        description: 'Industry-leading speed in an open source model.',
        capabilities: ['fast'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'meta-llama/llama-3.3-70b-instruct:free',
                comment: 'Free',
            },
            {
                provider: 'openrouter',
                modelId: 'meta-llama/llama-3.3-70b-instruct',
            },
            {
                provider: 'groq',
                modelId: 'llama-3.3-70b-versatile',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'llama-4-scout',
        name: 'Llama 4 Scout',
        family: 'llama',
        description:
            'Llama 4 Scout 17B Instruct (16E) is a mixture-of-experts (MoE) language model developed by Meta, activating 17 billion parameters out of a total of 109B.',
        capabilities: ['vision'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'meta-llama/llama-4-scout',
            },
            {
                provider: 'openrouter',
                modelId: 'meta-llama/llama-4-scout:free',
                comment: 'Free',
            },
            {
                provider: 'groq',
                modelId: 'meta-llama/llama-4-scout-17b-16e-instruct',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'llama-4-maverick',
        name: 'Llama 4 Maverick',
        family: 'llama',
        description:
            'Llama 4 Maverick 17B Instruct (128E) is a high-capacity multimodal language model from Meta, built on a mixture-of-experts (MoE) architecture with 128 experts and 17 billion active parameters per forward pass (400B total).',
        capabilities: ['vision'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'meta-llama/llama-4-maverick',
            },
            {
                provider: 'openrouter',
                modelId: 'meta-llama/llama-4-maverick:free',
                comment: 'Free',
            },
            {
                provider: 'groq',
                modelId: 'meta-llama/llama-4-maverick-17b-128e-instruct',
            },

        ],
    },
    {
        category: 'flagship',
        slug: 'deepseek-v3',
        name: 'DeepSeek v3',
        family: 'deepseek',
        description: "DeepSeek's groundbreaking direct prediction model.",
        capabilities: [],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'deepseek/deepseek-chat-v3:free',
                comment: 'Free',
            },
            {
                provider: 'openrouter',
                modelId: 'deepseek/deepseek-chat-v3',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'deepseek-v3-0324',
        name: 'DeepSeek v3 (0324)',
        family: 'deepseek',
        description:
            'DeepSeek V3, a 685B-parameter, mixture-of-experts model, is the latest iteration of the flagship chat model family from the DeepSeek team.',
        capabilities: [],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'deepseek/deepseek-chat-v3-0324',
            },
            {
                provider: 'openrouter',
                modelId: 'deepseek/deepseek-chat-v3-0324:free',
                comment: 'Free',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'deepseek-r1-openrouter',
        name: 'DeepSeek R1 (OpenRouter)',
        family: 'deepseek',
        description: 'The open source reasoning model that shook the whole industry.',
        capabilities: ['reasoning'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'deepseek/deepseek-r1',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'deepseek-r1-0528',
        name: 'DeepSeek R1 (0528)',
        family: 'deepseek',
        description: 'The open source reasoning model that shook the whole industry.',
        capabilities: ['reasoning'],
        providers: [
            {
                provider: 'deepseek',
                modelId: 'deepseek-r1-0528',
            },
            {
                provider: 'deepseek',
                modelId: 'deepseek-r1-0528:free',
                comment: 'Free',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'deepseek-r1-llama-distilled',
        name: 'DeepSeek R1 (Llama Distilled)',
        family: 'deepseek',
        description: "It's like normal R1, but WAY faster and slightly dumber.",
        capabilities: ['fast', 'reasoning'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'deepseek/deepseek-r1-distill-llama-8b',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'deepseek-r1-qwen-distilled',
        name: 'DeepSeek R1 (Qwen Distilled)',
        family: 'deepseek',
        description: 'Similar to the Llama distilled model, but distilled on Qwen 32b instead.',
        capabilities: ['reasoning'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'deepseek/deepseek-r1-distill-qwen-32b',
            },
            {
                provider: 'openrouter',
                modelId: 'deepseek/deepseek-r1-distill-qwen-32b:free',
                comment: 'Free',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'grok-3',
        name: 'Grok 3',
        family: 'grok',
        description:
            "xAI's flagship model that excels at data extraction, coding, and text summarization.",
        capabilities: [],
        providers: [
            {
                provider: 'azure',
                modelId: 'xai/grok-3',
            },
            {
                provider: 'openrouter',
                modelId: 'x-ai/grok-3-beta',
            },
            {
                provider: 'xai',
                modelId: 'grok-3',
            },            
        ],
    },
    {
        category: 'flagship',
        slug: 'grok-3-mini',
        name: 'Grok 3 Mini',
        family: 'grok',
        description: 'A lightweight model that thinks before responding.',
        capabilities: ['reasoning', 'effort-control'],
        providers: [
            {
                provider: 'azure',
                modelId: 'xai/grok-3-mini',
            },
            {
                provider: 'openrouter',
                modelId: 'x-ai/grok-3-mini-beta',
            },
            {
                provider: 'xai',
                modelId: 'grok-3-mini',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'qwen-qwq-32b',
        name: 'Qwen qwq-32b',
        family: 'qwen',
        description: 'A surprisingly smart reasoning model that punches way above its weight.',
        capabilities: ['reasoning'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'qwen/qwq-32b',
            },
            {
                provider: 'openrouter',
                modelId: 'qwen/qwq-32b:free',
                comment: 'Free',
            },
            {
                provider: 'groq',
                modelId: 'qwen-qwq-32b',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'qwen-2-5-32b',
        name: 'Qwen 2.5 32b',
        family: 'qwen',
        description: 'The other really good open source model from China.',
        capabilities: ['fast', 'vision'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'qwen/qwen2.5-vl-32b-instruct',
            },
        ],
    },
    {
        category: 'flagship',
        slug: 'qwen-3-32b',
        name: 'Qwen 3 32b',
        family: 'qwen',
        description: 'The other really good open source model from China.',
        capabilities: ['fast', 'vision'],
        providers: [
            {
                provider: 'openrouter',
                modelId: 'qwen/qwen3-32b:free',
                comment: 'Free',
            },
            {
                provider: 'openrouter',
                modelId: 'qwen/qwen3-32b',
            },
            {
                provider: 'groq',
                modelId: 'qwen/qwen3-32b',
            },
        ],
    }
] as const;
