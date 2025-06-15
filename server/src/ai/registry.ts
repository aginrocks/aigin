import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAzure } from '@quail-ai/azure-ai-provider';
import { createXai } from '@ai-sdk/xai';
import { createProviderRegistry, wrapLanguageModel } from 'ai';
import { TUser } from '@models/user';
import { ProviderV1 } from '@ai-sdk/provider';
import { PROVIDER_IDS } from '@constants/providers';
import { createOpenAI } from '@ai-sdk/openai';
import { createGroq } from '@ai-sdk/groq';
import { fixEmptyParts, fixOpenAIToolCalls } from './sdk-middlewars';

export const getUserRegistry = (user: TUser) => {
    const { anthropic, google, groq, azure, xai, deepseek, openai, openrouter } = user.providers;

    const providers: Record<(typeof PROVIDER_IDS)[number] | string, ProviderV1> = {};

    if (anthropic.enabled && anthropic.apiKey) {
        providers.anthropic = createAnthropic({
            apiKey: anthropic.apiKey,
        });
    }
    if (google.enabled && google.apiKey) {
        providers.google = createGoogleGenerativeAI({
            apiKey: google.apiKey,
        });
    }
    if (groq.enabled && groq.apiKey) {
        providers.groq = createGroq({
            apiKey: groq.apiKey,
        });
    }
    if (azure.enabled && azure.apiKey) {
        providers.azure = createAzure({
            apiKey: azure.apiKey,
            endpoint: 'https://models.github.ai/inference',
        });
    }
    if (xai.enabled && xai.apiKey) {
        providers.xai = createXai({
            apiKey: xai.apiKey,
        });
    }
    if (deepseek.enabled && deepseek.apiKey) {
        providers.deepseek = createXai({
            apiKey: deepseek.apiKey,
        });
    }
    if (openai.enabled && openai.apiKey) {
        providers.openai = createOpenAI({
            apiKey: openai.apiKey,
            compatibility: 'strict',
        });
    }
    if (openrouter.enabled && openrouter.apiKey) {
        providers.openrouter = createOpenAI({
            apiKey: openrouter.apiKey,
            baseURL: 'https://openrouter.ai/api/v1',
        });
    }

    return createProviderRegistry(providers);
};

export const wrapModel = (model: `${string}:${string}`, user: TUser) => {
    const [provider, modelName] = model.split(':');
    const registry = getUserRegistry(user);

    if (provider === 'anthropic' || provider === 'google') {
        return wrapLanguageModel({
            model: registry.languageModel(model),
            middleware: fixEmptyParts,
        });
    } else if (
        provider === 'openai' ||
        (provider === 'openrouter' && modelName.startsWith('openai/'))
    ) {
        return wrapLanguageModel({
            model: registry.languageModel(model),
            middleware: fixOpenAIToolCalls,
        });
    }

    return registry.languageModel(model);
};
