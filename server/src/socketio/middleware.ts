import { ExtendedError, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from './types';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export async function authMiddleware(
    socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
    next: (err?: ExtendedError) => void
) {
    console.log('Auth middleware triggered for socket:', socket.id);

    const cookie = socket.handshake.headers.cookie;
    if (!cookie) {
        return next(new Error('No cookie found'));
    }
    const parsedCookie = parse(cookie);
    const token = parsedCookie['oidc-auth'];

    if (!token) {
        return next(new Error('No token found in cookie'));
    }

    try {
        const decodedToken = await new Promise<any>((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
                if (err) return reject(err);
                resolve(decoded);
            });
        });
        console.log('Decoded token:', decodedToken);
        // socket.data.user = decodedToken;
        next();
    } catch (error) {
        next(new Error('Invalid token'));
    }
}
