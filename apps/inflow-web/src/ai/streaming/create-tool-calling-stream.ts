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
import { handleStreamFinish } from './handle-stream-finish';
import { ChatUIMessage } from '../message';

export function createToolCallingStreamResponse(config: BaseStreamConfig) {
    const stream = createUIMessageStream<ChatUIMessage>({
        execute:  ({ writer }) => {
            const { messages, model, chatId, userId, searchMode } = config;

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

                const result = streamText({
                    ...researcherConfig,
                    onFinish: async result => {
                        await handleStreamFinish({
                            userId,
                            responseMessages: result.response.messages,
                            originalMessages: messages,
                            model,
                            threadId: chatId,
                            writer,
                            skipRelatedQuestions: isReasoningModel(model)
                        });
                    }
                });

                writer.merge(result.toUIMessageStream({sendReasoning: true}));

            } catch (error) {
                console.error('Stream execution error:', error);
                throw error;
            }
        },
        onError: (error) => {
            console.error('Stream error:', error);
            return 'Oops, an error occurred!';
        },
    });

    // return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
    return createUIMessageStreamResponse({ stream });
}