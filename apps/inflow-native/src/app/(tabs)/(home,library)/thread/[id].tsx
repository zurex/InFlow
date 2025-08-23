import { useLocalSearchParams, useRouter } from "expo-router";
import Thread from "inflow/components/thread/thread";
import ThreadSkeleton from "inflow/components/thread/thread-skeleton";
import { useThreadStore } from "inflow/store/thread-store";
import { useThreadsStore } from "inflow/store/threads-store";
import React, { useEffect, useState } from "react";
import { SafeAreaView, Text} from "react-native";

export default function ThreadPage() {
    const router = useRouter();
    const { id, query } = useLocalSearchParams();
    const threadId = id as string;
    const { fetchThread } = useThreadsStore();
    const thread = useThreadsStore(state=>state.data[threadId]);
    const { stepsShown, dismissSteps } = useThreadStore();

    useEffect(() => {
        if (stepsShown) {
            // Dissmiss step details at first time
            dismissSteps();
        }
    });

    useEffect(() => {
        console.log(`[ThreadPage] Fetch thread details <id=${threadId}>`);
        fetchThread(threadId);
    }, [fetchThread]);

    // We dont have any cache and it's not the first chat of thread (no query provide)
    const isLoading = !query && !thread.messages;

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1">
                <ThreadSkeleton />
            </SafeAreaView>
        )
    }
    
    return (
        <Thread 
            id={threadId}
            query={query as string}
            initialChatModel='chat-model'
            initialMessages={thread?.messages || []}
            isReadonly={false}
        />
    );
}