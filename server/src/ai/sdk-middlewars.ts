import type { LanguageModelV1Middleware } from 'ai';

export const fixAnthropicToolCalls: LanguageModelV1Middleware = {
    transformParams: async ({ params }) => {
        console.log('A_PARAMS', params);
        // @ts-expect-error fuck vercel
        params.prompt = params.prompt.map((message) => ({
            ...message,
            content:
                typeof message.content === 'string'
                    ? message.content
                    : message.content.filter((part) =>
                          part.type === 'text' ? part.text.length !== 0 : true
                      ),
        }));
        return params;
    },
};
