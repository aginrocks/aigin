import { router } from './trpc';
import { extendZod } from '@zodyac/zod-mongoose';
import { z } from 'zod';
import { initDatabase } from './db';
import { authRouter } from '@routers/auth';
import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import { getAuth, oidcAuthMiddleware, processOAuthCallback } from '@hono/oidc-auth';
import { createContext } from './context';
import { oidcClaimsHook } from './oidc';
import { modelsRouter } from '@routers/models';
import { chatRouter } from '@routers/chat';
import enableDestroy from 'server-destroy';
import { settingsRouter } from '@routers/settings';
import { updateAllModels } from '@ai/models-fetcher';
import { initKubernetes } from './kubernetes';
import { initHandlebars } from './handlebars-json';
import { appsRouter } from '@routers/apps';
import { User } from '@models/user';

dotenv.config();
extendZod(z);
initHandlebars();
initKubernetes();

const app = new Hono();

initDatabase().then(() => {
    console.log('Database connected successfully');
});

const appRouter = router({
    auth: authRouter,
    models: modelsRouter,
    chat: chatRouter,
    settings: settingsRouter,
    apps: appsRouter,
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
    const auth = await getAuth(c);
    if (!auth?.sub) {
        return c.redirect('/');
    }

    const user = await User.findOne({ subject: auth.sub });
    const keys = Object.values(user?.providers || {});

    if (!user || keys.every((value) => !value.apiKey)) {
        console.log(user);

        return c.redirect('/onboarding');
    }
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

updateAllModels();
