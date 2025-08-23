import { useRouter } from 'expo-router';
import { Endpoint } from 'inflow/common/constants';
import { fetchWithErrorHandlers, generateUUID } from 'inflow/lib/utils';
import { useSuggestedStore } from 'inflow/store/suggested-store';
import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';

export function Greeting() {
    return (
        <View className="max-w-3xl mx-auto md:mt-20 w-full px-8 flex flex-1 flex-col justify-center">
            <Text className="text-3xl font-semibold">你好你好！</Text>
            <Text className='text-3xl text-zinc-500'>有什么能帮忙的吗？</Text>
            <View className='min-h-20'></View>
        </View>
    )
}



export function SuggestedActions() {
    const router = useRouter();
    const { actions, fetchActions } = useSuggestedStore();

    const takeAction = (question: string) => {
        const id = generateUUID();
        router.navigate(`/thread/${id}?query=${encodeURIComponent(question)}`);
    }

    useEffect(()=> {
        fetchActions();
    }, [fetchActions]);

    return (
        <View className="grid sm:grid-cols-2 gap-2 w-full">
            {actions.map((suggestedAction, index) => (
                <View 
                    className={index > 1 ? 'hidden sm:block' : 'block'}
                    key={`suggested-action-${suggestedAction.title}-${index}`}
                >
                    <Pressable onPress={()=>takeAction(suggestedAction.action)}>
                        <View 
                            className='border rounded-xl px-4 py-3.5 flex-row gap-1' 
                            style={{borderColor: '#e5e7eb'}}
                        >
                            <Text className="font-medium">{suggestedAction.title}</Text>
                            <Text className="text-muted-foreground">{suggestedAction.label}</Text>
                        </View>
                    </Pressable>
                </View>
            ))}
        </View>
    )
}