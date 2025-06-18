import { Chat, deserializeMessages, serializeMessages } from '@models/chat';
import { getUserProviders, TUser } from '@models/user';
import { generateText, Message, streamText, TextStreamPart, ToolSet } from 'ai';
import { getUserRegistry, wrapModel } from './registry';
import { IterableEventEmitter } from '@/iterables';
import { TRPCError } from '@trpc/server';
import { getGenerationPrompt, getTitleGenerationModels } from '@constants/title-generation';
import { ModelId } from '@constants/providers';
import { parseAppMentions, validateAppsRequest } from '@lib/util';
import { createInterceptedToolSet, McpApp, UnconfirmedToolCall } from './mcp/mcp-app';
import { APPS } from '@constants/apps';
import { TAppConfig } from '@models/app-config';

import util from 'node:util';
util.inspect.defaultOptions.depth = null;

export const chatsStore: Map<string, CachedChat> = new Map();
export const chatsEmitter = new IterableEventEmitter<ChatsEventMap>();

export const perUserEmitters: Map<string, IterableEventEmitter<ChatsEventMap>> = new Map();

export function isChatGenerating(chatId: string) {
    const chat = chatsStore.get(chatId);
    if (!chat) return false;
    return chat.isGenerating;
}

export function getUserEmitter(userId: string) {
    if (!perUserEmitters.has(userId)) {
        perUserEmitters.set(userId, new IterableEventEmitter<ChatsEventMap>());
    }
    return perUserEmitters.get(userId)!;
}

/**
 * Emit a chat event globally and for a specific user.
 * @param userId The ID of the user to emit the event for.
 * @param event The event to emit.
 * @param args The arguments to pass to the event.
 */
export function emitGlobalChatEvent<K extends keyof ChatsEventMap>(
    userId: string,
    event: K,
    ...args: ChatsEventMap[K]
) {
    chatsEmitter.emit(event, ...(args as any));
    const userEmitter = getUserEmitter(userId);
    userEmitter.emit(event, ...(args as any));
}

export type ChatsEventMap = {
    /**
     * Emitted when a chat is generating a response.
     * The first string is the chat ID, the second boolean indicates if it's generating.
     */
    'chat:generating': [string, boolean];

    /**
     * Emitted when a chat is created.
     * The first string is the chat ID.
     */
    'chat:created': [string];

    /**
     * Emitted when a chat is renamed.
     * The first string is the chat ID.
     */
    'chat:renamed': [string, string | null, string];

    /**
     * Emitted when a chat is deleted.
     * The first string is the chat ID.
     */
    'chat:deleted': [string];

    /**
     * Emitted when a chat is pinned or unpinned.
     * The first string is the chat ID, the second boolean indicates if it's pinned.
     */
    'chat:pinned': [string, boolean];

    /**
     * Emitted when any of the other events occur.
     * This is a catch-all event for any chat-related changes.
     * The first string is the chat ID.
     */
    'chat:changed': [string];
};

