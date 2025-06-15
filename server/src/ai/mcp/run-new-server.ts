import { k8sApi } from '@/kubernetes';
import { App } from '@constants/apps';
import { NAMESPACE } from '@constants/kubernetes';
import { CoreV1ApiCreateNamespacedConfigMapRequest } from '@kubernetes/client-node';
import { TAppConfig } from '@models/app-config';
import Handlebars from 'handlebars';

export type RunServerProps = {
    app: App;
    config: TAppConfig;
    userId: string;
};

export async function runNewServer({ app, config, userId }: RunServerProps) {
    const mcpConfigMap: Record<string, string> = app.configuration.reduce((acc, c) => {
        acc[c.id] = config.config.find((option) => option.id === c.id)?.value || '';
        return acc;
    }, {} as Record<string, string>);

    const envMap = app.environment.map((env) => {
        const envTemplate = Handlebars.compile(env.template);
        return { name: env.variable, value: envTemplate(mcpConfigMap) };
    });

    const configMapName = `mcpconfig-${userId}-${app.slug}`;

    const proxyConfig = {
        mcpProxy: {
            baseURL: 'http://localhost:33783',
            addr: ':8000',
            name: app.name,
            version: '1.0.0',
            options: {
                panicIfInvalid: false,
                logEnabled: true,
                authTokens: [],
            },
        },
        mcpServers: {
            [app.slug]: {
                command: app.runCommand,
                args: app.runArgs,
                env: envMap.reduce((acc, env) => {
                    acc[env.name] = env.value;
                    return acc;
                }, {} as Record<string, string>),
            },
        },
    };

    const configMap: CoreV1ApiCreateNamespacedConfigMapRequest = {
        namespace: NAMESPACE,
        body: {
            apiVersion: 'v1',
            kind: 'ConfigMap',
            metadata: {
                name: configMapName,
                labels: {
                    user_id: userId,
                    mcp_server: app.slug,
                },
            },
            data: {
                'config.json': JSON.stringify(proxyConfig),
            },
        },
    };

    try {
        await k8sApi?.replaceNamespacedConfigMap({
            name: configMapName,
            ...configMap,
        });
    } catch (error) {
        await k8sApi?.createNamespacedConfigMap(configMap);
    }

    const pod = await k8sApi?.createNamespacedPod({
        namespace: NAMESPACE,
        body: {
            apiVersion: 'v1',
            kind: 'Pod',
            metadata: {
                name: `mcp-${userId}-${app.slug}`,
                labels: {
                    app: 'mcp-server',
                    user_id: userId,
                    mcp_server: app.slug,
                },
            },
            spec: {
                containers: [
                    {
                        name: 'mcp-server',
                        image: app.image,
                        env: envMap,
                        command: ['/bin/agin/mcp-proxy'],
                        args: ['-config', '/etc/mcp-proxy/config.json'],
                        volumeMounts: [
                            {
                                name: 'mcp-proxy-volume',
                                mountPath: '/bin/agin',
                            },
                            {
                                name: 'mcp-config-volume',
                                mountPath: '/etc/mcp-proxy',
                            },
                        ],
                        resources: {
                            limits: {
                                cpu: '500m',
                                memory: '512Mi',
                                'ephemeral-storage': '128Mi',
                            },
                            requests: {
                                cpu: '100m',
                                memory: '128Mi',
                                'ephemeral-storage': '32Mi',
                            },
                        },
                    },
                ],
                volumes: [
                    {
                        name: 'mcp-proxy-volume',
                        persistentVolumeClaim: {
                            claimName: 'mcp-proxy-pvc',
                        },
                    },
                    {
                        name: 'mcp-config-volume',
                        configMap: {
                            name: configMapName,
                        },
                    },
                ],
            },
        },
    });

    return pod;

    // console.log(envMap);
}
