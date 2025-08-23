import { 
    AssistantModelMessage, 
    ModelMessage, 
    ToolModelMessage, 
    UIMessageStreamWriter 
} from 'ai';
import { ChatUIMessage } from '../message';
import { ChatMessage, Thread } from '@prisma/client';
import { threadService } from 'inflow/server/services/thread-service';

type ResponseMessage = AssistantModelMessage | ToolModelMessage;

interface HandleStreamFinishParams {
    userId: string;
    responseMessages: ResponseMessage[];
    originalMessages: ChatUIMessage[];
    model: string;
    thread: Thread;
    writer: UIMessageStreamWriter<ChatUIMessage>;
    skipRelatedQuestions?: boolean
    //annotations?: ExtendedCoreMessage[]
}

interface HandleResponseFinishParams {
    thread: Thread;
    messages: ChatUIMessage[];
    responseMessage: ChatUIMessage;
}

export async function handleResponseFinish({
    thread,
    messages,
    responseMessage,
} : HandleResponseFinishParams) {
    // Persits first response as preview of the whole thread
    if (responseMessage.role === 'assistant' && !thread.preview) {
        thread.preview = responseMessage.parts as any;
        threadService.saveThread(thread);
    }
    // Persist response messages
    for (const message of messages) {
        await threadService.saveMessage(thread.id, message);
    }
}