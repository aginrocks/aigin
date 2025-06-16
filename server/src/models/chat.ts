import mongoose, { Types } from 'mongoose';
import { Schema, z } from 'zod';
import zodSchema, { zId, zodSchemaRaw } from '@zodyac/zod-mongoose';
import { Message } from 'ai';

export const toolInvocationSchema = z.object({
    args: z.any(),
    result: z.any(),
    state: z.enum(['result', 'call', 'partial-call']),
    toolCallId: z.string(),
    toolName: z.string(),
});

export const sourceSchema = z.object({
    id: z.string(),
    sourceType: z.enum(['url']).default('url'),
    url: z.string().url(),
    providerMetadata: z.any().optional(),
    title: z.string().optional(),
});

export const reasoningDetail = z.object({
    text: z.string().optional(),
    type: z.enum(['text', 'redacted']),
    signature: z.any().optional(),
});

export const messagePartSchema = z.object({
    type: z.enum(['text', 'source', 'reasoning', 'tool-invocation', 'file', 'step-start']),
    text: z.string().optional(),
    toolInvocation: toolInvocationSchema.optional(),
    data: z.string().optional(),
    mimeType: z.string().optional(),
    reasoning: z.string().optional(),
    details: z.array(reasoningDetail).optional(),
});

export const messageSchema = z.object({
    id: z.string(),
    role: z.enum(['user', 'data', 'system', 'assistant']),
    content: z.string(),
    createdAt: z.date().optional(),
    parts: z.array(messagePartSchema).optional(),
    annotations: z.any().optional(),
    // TODO: add model that generated the message
});

export const chatSchema = z.object({
    user: zId('User'),
    name: z.string().min(1, 'Name is required'),
    pinned: z.boolean().default(false),
    messages: z.array(messageSchema).default([]),
});

export type TChat = z.infer<typeof chatSchema> & {
    _id: Types.ObjectId;
};

const schema = zodSchemaRaw(chatSchema);

const mongooseSchema = new mongoose.Schema(schema, { timestamps: true });

mongooseSchema.index({
    updatedAt: -1,
    user: 1,
});

mongooseSchema.index({
    'messages.content': 'text',
    'messages.parts.text': 'text',
    'messages.parts.toolInvocation.args': 'text',
    'messages.parts.toolInvocation.result': 'text',
});

export const Chat = mongoose.model('Chat', mongooseSchema);

/**
 * Deserializes an array of messages from the database format to the application format.
 * @param messages Messages list from the database
 * @returns Messages in the Vercel AI SDK format
 */
export function deserializeMessages(messages: z.infer<typeof messageSchema>[]): Message[] {
    // TODO: Implement deserialization logic for messages
    return messages as Message[];
}

/**
 * Serializes an array of messages from the application format to the database format.
 * @param messages Messages in the Vercel AI SDK format
 * @returns Messages in the database format
 */
export function serializeMessages(messages: Message[]): z.infer<typeof messageSchema>[] {
    return messages.map(
        (message): z.infer<typeof messageSchema> => ({
            id: message.id,
            role: message.role,
            content: message.content,
            createdAt: message.createdAt,
            parts: message?.parts?.map((part) => ({
                type: part.type,
                text: part.type === 'text' ? part.text : undefined,
                toolInvocation:
                    part.type === 'tool-invocation'
                        ? {
                              args: part.toolInvocation.args,
                              result: (part.toolInvocation as any).result,
                              state: part.toolInvocation.state,
                              toolCallId: part.toolInvocation.toolCallId,
                              toolName: part.toolInvocation.toolName,
                          }
                        : undefined,
                data: part.type === 'file' ? part.data : undefined,
                mimeType: part.type === 'file' ? part.mimeType : undefined,
                reasoning: part.type === 'reasoning' ? part.reasoning : undefined,
                details: part.type === 'reasoning' ? part.details : undefined,
            })),
            annotations: message.annotations,
        })
    );
}
