import { getAuth, revokeSession } from '@hono/oidc-auth';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { Context } from 'hono';

export async function createContext(_opts: FetchCreateContextFnOptions, c: Context<any, any, {}>) {
    return { getAuth: () => getAuth(c), revokeSession: () => revokeSession(c) };
}

export type TRPCContext = Awaited<ReturnType<typeof createContext>>;
