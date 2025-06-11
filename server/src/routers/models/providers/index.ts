import { protectedProcedure, router } from '@/trpc';
import { setEnabled } from './setEnabled';
import { PROVIDERS } from '@constants/providers';

export const get = protectedProcedure.query(({ ctx }) => {
    const response = PROVIDERS.map((p) => ({
        ...p,
        enabled: ctx.user.providers[p.id].enabled ?? false,
        apiKeySet: !!ctx.user.providers[p.id].apiKey,
    }));

    return response;
});

export const providersRouter = router({
    get,
    setEnabled,
});
