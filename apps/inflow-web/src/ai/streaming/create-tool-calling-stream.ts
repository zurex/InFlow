import { 
    convertToModelMessages, 
    createUIMessageStream, 
    createUIMessageStreamResponse, 
    JsonToSseTransformStream, 
    streamText 
} from 'ai';
import { BaseStreamConfig } from './stream-common';
import { researcher } from '../agents/researcher';
import { getMaxAllowedTokens, truncateMessages } from '../utils';
import { isReasoningModel } from '../registry';
import { handleResponseFinish } from './handle-stream-finish';
import { ChatUIMessage } from '../message';
import { Thread } from '@prisma/client';

export function createToolCallingStreamResponse(
    thread: Thread, config: BaseStreamConfig
) {
    const { messages, model, chatId, userId, searchMode } = config;

    const stream = createUIMessageStream<ChatUIMessage>({
        execute:  ({ writer }) => {

            try {
                const modelMessages = convertToModelMessages(messages);
                const truncatedMessages = truncateMessages(
                    modelMessages,
                    getMaxAllowedTokens(model)
                );

                console.log('Truncated messages:', JSON.stringify(truncatedMessages, null, 2));

                const researcherConfig = researcher({
                    messages: truncatedMessages,
                    model,
                    searchMode
                });

                const result = streamText(researcherConfig);

                writer.merge(result.toUIMessageStream({sendReasoning: true}));

            } catch (error) {
                console.error('Stream execution error:', error);
                throw error;
            }
        },
        onFinish: async ({ messages, responseMessage }) => {
            console.log('responseMessage:', responseMessage);
            await handleResponseFinish({
                thread,
                messages,
                responseMessage
            });
        },
        onError: (error) => {
            console.error('Stream error:', error);
            return 'Oops, an error occurred!';
        },
    });

    // return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
    return createUIMessageStreamResponse({ stream });
}