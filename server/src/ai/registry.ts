import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAzure } from '@ai-sdk/azure';
import { createXai } from '@ai-sdk/xai';
import { createProviderRegistry, streamText } from 'ai';
import { TUser } from '@models/user';
import { ProviderV1 } from '@ai-sdk/provider';
import { PROVIDER_IDS } from '@constants/providers';

export const getUserRegistry = (user: TUser) => {
    const { anthropic, google, groq, azure, xai, deepseek } = user.providers;

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
        providers.groq = createGoogleGenerativeAI({
            apiKey: groq.apiKey,
        });
    }
    if (azure.enabled && azure.apiKey) {
        providers.azure = createAzure({
            apiKey: azure.apiKey,
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

    return createProviderRegistry(providers);
};
