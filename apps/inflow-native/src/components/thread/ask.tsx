import { UseChatHelpers } from '@ai-sdk/react';
import { ChatUIMessage, UserUIMessage } from '@inflow/ai/message';
import { View, Text } from 'react-native';

interface AskProps {
    threadId: string;
    isLoading: boolean;
    //votes: Array<Vote> | undefined;
    message: UserUIMessage;
}

export function Ask({
    threadId,
    isLoading,
    message
}: AskProps) {
    const ask = message.parts.find((part) => part.type === 'text').text || '';
    if (ask == '') {
        return null;
    }
    return (
        <View>
            <Text className="text-3xl mb-4 text-foreground">{ask}</Text>
        </View>
    )
}