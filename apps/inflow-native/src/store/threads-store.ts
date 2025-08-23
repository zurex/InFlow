import { TextPart } from 'ai';
import { Endpoint } from 'inflow/common/constants';
import { fetchWithErrorHandlers } from 'inflow/lib/utils';
import {create} from 'zustand';
import { createStore, StateCreator } from 'zustand/vanilla';
import { type Thread } from './thread-store';
import { createJSONStorage, persist } from 'zustand/middleware'
import { storage } from './storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type { Thread };

interface ThreadsStore {
    loading: boolean;
    /**
     * The threads saved as a map which is useful on remove duplicates
     */
    data: Record<string, Thread>;
    /**
     * The computed threads that order by updated time
     * May be we could add last viewed time
     */
    threads: Thread[];
    getThread: (id: string) => Thread | null;
    /**
     * Save threads in a batch way for better performance.
     * Expose it to make sure we could load threads from external source
     * such as local storage.
     * @param threads 
     * @returns 
     */
    saveThreads: (threads: Thread[]) => void;
    fetchThread: (id: string) => Promise<void>;
    fetchThreads: () => Promise<void>;
}

function listThreads(data: Record<string, Thread>) {
    const threads = Object.keys(data).map(key=>data[key]);
    return threads.sort((a, b) => {
        if (typeof a.updatedAt != 'object') {
            console.log(a.updatedAt)
            return 0;
        }
        if (typeof b.updatedAt != 'object') {
            console.log(b.updatedAt)
            return 0;
        }
        return b.updatedAt.getTime() - a.updatedAt.getTime()
    });
}

const stateCreator: StateCreator<ThreadsStore> = (set, get) => ({
    loading: false,
    data: {},
    threads: [],
    getThread: (id) => get().data[id],
    saveThreads: (threads) => set((state) => {
        try {
            const data = state.data;
            for (const thread of threads) {
                thread.updatedAt = new Date(thread.updatedAt);
                thread.createdAt = new Date(thread.createdAt);
                // Keep the details
                if (data[thread.id]) {
                    thread.messages = data[thread.id].messages;
                }
                data[thread.id] = thread;
            }
            const computed = listThreads(data);
            return { data, threads: computed };
        } catch (err) {
            console.log(err)
        }
    
    }),
    fetchThread: async (id) => {
        // const setThread = useThreadStore.getState().setThread;
        await fetchWithErrorHandlers(`${Endpoint}/api/thread/${id}`)
            .then(response => response.json())
            // Save it but not replace it
            .then(thread => {
                // setThread(thread);
                set((state) => {
                    const data = state.data;
                    data[id] = thread;
                    return { data };
                })
            })
            .finally(() => set({ loading: false }));
    },
    fetchThreads: async () => {
        const loading = get().loading;
        if (loading) {
            return;
        }
        set({ loading: true });
        await fetchWithErrorHandlers(`${Endpoint}/api/thread`)
            .then(response => response.json())
            // Save it but not replace it
            .then(get().saveThreads)
            .finally(() => set({ loading: false }));
    }
});

export const useThreadsStore = create(persist(
    stateCreator, 
    { 
        name: 'threads-storage',
        storage: createJSONStorage(()=>AsyncStorage)
    }
));