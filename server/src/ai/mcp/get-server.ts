import { k8sApi, kc } from '@/kubernetes';
import { runNewServer, RunServerProps } from './run-new-server';
import { NAMESPACE } from '@constants/kubernetes';
import { V1Pod } from '@kubernetes/client-node';
import crypto from 'node:crypto';
import * as k8s from '@kubernetes/client-node';
import { exec } from 'node:child_process';

export type GetServerPodResult =
    | {
          alreadyExisted: true;
          pod: V1Pod;
      }
    | {
          alreadyExisted: false;
          pod: V1Pod | undefined;
      };

/**
 * Gets the app pod for a specific app and user.
 */
export async function getServerPod({
    app,
    config,
    userId,
}: RunServerProps): Promise<GetServerPodResult> {
    if (!k8sApi)
        return {
            alreadyExisted: false,
            pod: undefined,
        };

    const pods = await k8sApi.listNamespacedPod({
        namespace: NAMESPACE,
        labelSelector: `user_id=${userId},mcp_server=${app.slug}`,
    });

    if (pods.items.length !== 0) {
        return {
            alreadyExisted: true,
            pod: pods.items[0],
        };
    }

    const newPod = await runNewServer({ app, config, userId });

    return {
        alreadyExisted: false,
        pod: newPod,
    };
}

/**
 * Get the address of a pod in production and locally forward it using kubectl in development.
 * @param pod Pod object from Kubernetes
 * @returns Pod IP address
 */
export async function getPodAddress(pod: V1Pod) {
    if (process.env.NODE_ENV === 'production')
        return pod.status?.podIP
            ? `http://${pod.status.podIP}:8000/${pod.metadata?.labels?.mcp_server}/sse`
            : undefined;

    // In development, use kubectl port-forward to access the pod
    const podName = pod.metadata?.name;
    const namespace = pod.metadata?.namespace || NAMESPACE;

    const port = crypto.randomInt(30000, 40000);

    // TODO: Secure this command execution
    const command = `kubectl port-forward pod/${podName} ${port}:8000 -n ${namespace}`;
    console.log(command);
    exec(command);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    return podName ? `http://localhost:${port}/${pod.metadata?.labels?.mcp_server}/sse` : undefined;
}

export async function waitUntilReady(pod: V1Pod): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!kc) return reject();

        const timeout = setTimeout(async () => {
            (await abort).abort();
            reject(new Error(`Timeout waiting for pod ${pod.metadata?.name} to be ready`));
        }, 60_000);

        const originalResolve = resolve;
        const originalReject = reject;
        resolve = (...args) => {
            clearTimeout(timeout);
            originalResolve(...args);
        };
        reject = (...args) => {
            clearTimeout(timeout);
            originalReject(...args);
        };

        const watch = new k8s.Watch(kc);

        const abort = watch.watch(
            `/api/v1/pods`,
            {},
            async (type, obj) => {
                if (obj?.metadata?.name !== pod.metadata?.name) return;

                if (obj?.status?.phase === 'Running') {
                    (await abort).abort();
                    resolve();
                } else if (obj?.status?.phase === 'Failed') {
                    (await abort).abort();
                    reject(new Error(`Pod ${pod.metadata?.name} failed to start`));
                }
            },
            async (err) => {
                (await abort).abort();
                reject(err);
            }
        );
    });
}
