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

export const headerSchema = z.object({
    variable: z.string(),
    template: z.string(),
});

export const APP_TYPES = ['container/stdio', 'container/sse', 'remote/sse'] as const;

export const appSchema = z.object({
    type: z.enum(APP_TYPES),
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    icon: z.string(),
    configuration: z.array(configOptionSchema),
    environment: z.array(envSchema),
    image: z.string(),
    runCommand: z.string(),
    runArgs: z.array(z.string()).optional(),
    headers: z.array(headerSchema).optional(),
    url: z.string().optional(),
});

export type App = z.infer<typeof appSchema>;

export type StrippedApp = Omit<App, 'environment' | 'image' | 'runCommand' | 'configuration'> & {
    configuration: (App['configuration'][number] & {
        isConfigured: boolean;
    })[];
    isEnabled: boolean;
};

export const APPS: App[] = [
    {
        type: 'container/stdio',
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
                template: `{"Authorization": "Bearer {{jsonString api_key}}", "Notion-Version": "2022-06-28"}`,
            },
        ],
        image: 'mcp/notion:latest',
        runCommand: 'notion-mcp-server',
    },
    {
        type: 'container/stdio',
        slug: 'chess-com',
        name: 'Chess.com',
        description: 'A popular online chess platform.',
        icon: '',
        configuration: [],
        environment: [],
        image: 'pab1it0/chess-mcp:latest',
        runCommand: '/app/.venv/bin/chess-mcp',
    },
    {
        type: 'container/stdio',
        slug: 'gitea',
        name: 'Gitea',
        description: 'A self-hosted Git service.',
        icon: '',
        configuration: [
            {
                id: 'host',
                name: 'Host',
                description: 'The URL of your Gitea (or Forgejo) instance.',
                exampleValue: 'https://gitea.com',
            },
            {
                id: 'token',
                name: 'Access Token',
                description: 'Personal access token for your instance.',
            },
        ],
        environment: [
            {
                variable: 'GITEA_HOST',
                template: `{{host}}`,
            },
            {
                variable: 'GITEA_ACCESS_TOKEN',
                template: `{{token}}`,
            },
        ],
        image: 'docker.gitea.com/gitea-mcp-server:latest',
        runCommand: '/app/gitea-mcp',
    },
    {
        type: 'container/stdio',
        slug: 'tmdb',
        name: 'TMDB',
        description: 'Discover movies, TV shows, and celebrities.',
        icon: '',
        configuration: [
            {
                id: 'api_key',
                name: 'API Key',
                description: 'API key for TMDB integration.',
            },
        ],
        environment: [
            {
                variable: 'TMDB_API_KEY',
                template: `{{api_key}}`,
            },
        ],
        image: 'ghcr.io/tymekv/mcp-server-tmdb:main',
        runCommand: 'node',
        runArgs: ['/usr/src/app/dist/index.js'],
    },
    {
        type: 'container/stdio',
        slug: 'furryos',
        name: 'FurryOS',
        description: "Because Your AI Assistant Shouldn't Hallucinate About Packages",
        icon: '',
        configuration: [],
        environment: [],
        image: 'ghcr.io/tymekv/mcp-nixos:main',
        runCommand: 'python',
        runArgs: ['-m', 'mcp_nixos'],
    },
    // TODO: Add https://github.com/taylorwilsdon/google_workspace_mcp
    // {
    //     type: 'container/stdio',
    //     slug: 'slack',
    //     name: 'Slack',
    //     description: 'A messaging platform for teams.',
    //     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg',
    //     configuration: [
    //         {
    //             id: 'xoxc_token',
    //             name: 'Workspace ID',
    //             description:
    //                 'Workspace ID from the URL of your Slack workspace (e.g., `T12345678` from `https://app.slack.com/client/T12345678/...`).',
    //         },
    //         {
    //             id: 'xoxd_token',
    //             name: 'Session',
    //             description: 'Session ID (value of cookie named "d")',
    //         },
    //     ],
    //     environment: [
    //         {
    //             variable: 'SLACK_MCP_XOXC_TOKEN',
    //             template: `{{xoxc_token}}`,
    //         },
    //         {
    //             variable: 'SLACK_MCP_XOXD_TOKEN',
    //             template: `{{xoxd_token}}`,
    //         },
    //     ],
    //     image: 'ghcr.io/korotovsky/slack-mcp-server:latest',
    //     runCommand: 'mcp-server',
    //     runArgs: ['--transport', 'stdio'],
    // },
];
