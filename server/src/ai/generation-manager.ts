import { StreamTextResult, ToolSet } from 'ai';

type Chat = StreamTextResult<ToolSet, never>;

const chatsStore: Map<string, Chat> = new Map();

async function generateMessage() {}
