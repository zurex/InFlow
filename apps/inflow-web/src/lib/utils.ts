import { clsx, type ClassValue } from "clsx"
import { ChatSDKError, ErrorCode } from "inflow/common/errors";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function sanitizeText(text: string) {
    return text.replace('<has_function_call>', '');
}

export async function fetchWithErrorHandlers(
    input: RequestInfo | URL,
    init?: RequestInit,
) {
    try {
        const response = await fetch(input, init);

        if (!response.ok) {
            const { code, cause } = await response.json();
            throw new ChatSDKError(code as ErrorCode, cause);
        }

        return response;
    } catch (error: unknown) {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            throw new ChatSDKError('offline:chat');
        }

        throw error;
    }
}
