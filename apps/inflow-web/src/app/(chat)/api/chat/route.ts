import { convertToUIMessages } from 'inflow/ai/utils';
import { auth } from 'inflow/app/(auth)/auth';
import { threadService } from 'inflow/server/services/thread-service';
import { cookies } from 'next/headers';
import { ChatPostRequestBody, PostRequestBodySchema } from './chat-schema';
import { ChatSDKError } from 'inflow/common/errors';
import { ChatUIMessage } from 'inflow/ai/message';
import { createToolCallingStreamResponse } from 'inflow/ai/streaming/create-tool-calling-stream';
import { Model, ModelName } from 'inflow/ai/registry';
import { ChatModel } from 'inflow/ai/models';

export async function GET(req: Request) {
    return new Response('chat works');
}

export async function POST(request: Request) {

    let requestBody: ChatPostRequestBody;

    try {
        const json = await request.json();
        requestBody = PostRequestBodySchema.parse(json);
    } catch (_) {
        return new ChatSDKError('bad_request:api').toResponse();
    }

    try {
        const user = await auth({ allowAnonymous: true });
        if (!user) {
            console.error('Unauthorized access to chat API');
            return new ChatSDKError('unauthorized:api').toResponse();
        }

        const { 
            message, 
            id: threadId,
            selectedChatModel
        }: {
            id: string;
            message: ChatUIMessage;
            selectedChatModel: ChatModel['id']
        } = requestBody;
        const referer = request.headers.get('referer')

        const isSharePage = referer?.includes('/share/');
        if (isSharePage) {
            return new Response('Chat API is not available on share pages', {
                status: 403,
                statusText: 'Forbidden'
            });
        }

        const cookieStore = await cookies();
        const searchMode = true;// cookieStore.get('search-mode')?.value === 'true';
        
        const messagesFromDb = await threadService.getMessages(threadId);
        const uiMessages = [...convertToUIMessages(messagesFromDb), message];

        return createToolCallingStreamResponse({
            userId: user.id,
            messages: uiMessages,
            model: selectedChatModel,
            chatId: threadId,
            searchMode,
        });
    }
    catch (error) {
        console.error('Error in chat route:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}