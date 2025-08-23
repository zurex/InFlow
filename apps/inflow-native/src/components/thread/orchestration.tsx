import { BotUIMessage, ToolUIMessage } from '@inflow/ai/message';
import { View, Text, Pressable } from 'react-native';
import { ReactNode, useEffect, useState } from 'react';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { 
    OrchestrationStep, 
    Reference, SearchStep, 
    useOrchestrationStore, 
    useThreadStore 
} from 'inflow/store/thread-store';

interface OrchestrationProps {
    threadId: string;
    isLoading: boolean;
    message: BotUIMessage;
}

export function Orchestration({
    message,
}: OrchestrationProps) {
    const stepParts = message.parts.filter((part)=>part.type!='text');

    const { setSteps, setReferences } = useOrchestrationStore();
    useEffect(() => {
        const references: Reference[] = [];
        const steps: OrchestrationStep[] = [];

        stepParts.forEach((part) => {
            if (part.type == 'tool-search') {
                const sources: Reference[] = part.output?.results.map((item) => {
                    const {title, url, content} = item;
                    const address = new URL(url);
                    const parts = address.hostname.split('.').reverse();
                    const source = {
                        title, url, content,
                        icon: `${address.protocol}//${address.host}/favicon.ico`,
                        domain: parts.length > 1 ? parts[1] : parts[0]
                    };
                    references.push(source);
                    return source;
                }) || [];

                const searchStep: SearchStep = {
                    type: 'search',
                    query: part.input?.query,
                    sources
                };
                steps.push(searchStep);
            }
        });

        setSteps(steps);
        setReferences(references);

    }, [message])

    return (
        <View className='flex-row gap-3'>
            <StepsBadge />
            <ReferencesBadge />
        </View>
    )
}

function StepsBadge() {
    const { displaySteps } = useThreadStore();
    return (
        <Badge onPress={()=>displaySteps()}>
            <View className='flex-row items-center'>
                <Ionicons name='sparkles-sharp' />
                <Text>思考步骤</Text>
            </View>
        </Badge>
    )
}

function ReferencesBadge() {
    return (
        <Badge onPress={() => {}}>
            <Text>来源</Text>
        </Badge>
    )
}

interface BadgeProps {
    children: ReactNode;
    onPress: () => void;
}

function Badge({
    children,
    onPress
} : BadgeProps) {
    return (
        <Pressable onPress={onPress}>
            <View className='bg-pale-yellow-300 p-2 pl-4 pr-4 rounded-full' style={{backgroundColor: '#ece6e7'}}>
                {children}
            </View>
        </Pressable>
    )
}