export interface ServerToClientEvents {
    'chat.chunk': (chatId: string, chunk: string) => void;
}

export interface ClientToServerEvents {
    'chat.subscribe': (chatId: string) => void;
    'chat.unsubscribe': (chatId: string) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
