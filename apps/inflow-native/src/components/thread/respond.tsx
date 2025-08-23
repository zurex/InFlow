import { UseChatHelpers } from '@ai-sdk/react';
import { BotUIMessage, ChatUIMessage } from '@inflow/ai/message';
import { View, Text, StyleSheet } from 'react-native';
import { Orchestration } from './orchestration';
import Markdown from 'react-native-markdown-display';
import { sanitizeText } from 'inflow/lib/utils';


interface RespondProps {
    threadId: string;
    isLoading: boolean;
    //votes: Array<Vote> | undefined;
    message: BotUIMessage;
}

export function Respond({
    threadId,
    isLoading,
    message
}: RespondProps) {
    return (
        <View className="flex flex-col min-w-0 h-dvh">
            <Orchestration isLoading={isLoading} threadId={threadId} message={message}/>
            {message.parts.map((part, index) => {
                if (part.type === 'text') {
                    return (
                        <View key={index} className="p-4">
                            <Markdown style={styles}>
                                {sanitizeText(part.text)}
                            </Markdown> 
                        </View>
                    );
                }
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        paddingTop: 2,
        paddingBottom: 2
    }
});