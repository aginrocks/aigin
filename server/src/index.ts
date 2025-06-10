import { protectedProcedure, publicProcedure, router } from './trpc';
import { extendZod } from '@zodyac/zod-mongoose';
import { z } from 'zod';
import { initDatabase } from './db';
import { authRouter } from '@routers/auth';
import { Context, Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import { getAuth, oidcAuthMiddleware, processOAuthCallback, revokeSession } from '@hono/oidc-auth';
import { createContext } from './context';
import { oidcClaimsHook } from './oidc';

dotenv.config();
extendZod(z);

const app = new Hono();

initDatabase().then(() => {
    console.log('Database connected successfully');
});

const appRouter = router({
    auth: authRouter,
    test: publicProcedure.query(async ({ ctx }) => {
        const user = await ctx.getAuth();
        console.log('User:', user);
        return {
            email: user?.email,
        };
    }),
    test2: protectedProcedure.query(async ({ ctx }) => {
        return {
            user: ctx.auth.given_name,
        };
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

app.use(
    '/api/trpc/*',
    trpcServer({
        router: appRouter,
        endpoint: '/api/trpc',
        createContext,
    })
);

app.get('/api/auth/callback', async (c) => {
    c.set('oidcClaimsHook', oidcClaimsHook);
    return processOAuthCallback(c);
});

app.get('/api/login', oidcAuthMiddleware(), async (c) => {
    return c.redirect('/');
});

const server = serve({
    fetch: app.fetch,
    port: 3001,
});

// graceful shutdown
process.on('SIGINT', () => {
    server.close();
    process.exit(0);
});
process.on('SIGTERM', () => {
    server.close((err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        process.exit(0);
    });
});
