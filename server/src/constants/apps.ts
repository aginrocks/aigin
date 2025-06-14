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
    // {
    //     type: 'container/stdio',
    //     slug: 'gitea',
    //     name: 'Gitea',
    //     description: 'A self-hosted Git service.',
    //     icon: '',
    //     configuration: [
    //         {
    //             id: 'host',
    //             name: 'Host',
    //             description: 'The URL of your Gitea (or Forgejo) instance.',
    //             exampleValue: 'https://gitea.com',
    //         },
    //         {
    //             id: 'token',
    //             name: 'Access Token',
    //             description: 'Personal access token for your instance.',
    //         },
    //     ],
    //     environment: [
    //         {
    //             variable: 'GITEA_HOST',
    //             template: `{{host}}`,
    //         },
    //         {
    //             variable: 'GITEA_ACCESS_TOKEN',
    //             template: `{{token}}`,
    //         },
    //     ],
    //     image: 'docker.gitea.com/gitea-mcp-server:latest',
    //     runCommand: '/app/gitea-mcp',
    // },
    // {
    //     slug: 'slack',
    //     name: 'Slack',
    //     description: 'A messaging platform for teams.',
    //     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg',
    //     configuration: [
    //         {
    //             id: 'xoxc_token',
    //             name: 'Session',
    //             description:
    //                 'Session ID (value of JSON.parse(localStorage.localConfig_v2).teams[document.location.pathname.match(/^/client/([A-Z0-9]+)/)[1]].token )',
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
    //     runCommand: 'mcp-server --transport stdio',
    // },
];
