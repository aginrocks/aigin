import { App } from '@constants/apps';
import { TAppConfig } from '@models/app-config';
import { TUser } from '@models/user';
import { getPodAddress, getServerPod, waitUntilReady } from './get-server';
import { experimental_createMCPClient } from 'ai';

export type McpAppConstructorProps = {
    app: App;
    config: TAppConfig;
    user: TUser;
};

export type StartedApp = App & {
    address: string | undefined;
};

export type MCPClient = Awaited<ReturnType<typeof experimental_createMCPClient>>;

export class McpApp {
    app: App;
    user: TUser;
    config: TAppConfig;
    address?: string;
    client?: MCPClient;

    constructor({ app, user, config }: McpAppConstructorProps) {
        this.app = app;
        this.user = user;
        this.config = config;
    }

    async start(): Promise<StartedApp | undefined> {
        console.log(`Starting app: ${this.app.slug} for user: ${this.user.username}`);
        if (this.app.type === 'remote/sse') {
            console.log(`App ${this.app.slug} is a remote app, skipping pod creation.`);
            return {
                ...this.app,
                address: this.app.url,
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

        this.client = await experimental_createMCPClient({
            transport: {
                type: 'sse',
                url: this.address,
            },
        });
    }
}
