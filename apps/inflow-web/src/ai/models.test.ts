import { simulateReadableStream } from 'ai';
import { MockLanguageModelV2 } from 'ai/test';
import { getResponseChunksByPrompt } from 'inflow/tests/prompts/utils';

export const mockChatModel = new MockLanguageModelV2({
    doGenerate: async () => ({
        rawCall: { rawPrompt: null, rawSettings: {} },
        finishReason: 'stop',
        usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
        content: [{ type: 'text', text: 'Hello, world!' }],
        warnings: [],
    }),
    doStream: async ({ prompt }) => ({
        stream: simulateReadableStream({
            chunkDelayInMs: 500,
            initialDelayInMs: 1000,
            chunks: getResponseChunksByPrompt(prompt),
        }),
        rawCall: { rawPrompt: null, rawSettings: {} },
    }),
});