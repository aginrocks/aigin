import { protectedProcedure } from '@/trpc';
import { APPS, StrippedApp } from '@constants/apps';
import { AppConfig } from '@models/app-config';

export const getAll = protectedProcedure.query(async ({ ctx }): Promise<StrippedApp[]> => {
    const userConfigs = await AppConfig.find({
        user: ctx.user._id,
    });

    const strippedApps = APPS.map((app): StrippedApp => {
        const {
            environment: _environment,
            image: _image,
            runCommand: _runCommand,
            configuration: _configuration,
            volumeMountPoint: _volumeMountPoint,
            runArgs: _runArgs,
            ...strippedApp
        } = app;
        return {
            ...strippedApp,
            configuration: _configuration.map((config) => {
                const userConfig = userConfigs.find((c) => c.appSlug === app.slug);
                return { ...config, isConfigured: !!userConfig };
            }),
            isEnabled: userConfigs.find((c) => c.appSlug === app.slug)?.enabled ?? false,
        };
    });

    return strippedApps;
});
