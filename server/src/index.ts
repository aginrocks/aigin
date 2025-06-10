import { publicProcedure, router } from './trpc';
import { extendZod } from '@zodyac/zod-mongoose';
import { z } from 'zod';
import { initDatabase } from './db';
import { authRouter } from '@routers/auth';
import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { serve } from '@hono/node-server';

const app = new Hono();

extendZod(z);

initDatabase().then(() => {
    console.log('Database connected successfully');
});

const appRouter = router({
    auth: authRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

app.use(
    '/api/trpc/*',
    trpcServer({
        router: appRouter,
        endpoint: '/api/trpc',
    })
);

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
