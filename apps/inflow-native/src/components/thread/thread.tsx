import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { ChatUIMessage } from '@inflow/ai/message';
import { useChat} from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fetchWithErrorHandlers, generateUUID } from 'inflow/lib/utils';
import { ChatSDKError } from 'inflow/common/errors';
import Messages from './messages';
import { Attachment } from '@inflow/ai/common';
import { View, Text, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThreadStore } from './thread-store';
import { StepDetails } from './step-details';

interface ThreadProps {
    id: string;
    initialChatModel: string;
    initialMessages: ChatUIMessage[];
    isReadonly: boolean;
    query?: string;
}

export default function Thread({
    id,
    query,
    initialChatModel,
    initialMessages = [],
    isReadonly = false,
}: ThreadProps) {

    const visibilityType = 'private';
    const { top } = useSafeAreaInsets();
    //const [input, setInput] = useState<string>('');
    //const [attachments, setAttachments] = useState<Array<Attachment>>([]);

    const {
        messages,
        setMessages,
        sendMessage,
        status,
        stop,
        regenerate,
        resumeStream,
    } = useChat<ChatUIMessage>({
        id,
        messages: initialMessages,
        experimental_throttle: 100,
        generateId: generateUUID,
        transport: new DefaultChatTransport({
            api: 'http://192.168.31.139:3000/api/chat',
            fetch: fetchWithErrorHandlers,
            prepareSendMessagesRequest({ messages, id, body }) {
                return {
                    body: {
                        id,
                        message: messages.at(-1),
                        selectedChatModel: initialChatModel,
                        selectedVisibilityType: visibilityType,
                        ...body,
                    },
                };
            },
        }),
        onData: (dataPart) => {
            //setDataStream((ds) => (ds ? [...ds, dataPart] : []));
        },
        onError: (error) => {
            console.error('Chat error:', error);
            if (error instanceof ChatSDKError) {
                toast.error(error.message);
            }
        },
    });

    const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

    // ref
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { showSteps, dismissSteps } = useThreadStore();

    useEffect(()=>{
        if (showSteps) {
            bottomSheetModalRef.current.present();
        } else {
            bottomSheetModalRef.current.dismiss();
        }
    }, [showSteps])

    useEffect(() => {
        if (query && !hasAppendedQuery) {
            console.log(`Appending query to thread ${id}: ${query}`);
            sendMessage({
                role: 'user' as const,
                parts: [{ type: 'text', text: query }],
            });

            setHasAppendedQuery(true);
            //window.history.replaceState({}, '', `/chat/${id}`);
        }
    }, [query, sendMessage, hasAppendedQuery, id]);

    return (
        <GestureHandlerRootView className="flex-1" style={{backgroundColor: '#FCFCF9'}}>
            <BottomSheetModalProvider>
                <View className="flex flex-1 flex-col min-w-0 h-dvh" style={{paddingTop: top}}>
                    <Messages
                        chatId={id}
                        status={status}
                        messages={messages}
                        setMessages={setMessages}
                        regenerate={regenerate}
                        isReadonly={isReadonly}
                        isArtifactVisible={false}
                    />
                </View>
                <BottomSheetModal 
                    ref={bottomSheetModalRef} 
                    onDismiss={dismissSteps}
                    backdropComponent={(props) => <BottomSheetBackdrop {...props} opacity={0.1}/>}
                >
                    <BottomSheetView className='pb-20 pl-4 pr-4'>
                        <StepDetails />
                    </BottomSheetView>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}