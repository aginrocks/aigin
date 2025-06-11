export const PROVIDER_IDS = [
    'google',
    'openai',
    'openrouter',
    'groq',
    'github',
    'anthropic',
] as const;

export type Provider = {
    id: (typeof PROVIDER_IDS)[number];
    name: string;
    logo: string;
};

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
        id: 'github',
        name: 'GitHub',
        logo: '/api/static/github.svg',
    },
    {
        id: 'anthropic',
        name: 'Anthropic',
        logo: '/api/static/anthropic.svg',
    },
] as const;
