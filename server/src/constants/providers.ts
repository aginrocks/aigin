export const PROVIDER_IDS = [
    'google',
    'openai',
    'openrouter',
    'groq',
    'azure',
    'anthropic',
    'deepseek',
    'xai',
] as const;

export type Provider = {
    id: (typeof PROVIDER_IDS)[number];
    name: string;
    logo: string;
};

export type ProviderId = (typeof PROVIDER_IDS)[number];
export type ModelId = `${ProviderId}:${string}`;

export const PROVIDERS: Provider[] = [
    {
        id: 'google',
        name: 'Google',
        logo: '/api/static/google.svg',
    },
    {
        id: 'openai',
        name: 'OpenAI',
        logo: '/api/static/openai.svg',
    },
    {
        id: 'openrouter',
        name: 'OpenRouter',
        logo: '/api/static/openrouter.svg',
    },
    {
        id: 'groq',
        name: 'Groq',
        logo: '/api/static/groq.svg',
    },
    {
        id: 'azure',
        name: 'GitHub',
        logo: '/api/static/github.svg',
    },
    {
        id: 'anthropic',
        name: 'Anthropic',
        logo: '/api/static/anthropic.svg',
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        logo: '/api/static/deepseek.svg',
    },
    {
        id: 'xai',
        name: 'xAI',
        logo: '/api/static/xai.svg',
    },
] as const;
