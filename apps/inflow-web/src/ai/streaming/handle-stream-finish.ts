import { 
    AssistantModelMessage, 
    ModelMessage, 
    ToolModelMessage, 
    UIMessageStreamWriter 
} from 'ai';
import { ChatUIMessage } from '../message';
import { ChatMessage } from '@prisma/client';
import { threadService } from 'inflow/server/services/thread-service';

type ResponseMessage = AssistantModelMessage | ToolModelMessage;

interface HandleStreamFinishParams {
    userId: string;
    responseMessages: ResponseMessage[];
    originalMessages: ChatUIMessage[];
    model: string;
    threadId: string;
    writer: UIMessageStreamWriter<ChatUIMessage>;
    skipRelatedQuestions?: boolean
    //annotations?: ExtendedCoreMessage[]
}

export async function handleStreamFinish({
    threadId,
    responseMessages,
}: HandleStreamFinishParams) {
    // Persist response messages
    for (const message of responseMessages) {
        await threadService.saveMessage(threadId, message);
    }
}