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

// Define more specific types for MCP requests and responses
export type MCPRequest = {
    method: string;
    path: string;
    headers?: Record<string, string>;
    body?: unknown;
};

export type MCPResponse = {
    status?: number;
    headers?: Record<string, string>;
    body?: unknown;
};

export type MCPRequestInterceptor = (request: MCPRequest) => MCPRequest | Promise<MCPRequest>;
export type MCPResponseInterceptor = (response: MCPResponse) => MCPResponse | Promise<MCPResponse>;

/**
 * Creates an intercepted MCP client that wraps the experimental_createMCPClient
 * and allows for interception of requests and responses.
 *
 * @param options The original options to pass to experimental_createMCPClient
 * @param requestInterceptor Optional function to intercept and modify requests
 * @param responseInterceptor Optional function to intercept and modify responses
 * @returns An MCP client with intercepted methods
 */
export async function createInterceptedMCPClient(
    options: Parameters<typeof experimental_createMCPClient>[0],
    requestInterceptor?: MCPRequestInterceptor,
    responseInterceptor?: MCPResponseInterceptor
): Promise<MCPClient> {
    // Create the original client
    const originalClient = await experimental_createMCPClient(options);

    // Create a proxy to intercept all functions
    const interceptedClient = new Proxy(originalClient, {
        get(target, prop, receiver) {
            const originalProperty = Reflect.get(target, prop, receiver);

            // If the property is a function, wrap it to allow interception
            if (typeof originalProperty === 'function') {
                return async function (...args: unknown[]) {
                    // Apply request interceptor if provided
                    let interceptedArgs = args;
                    if (requestInterceptor) {
                        try {
                            // Apply the interceptor to each argument
                            interceptedArgs = await Promise.all(
                                args.map((arg) => requestInterceptor(arg as MCPRequest))
                            );
                            console.log(
                                `Intercepted request for method ${String(prop)}:`,
                                JSON.stringify(interceptedArgs, null, 2)
                            );
                        } catch (error) {
                            console.error(
                                `Error in request interceptor for method ${String(prop)}:`,
                                error
                            );
                        }
                    }

                    // Call the original function with potentially modified args
                    const result = await originalProperty.apply(target, interceptedArgs);

                    // Apply response interceptor if provided
                    if (responseInterceptor && result) {
                        try {
                            const interceptedResult = await responseInterceptor(
                                result as MCPResponse
                            );
                            console.log(
                                `Intercepted response from method ${String(prop)}:`,
                                typeof interceptedResult === 'object'
                                    ? JSON.stringify(interceptedResult, null, 2)
                                    : interceptedResult
                            );
                            return interceptedResult;
                        } catch (error) {
                            console.error(
                                `Error in response interceptor for method ${String(prop)}:`,
                                error
                            );
                            return result;
                        }
                    }

                    return result;
                };
            }

            // Return non-function properties as is
            return originalProperty;
        },
    });

    return interceptedClient as MCPClient;
}

export class McpApp {
    app: App;
    user: TUser;
    config: TAppConfig;
    address?: string;
    client?: MCPClient;
    headerValues?: Record<string, string>;
    transport: 'sse' | 'http' = 'sse';
    requestInterceptor?: MCPRequestInterceptor;
    responseInterceptor?: MCPResponseInterceptor;

    constructor({ app, user, config }: McpAppConstructorProps) {
        this.app = app;
        this.user = user;
        this.config = config;
    }

    /**
     * Set request and response interceptors
     * @param requestInterceptor Function to intercept and modify requests
     * @param responseInterceptor Function to intercept and modify responses
     * @returns this instance for chaining
     */
    setInterceptors(
        requestInterceptor?: MCPRequestInterceptor,
        responseInterceptor?: MCPResponseInterceptor
    ) {
        this.requestInterceptor = requestInterceptor;
        this.responseInterceptor = responseInterceptor;
        return this;
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

        // Use the intercepted client if interceptors are provided
        if (this.requestInterceptor || this.responseInterceptor) {
            this.client = await createInterceptedMCPClient(
                { transport },
                this.requestInterceptor,
                this.responseInterceptor
            );
        } else {
            this.client = await experimental_createMCPClient({
                transport,
            });
        }
    }
}
