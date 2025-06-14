import { App } from '@constants/apps';
import { TAppConfig } from '@models/app-config';
import { TUser } from '@models/user';
import { getPodAddress, getServerPod } from './get-server';

export type McpAppConstructorProps = {
    app: App;
    config: TAppConfig;
    user: TUser;
};

export class McpApp {
    app: App;
    user: TUser;
    config: TAppConfig;

    constructor({ app, user, config }: McpAppConstructorProps) {
        this.app = app;
        this.user = user;
        this.config = config;
    }

    async start() {
        console.log(`Starting app: ${this.app.slug} for user: ${this.user.username}`);
        if (this.app.type === 'remote/sse') {
            console.log(`App ${this.app.slug} is a remote app, skipping pod creation.`);
            return this.app.url;
        }

        const { pod, alreadyExisted } = await getServerPod({
            app: this.app,
            config: this.config,
            userId: this.user._id.toString(),
        });

        if (alreadyExisted) return getPodAddress(pod);

        // TODO: Wait until the pod is ready

        if (pod) return getPodAddress(pod);
    }
}
