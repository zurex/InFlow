import { deepseek } from '@ai-sdk/deepseek';
import { createOpenAI } from '@ai-sdk/openai';
import { createProviderRegistry, LanguageModel } from 'ai';

const providers = {
    deepseek,
    'openai-compatible': createOpenAI({
        apiKey: process.env.OPENAI_COMPATIBLE_API_KEY,
        baseURL: process.env.OPENAI_COMPATIBLE_API_BASE_URL
    }),
}

export const modelRegistry = createProviderRegistry({
    deepseek,
    'openai-compatible': createOpenAI({
        apiKey: process.env.OPENAI_COMPATIBLE_API_KEY,
        baseURL: process.env.OPENAI_COMPATIBLE_API_BASE_URL
    }),
});

export type ModelProvider = keyof typeof providers;
export type ModelName = `${ModelProvider}:${string}`;

export interface Model {
    id: string
    name: string
    provider: string
    providerId: ModelProvider;
    enabled: boolean
    toolCallType: 'native' | 'manual'
    toolCallModel?: string
}

export function getModel(model: ModelName): LanguageModel {
    const [provider, ...modelNameParts] = model.split(':') ?? [];

    return modelRegistry.languageModel(model);
}

export function isReasoningModel(model: string): boolean {
    if (typeof model !== 'string') {
        return false
    }
    return (
        model.includes('deepseek-r1') ||
        model.includes('deepseek-reasoner') ||
        model.includes('o3-mini')
    )
}
