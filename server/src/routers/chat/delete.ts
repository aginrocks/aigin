import { Chat } from '@models/chat';
import { withValidChatId } from './middlewares';
import { chatsStore, emitGlobalChatEvent } from '@ai/generation-manager';

export const deleteChat = withValidChatId.mutation(async ({ ctx, input }) => {
    const cachedChat = chatsStore.get(input.chatId);
    if (cachedChat) cachedChat.destroy();

    await Chat.findByIdAndDelete(input.chatId);

    emitGlobalChatEvent(ctx.user._id.toString(), 'chat:changed', input.chatId);

    return { success: true, message: 'Chat deleted successfully' };
});
