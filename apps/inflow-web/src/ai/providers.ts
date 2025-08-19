import { createOpenAI } from '@ai-sdk/openai';
import { customProvider } from 'ai';
import { environment } from 'inflow/common/environment';
import { mockChatModel } from './models.test';

const openai = createOpenAI({
    apiKey: process.env.OPENAI_COMPATIBLE_API_KEY,
    baseURL: process.env.OPENAI_COMPATIBLE_API_BASE_URL
});

export const modelProvider = environment.isDevelopment
    ? customProvider({
        languageModels: {
            'chat-model': openai.chat('gpt-4o-mini')
        }
    })
    : customProvider({
        languageModels: {
            'chat-model': openai.chat('gpt-4o-mini'),
        }
    });