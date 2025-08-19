'use client';

import { useSearchParams } from 'next/navigation';
import { Messages } from './messages';
import { ThreadHeader } from './thread-header';
import { useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { fetchWithErrorHandlers, generateUUID } from 'inflow/lib/utils';
import { DefaultChatTransport } from 'ai';
import { MultimodalInput } from './multimodal-input';
import { Attachment } from 'inflow/ai/common';
import { ChatSDKError } from 'inflow/common/errors';
import { toast } from 'sonner';
import { ChatUIMessage } from 'inflow/ai/message';
import { useDataStream } from '../data-stream/data-stream-provider';

interface AskThreadProps {
    id: string;
    initialChatModel: string;
    initialMessages: ChatUIMessage[];
    isReadonly: boolean;
}

export function AskThread({
    id,
    initialChatModel,
    initialMessages = [],
    isReadonly = false,
}: AskThreadProps) {

    const [input, setInput] = useState<string>('');
    const [attachments, setAttachments] = useState<Array<Attachment>>([]);

    const { setDataStream } = useDataStream();
    const visibilityType = 'private'; // Assuming visibilityType is always private for this component

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
            api: '/api/chat',
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
            setDataStream((ds) => (ds ? [...ds, dataPart] : []));
        },
        onError: (error) => {
            if (error instanceof ChatSDKError) {
                toast.error(error.message);
            }
        },
    });

    const searchParams = useSearchParams();
    const query = searchParams.get('query');
    const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

    useEffect(() => {
        if (query && !hasAppendedQuery) {
            sendMessage({
                role: 'user' as const,
                parts: [{ type: 'text', text: query }],
            });

            setHasAppendedQuery(true);
            window.history.replaceState({}, '', `/chat/${id}`);
        }
    }, [query, sendMessage, hasAppendedQuery, id]);
    
    return (
        <>
            <div className="flex flex-col min-w-0 h-dvh bg-background">
                <ThreadHeader />
                <Messages
                    chatId={id}
                    status={status}
                    messages={messages}
                    setMessages={setMessages}
                    regenerate={regenerate}
                    isReadonly={isReadonly}
                    isArtifactVisible={false}
                />

                <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
                    {!isReadonly && (
                        <MultimodalInput
                            chatId={id}
                            input={input}
                            setInput={setInput}
                            status={status}
                            stop={stop}
                            attachments={attachments}
                            setAttachments={setAttachments}
                            messages={messages}
                            setMessages={setMessages}
                            sendMessage={sendMessage}
                            //selectedVisibilityType={visibilityType}
                        />
                    )}
                </form>
            </div>
        </>
    )
}