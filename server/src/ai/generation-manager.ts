import { Chat, deserializeMessages, serializeMessages } from '@models/chat';
import { TUser } from '@models/user';
import { Message, streamText, TextStreamPart, ToolSet } from 'ai';
import { getUserRegistry } from './registry';
import { IterableEventEmitter } from '@/iterables';

export const chatsStore: Map<string, CachedChat> = new Map();
export const chatsEmitter = new IterableEventEmitter<ChatsEventMap>();

export type ChatsEventMap = {
    /**
     * Emitted when a chat is generating a response.
     * The first string is the chat ID, the second boolean indicates if it's generating.
     */
    'chat:generating': [string, boolean];
};

export type CachedChatEventsMap = {
    'message:delta': [TextStreamPart<ToolSet> & { type: 'text-delta' }];
    'message:created': [Message];
    'message:completed': [{ completed: boolean }];
    'message:error': [{ error: string }];
};

export type SendMessage = {
    model: string;
    content: string;
    // TODO: Add tools and attachments
};

/**
 * When a chat is generating, the incoming tokens are cached here.
 * This allows us to resume the chat generation if it was interrupted.
 * When the generation ends, the cached chat is saved to the database.
 */
export class CachedChat {
    id: string;
    user: TUser;
    messages: Message[] = [];
    emitter = new IterableEventEmitter<CachedChatEventsMap>();
    isGenerating = false;

    constructor(id: string, user: TUser, messages: Message[] = []) {
        this.id = id;
        this.user = user;
        this.messages = messages;
    }

    public getMessages() {
        return this.messages;
    }

    public setGenerating(generating: boolean) {
        this.isGenerating = generating;
        chatsEmitter.emit('chat:generating', this.id, generating);
    }

    public async sendMessage({ model, content }: SendMessage) {
        if (this.isGenerating) {
            throw new Error('Chat is already generating a response');
        }

        const newMessage: Message = {
            role: 'user',
            content,
            id: crypto.randomUUID(),
        };
        this.messages.push(newMessage);
        await this.syncToDatabase();

        this.emitter.emit('message:created', newMessage);

        const registry = getUserRegistry(this.user);

        const response = streamText({
            model: registry.languageModel(model as `${string}:${string}`),
            messages: this.messages,
        });

        // Set generating flag and don't await - let this run in the background so the mutation can return immediately
        this.setGenerating(true);
        this.processStream(response.fullStream);
    }

    private async processStream(stream: AsyncIterable<TextStreamPart<ToolSet>>) {
        try {
            for await (const part of stream) {
                // console.log(part);
                this.handlePart(part);
            }

            // Emit a completion event when streaming is done
            this.emitter.emit('message:completed', { completed: true });

            // Final sync to database
            await this.syncToDatabase();
        } catch (error) {
            console.error(`Error processing stream for chat ${this.id}:`, error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.emitter.emit('message:error', { error: errorMessage });
        } finally {
            this.setGenerating(false);
        }
    }

    private handlePart(part: TextStreamPart<ToolSet>) {
        // Ensuring that we have a last message to append the part to.
        let lastMessage = this.messages[this.messages.length - 1];
        if (!lastMessage || lastMessage.role !== 'assistant') {
            lastMessage = {
                role: 'assistant',
                content: '',
                id: crypto.randomUUID(),
                parts: [],
            };
            this.messages.push(lastMessage);
        }

        if (part.type === 'text-delta') {
            this.handleDelta(lastMessage, part);
        }
    }

    private handleDelta(
        lastMessage: Message,
        part: TextStreamPart<ToolSet> & { type: 'text-delta' }
    ) {
        const lastPart = lastMessage.parts?.[lastMessage.parts.length - 1];
        if (lastPart && lastPart.type === 'text') {
            lastPart.text += part.textDelta;
        } else {
            lastMessage.parts = [
                ...(lastMessage.parts || []),
                { type: 'text', text: part.textDelta },
            ];
        }

        this.emitter.emit('message:delta', part);
    }

    async syncToDatabase() {
        const serializedMessages = serializeMessages(this.messages);

        return await Chat.findByIdAndUpdate(this.id, {
            messages: serializedMessages,
        });
    }

    public debug() {
        this.emitter.on('message:created', (message) => {
            console.log(`[message:created] New message created in chat ${this.id}:`, message);
        });
        this.emitter.on('message:delta', (delta) => {
            console.log(`[message:delta] New delta received in chat ${this.id}`, delta);
        });
        this.emitter.on('message:completed', (completion) => {
            console.log(
                `[message:completed] Message generation completed in chat ${this.id}`,
                completion
            );
        });
        this.emitter.on('message:error', (error) => {
            console.log(`[message:error] Error in chat ${this.id}`, error);
        });
    }
}

/**
 * Loads the chat context for a given chat ID.
 * @param chatId The ID of the chat to load.
 * @returns The cached chat context.
 */
export async function loadContext(user: TUser, chatId?: string) {
    let chatDetails;
    let messages: Message[] = [];
    if (chatId) {
        chatDetails = await Chat.findById(chatId);
        if (!chatDetails) {
            throw new Error(`Chat with ID ${chatId} not found`);
        }

        messages = deserializeMessages(chatDetails.messages);
    } else {
        chatDetails = await Chat.create({
            user: user._id,
            name: 'New Chat',
            messages: [],
        });
        chatId = chatDetails._id.toString();
        messages = [];
    }

    const chat = new CachedChat(chatId, user, messages);
    chat.debug();

    chatsStore.set(chatId, chat);
    return chat;
}
