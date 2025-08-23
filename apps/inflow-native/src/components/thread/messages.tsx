
import { UseChatHelpers } from '@ai-sdk/react';
import { BotUIMessage, ChatUIMessage, UserUIMessage } from '@inflow/ai/message';
import { FlatList, ScrollView, View } from 'react-native';
import { Ask } from './ask';
import { Respond } from './respond';
import { Orchestration } from './orchestration';

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

export default function Messages({
    chatId,
    status,
    messages,
    setMessages,
    regenerate,
    isReadonly,
    isArtifactVisible
}: MessagesProps) {

    const renderMessage = ({ message }: { message: ChatUIMessage }) => {
        const isLoading = status === 'streaming' && messages[messages.length - 1] === message;
        switch (message.role as any) {
            case 'user':
                return (
                    <Ask 
                        isLoading={isLoading}  
                        threadId={chatId} 
                        message={message as UserUIMessage}
                    />
                );
            case 'tool':
            case 'assistant':
                return (
                    <Respond 
                        isLoading={isLoading}  
                        threadId={chatId} 
                        message={message as BotUIMessage}
                    />
                );
        }
    }
    
    return (
        <FlatList
            className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4 relative"
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderMessage({ message: item })}
            contentContainerStyle={{ paddingBottom: 20, paddingLeft: 16, paddingRight: 16 }}
        />
    );
}