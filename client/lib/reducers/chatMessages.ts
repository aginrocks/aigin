import { Chat } from '@/app/(main)/chat/[id]/page';

export type ChatMessagesAction =
    | {
          type: 'ADD_MESSAGE';
          data: Chat['messages'];
      }
    | {
          type: 'ADD_LAST_MESSAGE_PART';
          data: Exclude<Chat['messages'][0]['parts'], undefined>[0];
      }
    | {
          type: 'APPEND_LAST_MESSAGE_PART_TEXT';
          data: string;
      }
    | {
          type: 'SET';
          data: Chat['messages'];
      }
    | {
          type: 'PREPEND';
          data: Chat['messages'];
      };

export function chatMessagesReducer(
    state: Chat['messages'],
    action: ChatMessagesAction
): Chat['messages'] {
    console.log({ state, action });
    if (action.type === 'SET') {
        return action.data;
    } else if (action.type === 'PREPEND') {
        return [...action.data, ...state];
    } else if (action.type === 'ADD_MESSAGE') {
        return [...state, ...action.data];
    } else if (action.type === 'ADD_LAST_MESSAGE_PART') {
        if (state.length === 0) return state;
        const lastMessage = state[state.length - 1];
        return [
            ...state.slice(0, -1),
            {
                ...lastMessage,
                parts: [...(lastMessage.parts || []), action.data],
            },
        ];
    } else if (action.type === 'APPEND_LAST_MESSAGE_PART_TEXT') {
        if (state.length === 0) {
            console.warn('No messages found for delta update:', action.data);
            return state;
        }

        const lastMessage = { ...state[state.length - 1] };
        const parts = [...(lastMessage.parts || [])];

        if (parts.length > 0 && parts[parts.length - 1].type === 'text') {
            // Update the last text part directly
            const lastPartIndex = parts.length - 1;
            const lastPart = parts[lastPartIndex];

            // Create a new copy of the last part with updated text
            parts[lastPartIndex] = {
                ...lastPart,
                type: 'text',
                text: ((lastPart as { text: string }).text || '') + action.data,
            };
        } else {
            // Add a new text part
            parts.push({ type: 'text', text: action.data });
        }

        return [
            ...state.slice(0, -1),
            {
                ...lastMessage,
                parts,
            },
        ];
    }

    return state;
}
