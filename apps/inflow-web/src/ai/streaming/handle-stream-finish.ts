import { ModelMessage, UIMessageStreamWriter } from 'ai';
import { ChatUIMessage } from '../message';

interface HandleStreamFinishParams {
    userId: string;
    responseMessages: ModelMessage[]
    originalMessages: ChatUIMessage[];
    model: string;
    chatId: string;
    writer: UIMessageStreamWriter<ChatUIMessage>;
    skipRelatedQuestions?: boolean
    //annotations?: ExtendedCoreMessage[]
}

export async function handleStreamFinish({
    responseMessages,
}: HandleStreamFinishParams) {
    console.log('Stream finished with result:', JSON.stringify(responseMessages));
}