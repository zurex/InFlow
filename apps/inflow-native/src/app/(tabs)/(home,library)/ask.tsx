import { Button, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Link, useRouter } from "expo-router";
import { create } from 'zustand';
import { generateId } from 'ai';
import { generateUUID } from "inflow/lib/utils";
import { Suggestion, useSuggestedStore } from "inflow/store/suggested-store";

interface AskStore {
    question: string;
    setQuestion: (question: string) => void;
    clearQuestion: () => void;
}

const useAskStore = create<AskStore>((set) => ({
    question: '',
    setQuestion: (question:string) => set({ question }),
    clearQuestion: () => set({ question: '' }),
}));

export default function AskPage() {
    
    return (
        <SafeAreaView className="flex flex-1" >
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex flex-1 justify-between">
                <AskPanel />
                <AskTools />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

function AskPanel() {
    const { top } = useSafeAreaInsets();
    const padding = Math.min(top / 2, 20);
    return (
        <View className="px-4 lg:px-6 h-48 flex flex-col" style={{ paddingTop: padding}}>
            <CloseAsk />
            <AskInput />
        </View>
    );
}

function CloseAsk() {
    const router = useRouter();
    return (
        <Pressable className="font-bold flex items-start justify-center mb-6" onPress={() => {router.dismiss()}}>
            <View className=" bg-gray-200" style={{borderRadius: 16 }}>
                <Ionicons name="close-outline" size={32} color="black" />
            </View>
        </Pressable>
    );
}

function AskInput() {
    const { setQuestion, question } = useAskStore();
    
    return (
        <View className="flex shrink-0 min-h-32">
            <TextInput 
                autoFocus
                multiline
                numberOfLines={4}
                value={question}
                onChangeText={setQuestion}
                className="w-full text-3xl/10 border-b border-gray-300 pb-2"
                placeholder="随意提问 随意探索"/>
            <SuggestedActions />
        </View>
    );
}

function SuggestedActions() {
    const { actions } = useSuggestedStore();

    const renderAction = (suggestion: Suggestion, idx: number) => {
        const id = generateUUID();
        const address = `/thread/${id}?query=${encodeURIComponent(suggestion.action)}`;
        return (
            <View className="pt-4">
                <Link href={address}>
                    <View className="flex-row items-center gap-2">
                        <Ionicons 
                            name='arrow-forward-outline'
                            size={18}
                            color={"#71717a"}
                        />
                        <Text className="text-zinc-500 text-lg">
                            {suggestion.title} {suggestion.label}
                        </Text>
                    </View>
                </Link>
            </View>
        )
    }

    return (
        <View>
            {actions.map(renderAction)}
        </View>
    )
}

function AskTools() {
    const { top } = useSafeAreaInsets();
    const { question, clearQuestion } = useAskStore();
    const id = generateUUID();
    const router = useRouter();

    const handleSubmit = () => {
        if (question.trim() === '') return;
        // Here you would typically handle the question submission, e.g., send it to a server or process it.
        console.log(`Question submitted: ${question}`);
        clearQuestion();
        router.dismiss();
        router.navigate(`/thread/${id}?query=${encodeURIComponent(question)}`);
    };
    return (
        <View className="flex flex-row justify-end gap-4 mt-4" style={{marginBottom: top + 15}}>
            <Button title="清除" onPress={clearQuestion} />
            <Button title="发送" onPress={handleSubmit} />
        </View>
    );
}
