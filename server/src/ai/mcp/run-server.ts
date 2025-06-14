import { k8sApi } from '@/kubernetes';
import { App } from '@constants/apps';
import { TAppConfig } from '@models/app-config';
import Handlebars from 'handlebars';

export type RunServerProps = {
    app: App;
    config: TAppConfig;
    userId: string;
};

export async function runServer({ app, config, userId }: RunServerProps) {
    const mcpConfigMap: Record<string, string> = app.configuration.reduce((acc, c) => {
        acc[c.id] = config.config.find((option) => option.id === c.id)?.value || '';
        return acc;
    }, {} as Record<string, string>);

    const envMap = app.environment.map((env) => {
        const envTemplate = Handlebars.compile(env.template);
        return { name: env.variable, value: envTemplate(mcpConfigMap) };
    });

    await k8sApi?.createNamespacedPod({
        namespace: 'default',
        body: {
            apiVersion: 'v1',
            kind: 'Pod',
            metadata: {
                name: `mcp-${userId}-${app.slug}`,
                labels: {
                    user_id: userId,
                    mcp_server: app.slug,
                },
            },
            spec: {
                initContainers: [
                    {
                        name: 'setup-pipes',
                        image: 'busybox:latest',
                        command: ['/bin/sh', '-c'],
                        args: ['mkfifo /pipes/to_worker /pipes/from_worker'],
                        volumeMounts: [
                            {
                                name: 'pipes',
                                mountPath: '/pipes',
                            },
                        ],
                    },
                ],
                containers: [
                    {
                        name: 'mcp-server',
                        image: app.image,
                        env: envMap,
                        command: ['/bin/sh', '-c'],
                        args: [
                            `touch /pipes/worker_ready && exec ${app.runCommand} < /pipes/to_worker > /pipes/from_worker 2>&1`,
                        ],
                        volumeMounts: [
                            {
                                name: 'pipes',
                                mountPath: '/pipes',
                            },
                        ],
                        resources: {
                            limits: {
                                cpu: '500m',
                                memory: '512Mi',
                                'ephemeral-storage': '128Mi',
                            },
                        },
                        readinessProbe: {
                            exec: {
                                command: [
                                    '/bin/sh',
                                    '-c',
                                    'test -p /pipes/from_worker && test -p /pipes/to_worker',
                                ],
                            },
                            initialDelaySeconds: 2,
                            periodSeconds: 1,
                        },
                    },
                    {
                        name: 'proxy',
                        image: 'ghcr.io/sparfenyuk/mcp-proxy:commit-04c92e4@sha256:31f8a7f9e1cbe2223be6ed4c4b12833e0e8e4499e2ff3dfea9c3e7ad9c944bb0',
                        ports: [{ containerPort: 8000 }],
                        command: ['/bin/sh', '-c'],
                        args: [
                            `while [ ! -f /pipes/worker_ready ]; do
    sleep 1
done
exec mcp-proxy --host=0.0.0.0 --port=8000 -- sh -c 'cat /pipes/from_worker & cat > /pipes/to_worker'`,
                        ],
                        volumeMounts: [
                            {
                                name: 'pipes',
                                mountPath: '/pipes',
                            },
                        ],
                        resources: {
                            limits: {
                                cpu: '500m',
                                memory: '512Mi',
                                'ephemeral-storage': '128Mi',
                            },
                        },
                        readinessProbe: {
                            exec: {
                                command: [
                                    '/bin/sh',
                                    '-c',
                                    'test -p /pipes/from_worker && test -p /pipes/to_worker',
                                ],
                            },
                            initialDelaySeconds: 2,
                            periodSeconds: 1,
                        },
                    },
                ],
                volumes: [
                    {
                        name: 'pipes',
                        emptyDir: {
                            medium: 'Memory',
                        },
                    },
                ],
            },
        },
    });

    // console.log(envMap);
}
