import { App, APPS } from '@constants/apps';
import { TAppConfig } from '@models/app-config';
import { TUser } from '@models/user';
import { getPodAddress, getServerPod, waitUntilReady } from './get-server';
import { experimental_createMCPClient, Tool, ToolExecutionOptions, ToolSet } from 'ai';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { createRemoteHeaders } from './run-new-server';
import { randomUUID } from 'node:crypto';
import { CachedChat } from '@ai/generation-manager';
import { SimpleToolCall } from '@models/chat';

export type McpAppConstructorProps = {
    app: App;
    config: TAppConfig;
    user: TUser;
};

export type StartedApp = App & {
    address: string | undefined;
    headerValues?: Record<string, string>;
};

export type MCPClient = Awaited<ReturnType<typeof experimental_createMCPClient>>;

export type McpAction = {
    userId: string;
    appSlug: string;
    resolve: (canContinue: boolean) => void;
};

/**
 * Tool call in the format that is returned to the client.
 */
export type ExtendedToolCall = {
    app: Pick<McpApp['app'], 'name' | 'slug' | 'icon' | 'image' | 'description' | 'isPersistant'>;
    toolName: string;
    callId: string;
};

export function constructUnconfirmedToolCall(
    simpleCall: SimpleToolCall
): ExtendedToolCall | undefined {
    const app = APPS.find((a) => a.slug === simpleCall.appSlug);
    if (!app) return;

    return {
        app: {
            name: app.name,
            slug: app.slug,
            icon: app.icon,
            image: app.image,
            description: app.description,
            isPersistant: app.isPersistant,
        },
        toolName: simpleCall.toolName,
        callId: simpleCall.callId,
    };
}

export const mcpActionsQueue: Map<string, McpAction> = new Map();

export type createInterceptedToolSetProps = {
    chat: CachedChat;
    app: McpApp;
    toolSet: ToolSet;
};

export function createInterceptedToolSet({
    chat,
    app,
    toolSet,
}: createInterceptedToolSetProps): ToolSet {
    const interceptedToolSet: ToolSet = {};

    for (const [name, tool] of Object.entries(toolSet)) {
        interceptedToolSet[name] = {
            ...tool,
            execute: async (args, options) => {
                console.log(`[INTERCEPTOR] Tried to execute tool: ${name}`);
                const canContinue = await new Promise<boolean>((resolve) => {
                    const actionId = options.toolCallId;

                    mcpActionsQueue.set(actionId, {
                        userId: chat.user._id.toString(),
                        appSlug: app.app.slug,
                        resolve,
                    });

                    const simpleCall: SimpleToolCall = {
                        callId: actionId,
                        appSlug: app.app.slug,
                        toolName: name,
                        confirmed: false,
                    };

                    const call = constructUnconfirmedToolCall(simpleCall);

                    if (call) chat.emitEvent('tool:call-metadata', call);
                });

                if (!canContinue) {
                    console.log(`[INTERCEPTOR] Execution of tool: ${name} was cancelled.`);
                    return;
                }

                console.log(`[INTERCEPTOR] Executing tool: ${name} with args:`, args);

                const result = await tool.execute?.(args, options);

                console.log(
                    `[INTERCEPTOR] Tool: ${name} executed successfully with result:`,
                    result
                );

                return result;
            },
        };
    }

    return interceptedToolSet;
}

export class McpApp {
    app: App;
    user: TUser;
    config: TAppConfig;
    address?: string;
    client?: MCPClient;
    headerValues?: Record<string, string>;
    transport: 'sse' | 'http' = 'sse';

    constructor({ app, user, config }: McpAppConstructorProps) {
        this.app = app;
        this.user = user;
        this.config = config;
    }

    async start(): Promise<StartedApp | undefined> {
        console.log(`Starting app: ${this.app.slug} for user: ${this.user.username}`);
        if (this.app.type === 'remote/sse' || this.app.type === 'remote/http') {
            console.log(`App ${this.app.slug} is a remote app, skipping pod creation.`);

            const headers = createRemoteHeaders({ app: this.app, config: this.config });
            this.headerValues = headers;
            this.address = this.app.url;
            this.transport = this.app.type === 'remote/sse' ? 'sse' : 'http';

            return {
                ...this.app,
                address: this.app.url,
                headerValues: headers,
            };
        }

        const { pod, alreadyExisted } = await getServerPod({
            app: this.app,
            config: this.config,
            userId: this.user._id.toString(),
        });

        if (!pod) return;
        const podAddress = await getPodAddress(pod);
        this.address = podAddress;
        if (alreadyExisted)
            return {
                ...this.app,
                address: podAddress,
            };

        // TODO: Wait until the pod is ready
        console.log(`Waiting for pod ${pod.metadata?.name} to be ready...`);

        await waitUntilReady(pod);

        console.log(`Pod ${pod.metadata?.name} is ready.`);

        return {
            ...this.app,
            address: podAddress,
        };
    }

    async createClient() {
        if (!this.address) return;

        const transport: Parameters<typeof experimental_createMCPClient>[0]['transport'] =
            this.transport === 'sse'
                ? {
                      type: 'sse',
                      url: this.address,
                      headers: this.headerValues || {},
                  }
                : new StreamableHTTPClientTransport(new URL(this.address), {
                      requestInit: {
                          headers: this.headerValues || {},
                      },
                  });

        this.client = await experimental_createMCPClient({
            transport,
        });
    }
}
