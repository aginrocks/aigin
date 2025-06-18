import * as k8s from '@kubernetes/client-node';

export let kc: k8s.KubeConfig | null = null;
export let k8sApi: k8s.CoreV1Api | null = null;

export function initKubernetes() {
    kc = new k8s.KubeConfig();
    if (process.env.NODE_ENV === 'production') kc.loadFromCluster();
    else kc.loadFromDefault();

    k8sApi = kc.makeApiClient(k8s.CoreV1Api);
}
