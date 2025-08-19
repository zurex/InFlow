import { ModelMessage, UIMessagePart } from 'ai';
import { Model } from './registry';
import { ChatMessage } from '@prisma/client';
import { ChatTools, UIDataTypes } from './common';
import { formatISO } from 'date-fns';
import { ChatUIMessage } from './message';

/**
 * Sanitizes a URL by replacing spaces with '%20'
 * @param url - The URL to sanitize
 * @returns The sanitized URL
 */
export function sanitizeUrl(url: string): string {
    return url.replace(/\s+/g, '%20')
}

const DEFAULT_CONTEXT_WINDOW = 128_000;
const DEFAULT_RESERVE_TOKENS = 30_000;

export function getMaxAllowedTokens(model: string): number {
    let contextWindow: number
    let reserveTokens: number

    if (model.includes('deepseek')) {
        contextWindow = 64_000
        reserveTokens = 27_000
    } else if (model.includes('claude')) {
        contextWindow = 200_000
        reserveTokens = 40_000
    } else {
        contextWindow = DEFAULT_CONTEXT_WINDOW
        reserveTokens = DEFAULT_RESERVE_TOKENS
    }

    return contextWindow - reserveTokens
}

export function truncateMessages(
    messages: ModelMessage[],
    maxTokens: number
): ModelMessage[] {
    let totalTokens = 0
    const tempMessages: ModelMessage[] = []

    for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i]
        const messageTokens = message.content?.length || 0

        if (totalTokens + messageTokens <= maxTokens) {
            tempMessages.push(message)
            totalTokens += messageTokens
        } else {
            break
        }
    }

    const orderedMessages = tempMessages.reverse()

    while (orderedMessages.length > 0 && orderedMessages[0].role !== 'user') {
        orderedMessages.shift()
    }

    return orderedMessages
}

export function convertToUIMessages(messages: ChatMessage[]): ChatUIMessage[] {
    return messages.map((message) => ({
        id: message.id,
        role: message.role as 'user' | 'assistant' | 'system',
        parts: message.parts as UIMessagePart<UIDataTypes, ChatTools>[],
        metadata: {
            createdAt: formatISO(message.createdAt),
        },
    }));
}