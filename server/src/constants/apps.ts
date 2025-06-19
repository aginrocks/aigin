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
    header: z.string(),
    template: z.string(),
});

export const APP_TYPES = ['container/stdio', 'container/sse', 'remote/sse', 'remote/http'] as const;

export const appSchema = z.object({
    type: z.enum(APP_TYPES),
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    icon: z.string(),
    configuration: z.array(configOptionSchema),
    environment: z.array(envSchema),
    image: z.string().optional(),
    runCommand: z.string().optional(),
    runArgs: z.array(z.string()).optional(),
    headers: z.array(headerSchema).optional(),
    url: z.string().optional(),
    isPersistant: z.boolean().optional(),
    volumeMountPoint: z.string().optional(),
});

export type App = z.infer<typeof appSchema>;

export type StrippedApp = Omit<
    App,
    | 'environment'
    | 'image'
    | 'runCommand'
    | 'configuration'
    | 'volumeMountPoint'
    | 'runCommand'
    | 'runArgs'
> & {
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
        configuration: [],
        environment: [],
        icon: '/icons/chess.svg',
        image: 'pab1it0/chess-mcp:latest',
        runCommand: '/app/.venv/bin/chess-mcp',
    },
    {
        type: 'container/stdio',
        slug: 'gitea',
        name: 'Gitea',
        description: 'A self-hosted Git service.',
        icon: '/icons/gitea.svg',
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
        icon: '/icons/tmdb.svg',
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
        icon: '/icons/nixos.svg',
        configuration: [],
        environment: [],
        image: 'ghcr.io/tymekv/mcp-nixos:main',
        runCommand: 'python',
        runArgs: ['-m', 'mcp_nixos'],
    },
    {
        type: 'container/stdio',
        slug: 'outline',
        name: 'Outline',
        description: 'A modern team knowledge base and wiki.',
        icon: '/icons/outline.svg',
        configuration: [
            {
                id: 'host',
                name: 'Host',
                description: 'The URL of your Outline instance.',
                exampleValue: 'https://app.getoutline.com/api',
            },
            {
                id: 'api_key',
                name: 'API Key',
                description: 'API key for Outline integration.',
            },
        ],
        environment: [
            {
                variable: 'OUTLINE_API_URL',
                template: `{{host}}`,
            },
            {
                variable: 'OUTLINE_API_KEY',
                template: `{{api_key}}`,
            },
            {
                variable: 'DOCKER_CONTAINER',
                template: 'true',
            },
        ],
        image: 'ghcr.io/tymekv/mcp-outline:main',
        runCommand: 'mcp-outline',
    },
    {
        type: 'container/stdio',
        slug: 'mongodb',
        name: 'MongoDB',
        description: 'A NoSQL database for modern applications.',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
        configuration: [
            {
                id: 'connection_string',
                name: 'Connection String',
                description: 'MongoDB connection string',
                exampleValue: 'mongodb+srv://username:password@cluster.mongodb.net/myDatabase',
            },
            {
                id: 'atlas_client_id',
                name: 'Atlas Client ID',
                description: 'MongoDB Atlas Client ID',
            },
            {
                id: 'atlas_client_secret',
                name: 'Atlas Client secret',
                description: 'MongoDB Atlas Client ID',
            },
        ],
        environment: [
            {
                variable: 'MDB_MCP_CONNECTION_STRING',
                template: `{{connection_string}}`,
            },
            {
                variable: 'MDB_MCP_API_CLIENT_ID',
                template: `{{atlas_client_id}}`,
            },
            {
                variable: 'MDB_MCP_API_CLIENT_SECRET',
                template: `{{atlas_client_secret}}`,
            },
        ],
        image: 'mongodb/mongodb-mcp-server:latest',
        runCommand: 'mongodb-mcp-server',
    },
    // TODO: Fix middlewares so this app will work with google
    {
        type: 'container/stdio',
        slug: 'clickup',
        name: 'ClickUp',
        description: 'A productivity platform for teams.',
        icon: '/icons/clickup.svg',
        configuration: [
            {
                id: 'api_key',
                name: 'API Key',
                description: 'API key for ClickUp integration.',
            },
            {
                id: 'team_id',
                name: 'Team ID',
                description: 'ID of the ClickUp team you want to access.',
            },
        ],
        environment: [
            {
                variable: 'CLICKUP_API_KEY',
                template: `{{api_key}}`,
            },
            {
                variable: 'CLICKUP_TEAM_ID',
                template: `{{team_id}}`,
            },
            {
                variable: 'DOCUMENT_SUPPORT',
                template: 'true',
            },
        ],
        image: 'ghcr.io/tymekv/clickup-mcp-server:main',
        runCommand: 'node',
        runArgs: ['/app/build/index.js'],
    },
    {
        type: 'remote/http',
        slug: 'github',
        name: 'GitHub',
        description: 'A platform for version control and collaboration.',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
        configuration: [
            {
                id: 'pat',
                name: 'Personal Access Token',
                description: 'GitHub Personal Access Token.',
            },
        ],
        environment: [],
        url: 'https://api.githubcopilot.com/mcp/',
        headers: [
            {
                header: 'Authorization',
                template: 'Bearer {{pat}}',
            },
        ],
    },
    {
        type: 'container/stdio',
        slug: 'pure-md',
        name: 'pure.md',
        description: 'Markdown delivery network for LLMs.',
        icon: '/icons/puremd.png',
        configuration: [
            {
                id: 'api_key',
                name: 'API Key',
                description: 'API key for pure.md integration.',
            },
        ],
        environment: [
            {
                variable: 'PUREMD_API_KEY',
                template: `{{api_key}}`,
            },
        ],
        image: 'ghcr.io/tymekv/puremd-mcp:main',
        runCommand: 'node',
        runArgs: ['/app/dist/index.js'],
    },
    {
        type: 'remote/http',
        slug: 'context7',
        name: 'Context7',
        description: 'Up-to-date documentation for LLMs and AI code editors.',
        icon: '/icons/context7.svg',
        configuration: [],
        environment: [],
        url: 'https://mcp.context7.com/mcp',
    },
    {
        type: 'container/stdio',
        slug: 'memory',
        name: 'Memory',
        description: 'Let your AI assistant remember things.',
        icon: '/icons/memory.svg',
        configuration: [],
        environment: [
            {
                variable: 'MEMORY_FILE_PATH',
                template: '/data/memory.json',
            },
        ],
        runCommand: 'node',
        runArgs: ['/app/dist/index.js'],
        isPersistant: true,
        volumeMountPoint: '/data',
        image: 'mcp/memory:latest',
    },
    {
        type: 'remote/http',
        slug: 'fetch',
        name: 'Fetch',
        description: 'Fetch data from the web.',
        icon: '/icons/fetch.svg',
        configuration: [],
        environment: [],
        url: 'https://remote.mcpservers.org/fetch/mcp',
    },
    {
        type: 'container/stdio',
        slug: 'mail',
        name: 'Mail',
        description: 'Send and receive emails (ClaudePost).',
        icon: '/icons/mail.svg',
        configuration: [
            {
                id: 'email_address',
                name: 'Email Address',
                description: 'Email address to use for sending and receiving emails.',
                exampleValue: 'user@example.com',
            },
            {
                id: 'email_password',
                name: 'Email Password',
                description: 'Password for the email account (for Gmail an App-Specific Password).',
            },
            {
                id: 'imap_server',
                name: 'IMAP Server',
                description: 'IMAP server address for receiving emails.',
                exampleValue: 'imap.gmail.com',
            },
            {
                id: 'smtp_server',
                name: 'SMTP Server',
                description: 'SMTP server address for sending emails.',
                exampleValue: 'smtp.gmail.com',
            },
            {
                id: 'smtp_port',
                name: 'SMTP Port',
                description: 'Port for the SMTP server (usually 587 for TLS).',
                exampleValue: '587',
            },
        ],
        environment: [
            {
                variable: 'EMAIL_ADDRESS',
                template: `{{email_address}}`,
            },
            {
                variable: 'EMAIL_PASSWORD',
                template: `{{email_password}}`,
            },
            {
                variable: 'IMAP_SERVER',
                template: `{{imap_server}}`,
            },
            {
                variable: 'SMTP_SERVER',
                template: `{{smtp_server}}`,
            },
            {
                variable: 'SMTP_PORT',
                template: `{{smtp_port}}`,
            },
        ],
        image: 'ghcr.io/tymekv/claude-post:main',
        runCommand: 'email-client',
    },
    // TODO: Add surrealdb
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
