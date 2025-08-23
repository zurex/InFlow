import { Endpoint } from 'inflow/common/constants';
import { fetchWithErrorHandlers } from 'inflow/lib/utils';
import { create } from 'zustand';

const defaultActions = [
    {
        title: 'What are the advantages',
        label: 'of using Next.js?',
        action: 'What are the advantages of using Next.js?',
    },
    {
        title: 'Write code to',
        label: `demonstrate djikstra's algorithm`,
        action: `Write code to demonstrate djikstra's algorithm`,
    },
    {
        title: 'Help me write an essay',
        label: `about silicon valley`,
        action: `Help me write an essay about silicon valley`,
    },
    {
        title: 'What is the weather',
        label: 'in San Francisco?',
        action: 'What is the weather in San Francisco?',
    },
];

export interface Suggestion {
    title: string;
    label: string;
    action: string;
}

interface SuggestedStore {
    loading: boolean;
    actions: Suggestion[];
    fetchActions: () => void;
}

export const useSuggestedStore = create<SuggestedStore>((set, get) => ({
    loading: false,
    actions: defaultActions,
    fetchActions: () => {
        const loading = get().loading;
        if (loading) {
            return;
        }
        set({ loading: true });
        fetchWithErrorHandlers(`${Endpoint}/api/chat/suggested-actions`)
            .then(response=>response.json())
            .then((actions) => set({ actions }))
            .finally(() => set({ loading: false }));
    }
}))