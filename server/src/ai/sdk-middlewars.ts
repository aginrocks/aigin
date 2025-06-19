import type { LanguageModelV1Middleware } from 'ai';

/**
 * Removes empty text parts from messages (vercel sdk is weird)
 */
export const fixEmptyParts: LanguageModelV1Middleware = {
    transformParams: async ({ params }) => {
        // console.log('A_PARAMS', params);
        // @ts-expect-error fuck vercel
        params.prompt = params.prompt
            .map((message) => ({
                ...message,
                content:
                    typeof message.content === 'string'
                        ? message.content
                        : message.content.filter((part) =>
                              part.type === 'text' ? part.text.length !== 0 : true
                          ),
            }))
            .filter((message) => message.content.length > 0);
        return params;
    },
};

/**
 * Makes every parameter required because for some reason OpenAI requires that (wtf).
 */
export const fixOpenAIToolCalls: LanguageModelV1Middleware = {
    transformParams: async ({ params }) => {
        // console.log('O_PARAMS', params);
        if (params.mode.type === 'regular')
            params.mode.tools = params.mode.tools?.map((t) => {
                // @ts-expect-error someone fucked up types
                const paramsList = Object.keys(t.parameters?.properties);
                return {
                    ...t,
                    parameters: {
                        // @ts-expect-error someone fucked up types
                        ...t.parameters,
                        required: paramsList,
                    },
                };
            });
        return params;
    },
};