export type CachedChatEventsMap = {
    'message:delta': [TextStreamPart<ToolSet> & { type: 'text-delta' }];
    'message:created': [Message];
    'message:completed': [{ completed: boolean }];
    'message:error': [{ error: string }];
    'tool:confirm-call': [UnconfirmedToolCall];
    'message:changed': [
        | { type: 'message:delta'; data: [TextStreamPart<ToolSet> & { type: 'text-delta' }] }
        | { type: 'message:created'; data: [Message] }
        | { type: 'message:completed'; data: [{ completed: boolean }] }
        | { type: 'message:error'; data: [{ error: string }] }
        | { type: 'tool:confirm-call'; data: [UnconfirmedToolCall] }
    ];
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
    apps: McpApp[] = [];

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
        this.emitGlobalEvent('chat:generating', this.id, generating);
        // TODO: Optimize the event system to avoid unnecessary queries to the database
        this.emitGlobalEvent('chat:changed', this.id);
    }

    public async sendMessage({ model, content }: SendMessage) {
        if (this.isGenerating) {
            throw new Error('Chat is already generating a response');
        }

        const mentions = parseAppMentions(content);
        const checkResult = await validateAppsRequest({
            requestedApps: mentions.mentions,
            userId: this.user._id.toString(),
        });

        if (!checkResult.possible)
            throw new TRPCError({
                code: 'UNPROCESSABLE_CONTENT',
                message: checkResult.errorMessage || 'Invalid app request',
            });

        const newMessage: Message = {
            role: 'user',
            content,
            id: crypto.randomUUID(),
        };
        this.messages.push(newMessage);
        await this.syncToDatabase();

        this.emitEvent('message:created', newMessage);

        let tools: ToolSet = {};
        if (mentions.mentions.length > 0 && checkResult.configs) {
            const loadedApps = await this.loadApps(mentions.mentions, checkResult.configs);
            const apps = loadedApps.filter((a) => !!a);

            const allTools = await Promise.all(
                apps.map(async (app) => {
                    await app.createClient();
                    return createInterceptedToolSet({
                        chat: this,
                        app,
                        toolSet: await app.client!.tools(),
                    });
                })
            );

            tools = allTools.reduce((acc, toolSet) => {
                return { ...acc, ...toolSet };
            }, {} as ToolSet);
        }

        console.log('msg', this.messages);

        // TODO: Fix MCP on anthropic models via openrouter
        const response = streamText({
            model: wrapModel(model as `${string}:${string}`, this.user),
            messages: this.messages,
            tools,
            maxSteps: 9999999,
            // toolCallStreaming: true,
        });

        // Set generating flag and don't await - let this run in the background so the mutation can return immediately
        this.setGenerating(true);
        this.processStream(response.fullStream);
        this.generateTitle();
    }

    /**
     * Loads the apps specified by their IDs.
     * Assumes that the app IDs are valid and that the apps are configured by the user.
     * @param appIds An array of **valid** app IDs to load.
     */
    private async loadApps(appIds: string[], configs: TAppConfig[]) {
        const apps = appIds.map(
            (appId) =>
                new McpApp({
                    app: APPS.find((a) => a.slug === appId)!,
                    user: this.user,
                    config: configs.find((c) => c.appSlug === appId)!,
                })
        );

        const results = await Promise.all(apps.map((app) => app.start()));
        console.log(`Loaded apps for chat ${this.id}:`, results);

        return apps;
    }

    private async processStream(stream: AsyncIterable<TextStreamPart<ToolSet>>) {
        try {
            for await (const part of stream) {
                console.log(part);
                this.handlePart(part);
            }

            // Emit a completion event when streaming is done
            this.emitEvent('message:completed', { completed: true });

            // Final sync to database
            await this.syncToDatabase();
        } catch (error) {
            console.error(`Error processing stream for chat ${this.id}:`, error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.emitEvent('message:error', { error: errorMessage });
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
            this.emitEvent('message:created', lastMessage);
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

        this.emitEvent('message:delta', part);
    }

    private async attemptTitleGeneration(model: ModelId) {
        console.log(`Attempting to generate title with model: ${model}`);
        const { user, system } = getGenerationPrompt(model, this.messages[0]?.content);

        const registry = getUserRegistry(this.user);

        const response = await generateText({
            model: registry.languageModel(model),
            messages: [
                ...(system ? [{ role: 'system' as const, content: system }] : []),
                { role: 'user' as const, content: user },
            ],
        });

        const title = response.text.replaceAll(/[*_~`#]/g, '').trim();

        return title;
    }

    private async _generateTitle() {
        const avaliableProviders = getUserProviders(this.user);
        const avaliableModels = getTitleGenerationModels(avaliableProviders);
        if (avaliableModels.length === 0) {
            return 'New Chat';
        }

        console.log({ avaliableModels });

        for (const model of avaliableModels) {
            try {
                const title = await this.attemptTitleGeneration(model);
                console.log(`Generated title with model ${model}:`, title);
                if (title) return title;
            } catch (error) {
                console.error(`Error generating title with model ${model}:`, error);
            }
        }

        return 'New Chat';
    }

    public async generateTitle() {
        const before = Date.now();
        const title = await this._generateTitle();
        const oldChat = await Chat.findByIdAndUpdate(
            this.id,
            {
                name: title,
            },
            {
                returnDocument: 'before',
            }
        );
        this.emitGlobalEvent('chat:renamed', this.id, oldChat?.name || null, title);
        console.log(`Chat title generated in ${Date.now() - before}ms: ${title}`);
    }

    public emitGlobalEvent<K extends keyof ChatsEventMap>(event: K, ...args: ChatsEventMap[K]) {
        emitGlobalChatEvent(this.user._id.toString(), event, ...args);
        if (event !== 'chat:changed')
            emitGlobalChatEvent(this.user._id.toString(), 'chat:changed', args[0]);
    }

    public emitEvent<K extends keyof CachedChatEventsMap>(
        event: K,
        ...args: CachedChatEventsMap[K]
    ) {
        this.emitter.emit(event, ...(args as any));
        if (event !== 'message:changed') {
            this.emitter.emit('message:changed', {
                type: event as Exclude<K, 'message:changed'>,
                data: args as any,
            } as CachedChatEventsMap['message:changed'][0]);
        }
    }

    async syncToDatabase() {
        const serializedMessages = serializeMessages(this.messages);

        return await Chat.findByIdAndUpdate(this.id, {
            messages: serializedMessages,
        });
    }

    public destroy() {
        // TODO: Handle better cleanup
        this.emitter.removeAllListeners();
        chatsStore.delete(this.id);
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
        const alreadyCached = chatsStore.get(chatId);
        if (alreadyCached) return alreadyCached;
    }

    if (chatId) {
        chatDetails = await Chat.findById(chatId);
        if (!chatDetails) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Chat not found',
            });
        }

        if (chatDetails.user.toString() !== user._id.toString()) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You do not have permission to access this chat',
            });
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
