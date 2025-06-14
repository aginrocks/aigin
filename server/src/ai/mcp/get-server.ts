import { k8sApi } from '@/kubernetes';
import { runNewServer, RunServerProps } from './run-new-server';
import { NAMESPACE } from '@constants/kubernetes';
import { V1Pod } from '@kubernetes/client-node';
import { exec } from 'child_process';
import crypto from 'node:crypto';

export async function getServerPod({ app, config, userId }: RunServerProps) {
    if (!k8sApi) return;

    const pods = await k8sApi.listNamespacedPod({
        namespace: NAMESPACE,
        labelSelector: `user_id=${userId},mcp_server=${app.slug}`,
    });

    if (pods.items.length !== 0) {
        return pods.items[0];
    }

    return await runNewServer({ app, config, userId });
}

/**
 * Get the address of a pod in production and locally forward it using kubectl in development.
 * @param pod Pod object from Kubernetes
 * @returns Pod IP address
 */
export async function getPodAddress(pod: V1Pod) {
    if (process.env.NODE_ENV === 'production')
        return pod.status?.podIP ? `http://${pod.status.podIP}:8000` : undefined;

    // In development, use kubectl port-forward to access the pod
    const podName = pod.metadata?.name;
    const namespace = pod.metadata?.namespace || NAMESPACE;

    const port = crypto.randomInt(30000, 40000);

    // TODO: Secure this command execution
    exec(`kubectl port-forward pod/${podName} ${port}:8000 -n ${namespace}`);

    return podName ? `http://localhost:${port}` : undefined;
}
