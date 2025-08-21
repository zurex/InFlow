import crypto from 'crypto';
import { LanguageModelV2, LanguageModelV2Middleware, LanguageModelV2StreamPart } from '@ai-sdk/provider';
import { simulateReadableStream } from 'ai';
import { redis } from 'inflow/base/storage/redis';

type LLMGenerateResult = ReturnType<LanguageModelV2['doGenerate']>;
type LLMStreamResult = ReturnType<LanguageModelV2['doStream']>;

function generateKey(params: string) {
    return crypto.createHash('md5').update(params).digest("hex");
}

export const cacheMiddleware: LanguageModelV2Middleware = {
    wrapGenerate: async ({ doGenerate, params }) => {
        const cacheKey = generateKey(JSON.stringify(params));

        console.log('[CacheMiddleware] try to load generated from cache')
        const value = await redis.get<LLMGenerateResult>(cacheKey);
        if (value) {
            console.log('[CacheMiddleware] hit generate cache');
            return value;
        }

        const result = await doGenerate();

        redis.set(cacheKey, result);

        return result;
    },
    wrapStream: async ({ doStream, params }) => {
        const cacheKey = generateKey(JSON.stringify(params));

        console.log(`[CacheMiddleware] try to load stream from cache: ${cacheKey}`);
        const cached = await redis.get<LanguageModelV2StreamPart[]>(cacheKey);
        if (cached) {
            console.log('[CacheMiddleware] hit stream cache');
            // Format the timestamps in the cached response
            const formattedChunks = cached.map(p => {
                if (p.type === 'response-metadata' && p.timestamp) {
                    return { ...p, timestamp: new Date(p.timestamp) };
                } else return p;
            });
            return {
                stream: simulateReadableStream({
                    initialDelayInMs: 0,
                    chunkDelayInMs: 10,
                    chunks: formattedChunks,
                }),
            };
        }

        const { stream, ...rest} = await doStream();

        const fullResponse: LanguageModelV2StreamPart[] = [];

        const transformStream = new TransformStream<
            LanguageModelV2StreamPart,
            LanguageModelV2StreamPart
        >({
            transform(chunk, controller) {
                fullResponse.push(chunk);
                controller.enqueue(chunk);
            },
            flush() {
                // Store the full response in the cache after streaming is complete
                redis.set(cacheKey, fullResponse);
            },
        });

        return {
            stream: stream.pipeThrough(transformStream),
            ...rest,
        };
    },
};