import { Server } from 'socket.io';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './types';
import { ServerType } from '@hono/node-server';
import { Chat } from '@models/chat';
import { authMiddleware } from './middleware';

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

    io.use(authMiddleware);

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('chat.subscribe', async (chatId) => {
            const chat = await Chat.findById(chatId);
            if (!chat) throw new Error(`Chat with ID ${chatId} not found`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}
