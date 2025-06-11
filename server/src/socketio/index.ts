import { Server } from 'socket.io';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './types';
import { ServerType } from '@hono/node-server';

type IOServer = ReturnType<typeof createIOServer>;

export let io: IOServer | null = null;

export function createIOServer(server: ServerType) {
    return new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
        server,
        {
            serveClient: false,
        }
    );
}

export function bindServer(server: ServerType) {
    io = createIOServer(server);

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}
