import { UseChatHelpers } from '@ai-sdk/react';
import { ChatUIMessage } from 'inflow/ai/message';
import { useScrollToBottom } from './use-scroll-to-bottom';
import { useEffect, useState } from 'react';

export function useMessages({
    chatId,
    status,
}: {
    chatId: string;
    status: UseChatHelpers<ChatUIMessage>['status'];
}) {
    const {
        containerRef,
        endRef,
        isAtBottom,
        scrollToBottom,
        onViewportEnter,
        onViewportLeave,
    } = useScrollToBottom();

    const [hasSentMessage, setHasSentMessage] = useState(false);

    useEffect(() => {
        if (chatId) {
            scrollToBottom('instant');
            setHasSentMessage(false);
        }
    }, [chatId, scrollToBottom]);

    useEffect(() => {
        if (status === 'submitted') {
            setHasSentMessage(true);
        }
    }, [status]);

    return {
        containerRef,
        endRef,
        isAtBottom,
        scrollToBottom,
        onViewportEnter,
        onViewportLeave,
        hasSentMessage,
    };
}