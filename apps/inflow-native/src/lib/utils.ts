import { fetch as expoFetch } from 'expo/fetch';
import { clsx, type ClassValue } from "clsx"
import { ChatSDKError, ErrorCode } from "inflow/common/errors"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function sanitizeText(text: string) {
    return text.replace('<has_function_call>', '');
}

export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export async function fetchWithErrorHandlers(
    input: RequestInfo | URL,
    init?: RequestInit,
) {
    const localFetch = expoFetch as unknown as typeof globalThis.fetch;
    try {
        console.log('Fetch request to:', input, init);
        const response = await localFetch(input, init);

        if (!response.ok) {
            const { code, cause } = await response.json();
            console.error('Fetch error:', code, cause);
            throw new ChatSDKError(code as ErrorCode, cause);
        }

        return response;
    } catch (error: unknown) {
        console.error('Fetch error:', error);
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            throw new ChatSDKError('offline:chat');
        }

        throw error;
    }
}
