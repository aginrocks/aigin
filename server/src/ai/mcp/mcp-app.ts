import { App } from '@constants/apps';
import { TAppConfig } from '@models/app-config';
import { TUser } from '@models/user';
import { getPodAddress, getServerPod, waitUntilReady } from './get-server';
import { experimental_createMCPClient } from 'ai';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { createRemoteHeaders } from './run-new-server';

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
