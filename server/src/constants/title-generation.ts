import { ModelId, ProviderId } from './providers';

// TODO: Allow user to override the model used for title generation
export const TITLE_GENERATION_PRIORITY: ModelId[] = [
    'groq:meta-llama/llama-4-scout-17b-16e-instruct',
    'google:gemma-3-12b-it',
    'openrouter:meta-llama/llama-4-scout:free',
    'openrouter:meta-llama/llama-4-scout', // In case the free version rate limit is hit
    'azure:meta/Llama-4-Scout-17B-16E-Instruct',
    'openai:gpt-4.1-nano',
    'anthropic:claude-3-5-haiku-20241022',
    // TODO: Add more models
];

export function getTitleGenerationModels(avaliableProviders: ProviderId[]): ModelId[] {
    const avaliableModels = TITLE_GENERATION_PRIORITY.filter((model) => {
        const [providerId] = model.split(':');
        return avaliableProviders.includes(providerId as ProviderId);
    });
    console.log('Available models for title generation:', avaliableModels);

    return avaliableModels;
}

export type PromptSet = {
    system?: string;
    user: string;
};

export function getGenerationPrompt(model: ModelId, firstMessage: string) {
    const [providerId] = model.split(':');

    const prompts: PromptSet = {
        system: `You are a chat title generator. Your job is to create concise, descriptive titles for conversations based on their content.
Requirements:

Generate titles that are 2-4 words long
Generate titles in the language of the first message
Focus on the main topic or purpose of the conversation
Use clear, specific language that helps users identify the chat later
Try to make the title as short as possible
Make the title descriptive and neutral (don't mention the user)
Avoid generic words like "chat", "conversation", "discussion" unless necessary
Prioritize the most important or unique aspect of the conversation
Use title case (capitalize major words)
Never use quotes, special characters, or punctuation except hyphens
If the conversation covers multiple topics, focus on the primary or most substantial one
Respond only with the title, nothing else
Do NOT use Markdown

Examples of good titles:

"Python Web Scraping Tutorial"
"Resume Writing Tips"
"React Component Design"
"Travel Plans for Italy"
"Debugging Memory Leaks"
"Cake Recipe Modifications"

Examples of poor titles:

"Help with coding" (too vague)
"Quick question about something" (not descriptive)
"Chat about various topics" (too generic)
"User asks about Python and then JavaScript" (too long)
"Poem Request for You" (mentions user)`,
        user: `Based on this conversation, create a 2-4 word title that would help the user easily identify this chat later. Focus on the specific topic, task, or question being discussed:
${firstMessage}`,
    };

    if (providerId === 'google') {
        prompts.user = `${prompts.system}\n\n${prompts.user}`;
        delete prompts.system; // Google Gemini expects only user prompt
    }

    return prompts;
}
