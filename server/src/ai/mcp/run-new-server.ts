import { k8sApi } from '@/kubernetes';
import { App } from '@constants/apps';
import { NAMESPACE } from '@constants/kubernetes';
import {
    CoreV1ApiCreateNamespacedConfigMapRequest,
    V1PersistentVolumeClaim,
} from '@kubernetes/client-node';
import { TAppConfig } from '@models/app-config';
import Handlebars from 'handlebars';

export type RunServerProps = {
    app: App;
    config: TAppConfig;
    userId: string;
};

export async function runNewServer({ app, config, userId }: RunServerProps) {
    const mcpConfigMap = generateMcpConfigMap(app, config);

    const envMap = app.environment.map((env) => {
        const envTemplate = Handlebars.compile(env.template);
        return { name: env.variable, value: envTemplate(mcpConfigMap) };
    });

    const configMapName = `mcpconfig-${userId}-${app.slug}`;

    const proxyConfig = {
        mcpProxy: {
            // baseURL: 'http://localhost:33783',
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
    } catch {
        await k8sApi?.createNamespacedConfigMap(configMap);
    }

    let pvcName: string | undefined;
    if (app.isPersistant) {
        pvcName = await ensurePVCExists({ app, userId });
    }

    console.log({ pvcName });

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
                                readOnly: true,
                            },
                            {
                                name: 'mcp-config-volume',
                                mountPath: '/etc/mcp-proxy',
                            },
                            ...(app.isPersistant && app.volumeMountPoint && pvcName
                                ? [
                                      {
                                          name: 'mcp-data-volume',
                                          mountPath: app.volumeMountPoint,
                                      },
                                  ]
                                : []),
                        ],
                        resources: {
                            limits: {
                                cpu: '500m',
                                memory: '512Mi',
                                'ephemeral-storage': '128Mi',
                            },
                            requests: {
                                cpu: '50m',
                                memory: '64Mi',
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
                    ...(app.isPersistant && app.volumeMountPoint && pvcName
                        ? [
                              {
                                  name: 'mcp-data-volume',
                                  persistentVolumeClaim: {
                                      claimName: pvcName,
                                  },
                              },
                          ]
                        : []),
                ],
            },
        },
    });

    return pod;

    // console.log(envMap);
}

async function ensurePVCExists({ app, userId }: Omit<RunServerProps, 'config'>) {
    const pvcName = `mcppvc-${userId}-${app.slug}`;

    try {
        await k8sApi?.readNamespacedPersistentVolumeClaim({
            name: pvcName,
            namespace: NAMESPACE,
        });
        return pvcName; // PVC already exists, no need to create
    } catch {
        // PVC doesn't exist, proceed with creation
    }
    const pvc: V1PersistentVolumeClaim = {
        apiVersion: 'v1',
        kind: 'PersistentVolumeClaim',
        metadata: {
            name: pvcName,
            labels: {
                app: 'mcp-server',
                user_id: userId,
                mcp_server: app.slug,
            },
        },
        spec: {
            accessModes: ['ReadWriteOnce'],
            resources: {
                requests: {
                    storage: '1Mi',
                },
                limits: {
                    storage: '128Mi',
                },
            },
        },
    };

    await k8sApi?.createNamespacedPersistentVolumeClaim({
        namespace: NAMESPACE,
        body: pvc,
    });

    return pvcName;
}

function generateMcpConfigMap(app: App, config: TAppConfig): Record<string, string> {
    return app.configuration.reduce((acc, c) => {
        acc[c.id] = config.config.find((option) => option.id === c.id)?.value || '';
        return acc;
    }, {} as Record<string, string>);
}

export type CreateHeadersProps = {
    app: App;
    config: TAppConfig;
};

export function createRemoteHeaders({ app, config }: CreateHeadersProps) {
    const configMap = generateMcpConfigMap(app, config);
    const headers: Record<string, string> = {};
    app.headers?.forEach((env) => {
        const envTemplate = Handlebars.compile(env.template);
        headers[env.header] = envTemplate(configMap);
    });

    return headers;
}
