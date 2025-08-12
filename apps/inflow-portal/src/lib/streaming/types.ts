import { Message } from 'ai'
import { Model } from '../types/models'

export interface BaseStreamConfig {
    messages: Message[]
    model: Model
    chatId: string
    userId: string;
    searchMode: boolean
}
