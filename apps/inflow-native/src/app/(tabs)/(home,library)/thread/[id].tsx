import { useLocalSearchParams, useRouter } from "expo-router";

import Thread from "inflow/components/thread/thread";
import React from "react";
import { SafeAreaView, Text} from "react-native";

export default function ThreadPage() {
    const router = useRouter();
    const { id, query } = useLocalSearchParams();
    
    return (
        <Thread 
            id={id as string}
            query={query as string}
            initialChatModel='chat-model'
            initialMessages={[]}
            isReadonly={false}
        />
    );
}