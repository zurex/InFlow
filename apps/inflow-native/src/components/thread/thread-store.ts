import { BotUIMessage } from '@inflow/ai/message';
import { create } from 'zustand';

interface ThreadStore {
    showSteps: boolean;
    displaySteps: () => void;
    dismissSteps: () => void;
}

export const useThreadStore = create<ThreadStore>((set) => ({
    showSteps: false,
    displaySteps: () => set({ showSteps: true}),
    dismissSteps: () => set({ showSteps: false})
}));

export type Reference = {
    url: string;
    title: string;
    content: string;
    icon?: string;
    domain?: string;
}

export type SearchStep = {
    type: 'search'
    query: string;
    sources: Reference[];
}

export type OrchestrationStep = SearchStep;

interface OrchestrationStore {
    steps: OrchestrationStep[];
    references: Reference[];
    setSteps: (steps: OrchestrationStep[]) => void;
    setReferences: (references: Reference[]) => void;
}

export const useOrchestrationStore = create<OrchestrationStore>((set) => ({
    steps: [],
    references: [],
    setSteps: (steps) => set({ steps }),
    setReferences: (references) => set({ references })
}));