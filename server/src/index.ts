import { protectedProcedure, publicProcedure, router } from './trpc';
import { extendZod } from '@zodyac/zod-mongoose';
import { z } from 'zod';
import { initDatabase } from './db';
import { authRouter } from '@routers/auth';
import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import { oidcAuthMiddleware, processOAuthCallback } from '@hono/oidc-auth';
import { createContext } from './context';
import { oidcClaimsHook } from './oidc';
import { modelsRouter } from '@routers/models';
import { chatRouter } from '@routers/chat';
import enableDestroy from 'server-destroy';
import { settingsRouter } from '@routers/settings';

dotenv.config();
extendZod(z);

const app = new Hono();

initDatabase().then(() => {
    console.log('Database connected successfully');
});

const appRouter = router({
    auth: authRouter,
    models: modelsRouter,
    chat: chatRouter,
    settings: settingsRouter,
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

const server = serve(
    {
        fetch: app.fetch,
        port: 3001,
    },
    (info) => {
        console.log(`Server is running: http://${info.address}:${info.port}`);
    }
);

enableDestroy(server);

// graceful shutdown
process.on('SIGINT', () => {
    server.destroy();
    process.exit(0);
});
process.on('SIGTERM', () => {
    server.destroy((err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        process.exit(0);
    });
});
