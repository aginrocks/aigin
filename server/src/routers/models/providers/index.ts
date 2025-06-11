import { protectedProcedure, router } from '@/trpc';
import { setEnabled } from './setEnabled';

export const get = protectedProcedure.query(({ ctx }) => {
    const providersResponse: Record<string, { enabled: boolean }> = {};

    for (const [key, provider] of Object.entries(ctx.user.providers)) {
        providersResponse[key] = { enabled: provider.enabled };
    }

    return providersResponse;
});

export const providersRouter = router({
    get,
    setEnabled,
});
