import { Model } from '../registry';
import { ChatUIMessage } from '../message';


export interface BaseStreamConfig {
    messages: ChatUIMessage[];
    model: string;
    chatId: string;
    userId: string;
    searchMode: boolean
}