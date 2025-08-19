import { UseChatHelpers } from '@ai-sdk/react';
import { useMessages } from 'inflow/common/hooks/use-messages';
import { PreviewMessage } from './message';
import { ChatUIMessage } from 'inflow/ai/message';

interface MessagesProps {
    chatId: string;
    status: UseChatHelpers<ChatUIMessage>['status'];
    //votes: Array<Vote> | undefined;
    messages: ChatUIMessage[];
    setMessages: UseChatHelpers<ChatUIMessage>['setMessages'];
    regenerate: UseChatHelpers<ChatUIMessage>['regenerate'];
    isReadonly: boolean;
    isArtifactVisible: boolean;
}

export function Messages({
    chatId,
    status,
    messages,
    setMessages,
    regenerate,
    isReadonly,
    isArtifactVisible
}: MessagesProps) {

    const {
        containerRef: messagesContainerRef,
        endRef: messagesEndRef,
        onViewportEnter,
        onViewportLeave,
        hasSentMessage,
    } = useMessages({
        chatId,
        status,
    });
    // Render the messages component
    return (
       <div
            ref={messagesContainerRef}
            className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4 relative"
        >
            {messages.map((message, index) => (
                <PreviewMessage 
                    key={message.id}
                    chatId={chatId}
                    message={message}
                    isLoading={status === 'streaming' && messages.length - 1 === index}
                    setMessages={setMessages}
                    regenerate={regenerate}
                    isReadonly={isReadonly}
                    requiresScrollPadding={
                        hasSentMessage && index === messages.length - 1
                    }
                />
            ))}
        </div>
    );
}