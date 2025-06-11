import { Server } from 'socket.io';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './types';

export function bindServer(
    io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
) {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}
