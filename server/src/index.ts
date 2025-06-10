import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { publicProcedure, router } from './trpc';
import { extendZod } from '@zodyac/zod-mongoose';
import { z } from 'zod';
import { initDatabase } from './db';
import { authRouter } from '@routers/auth';

extendZod(z);

initDatabase().then(() => {
    console.log('Database connected successfully');
});

const appRouter = router({
    greeting1: publicProcedure.query(() => 'hello tRPC v10!'),
    auth: authRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
    router: appRouter,
    basePath: '/api/trpc/',
});

server.listen(3001);
