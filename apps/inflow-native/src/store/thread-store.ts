import { TextPart } from 'ai';
import { create } from 'zustand';

export type Thread = {
    id: string;
    title: string;
    preview?: Array<TextPart>;
    createdAt: Date;
    updatedAt: Date;
    messages?: any[];
}

interface ThreadStore {
    stepsShown: boolean;
    thread: Thread | null;
    displaySteps: () => void;
    dismissSteps: () => void;
    setThread: (thread: Thread) => void;
}

export const useThreadStore = create<ThreadStore>((set) => ({
    stepsShown: false,
    thread: null,
    displaySteps: () => set({ stepsShown: true}),
    dismissSteps: () => set({ stepsShown: false}),
    setThread: (thread) => set({ thread })
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