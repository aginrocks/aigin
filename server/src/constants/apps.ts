import { z } from 'zod';

export const configOptionSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    exampleValue: z.string().optional(),
});

export const envSchema = z.object({
    variable: z.string(),
    template: z.string(),
});

export const appSchema = z.object({
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    icon: z.string(),
    configuration: z.array(configOptionSchema),
    environment: z.array(envSchema),
    image: z.string(),
    runCommand: z.string(),
});

export type App = z.infer<typeof appSchema>;

export const APPS: App[] = [
    {
        slug: 'notion',
        name: 'Notion',
        description: 'A note-taking and organization tool.',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg',
        configuration: [
            {
                id: 'api_key',
                name: 'API Key',
                description: 'API key for Notion integration.',
                exampleValue: 'secret_1234567890abcdef',
            },
        ],
        environment: [
            {
                variable: 'OPENAPI_MCP_HEADERS',
                template: `{"Authorization": "Bearer {{jsonString api_key}}"}`,
            },
        ],
        image: 'mcp/notion:latest',
        runCommand: 'notion-mcp-server',
    },
];
