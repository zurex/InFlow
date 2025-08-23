import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistStorage, StateStorage, StorageValue } from 'zustand/middleware';


class NativeStorage implements StateStorage {
    async getItem(name: string) {
        const value = await AsyncStorage.getItem(name);
        if (!value) {
            return null;
        }
        return JSON.parse(value);
    }
    setItem(name: string, value: string) {
        AsyncStorage.setItem(name, value);
    }
    removeItem(name: string){
        AsyncStorage.removeItem(name);
    }
}

export const storage = new NativeStorage();