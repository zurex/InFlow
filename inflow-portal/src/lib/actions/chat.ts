'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { type Chat } from 'inflow/lib/types'
import { getRedisClient, RedisWrapper } from 'inflow/lib/redis/config'
import { RedisAdapter } from 'inflow/platform/storage/common/redis';

async function getRedis(): Promise<RedisAdapter> {
    return RedisAdapter.defaultClient
}

const CHAT_VERSION = 'v2'
function getUserChatKey(userId: string) {
    return `user:${CHAT_VERSION}:chat:${userId}`
}

export async function getChats(userId?: string | null) {
    if (!userId) {
        return []
    }

    try {
        const redis = await getRedis()
        const chats = await redis.zrange(getUserChatKey(userId), 0, -1);

        console.log('chats:', userId, chats)

        if (chats.length === 0) {
        return []
        }

        const results = await Promise.all(
        chats.map(async chatKey => {
            if (chatKey.indexOf("undefined") !== -1) {
            return null
            }
            const chat = await redis.hgetall(chatKey)
            return chat
        })
        )

        return results
        .filter((result): result is Record<string, any> => {
            if (result === null || Object.keys(result).length === 0) {
            return false
            }
            return true
        })
        .map(chat => {
            const plainChat = { ...chat }
            if (typeof plainChat.messages === 'string') {
            try {
                plainChat.messages = JSON.parse(plainChat.messages)
            } catch (error) {
                plainChat.messages = []
            }
            }
            if (plainChat.createdAt && !(plainChat.createdAt instanceof Date)) {
            plainChat.createdAt = new Date(plainChat.createdAt)
            }
            console.log('plainChat:', plainChat)
            return plainChat as Chat
        })
    } catch (error) {
        console.log('Error getting chats:', error)
        return []
    }
}

export async function getChat(id: string, userId: string) {
    console.log('getChat:', id, userId)
    const redis = await getRedis()
    const chat: Chat = await redis.hgetall(`chat:${id}`) as Chat

    if (!chat || chat.messages === undefined || chat.messages === null || chat.messages.length === 0) {
        return null
    }

    // Parse the messages if they're stored as a string
    if (typeof chat.messages === 'string') {
        try {
        chat.messages = JSON.parse(chat.messages)
        } catch (error) {
        chat.messages = []
        }
    }

    // Ensure messages is always an array
    if (!Array.isArray(chat.messages)) {
        chat.messages = []
        
    }

    console.log('get chat result:', chat)

    return chat
}

export async function clearChats(
    userId: string
): Promise<{ error?: string }> {
    console.log('Clearing chats for user:', userId)
    const redis = await getRedis()
    const userChatKey = getUserChatKey(userId)
    const chats = await redis.zrange(userChatKey, 0, -1)
    if (!chats.length) {
        return { error: 'No chats to clear' }
    }
    const pipeline = redis.pipeline()

    for (const chat of chats) {
        pipeline.del(chat)
        pipeline.zrem(userChatKey, chat)
    }

    await pipeline.exec()

    revalidatePath('/')
    redirect('/')
}

export async function deleteChat(
    chatId: string,
    userId = 'anonymous'
  ): Promise<{ error?: string }> {
    try {
      const redis = await getRedis()
      const userKey = getUserChatKey(userId)
      const chatKey = `chat:${chatId}`
  
      const chatDetails = await redis.hgetall(chatKey) as Chat;
      if (!chatDetails || Object.keys(chatDetails).length === 0) {
        console.warn(`Attempted to delete non-existent chat: ${chatId}`)
        return { error: 'Chat not found' }
      }
  
      // Optional: Check if the chat actually belongs to the user if userId is provided and matters
      // if (chatDetails.userId !== userId) {
      //  console.warn(`Unauthorized attempt to delete chat ${chatId} by user ${userId}`)
      //  return { error: 'Unauthorized' }
      // }
  
      const pipeline = redis.pipeline()
      pipeline.del(chatKey)
      pipeline.zrem(userKey, chatKey) // Use chatKey consistently
      await pipeline.exec()
  
      // Revalidate the root path where the chat history is displayed
      revalidatePath('/')
  
      return {}
    } catch (error) {
      console.error(`Error deleting chat ${chatId}:`, error)
      return { error: 'Failed to delete chat' }
    }
  }  

export async function saveChat(chat: Chat, userId: string) {
    try {
        console.log('Saving chat:', userId, chat.id)
        const redis = await getRedis()
        const pipeline = redis.pipeline()

        const chatToSave = {
            ...chat,
            messages: JSON.stringify(chat.messages)
        }

        pipeline.hmset(`chat:${chat.id}`, chatToSave)
        pipeline.zadd(getUserChatKey(userId), Date.now(), `chat:${chat.id}`)

        const results = await pipeline.exec()
        console.log('result:', results)
        return results
    } catch (error) {
        throw error
    }
}

export async function getSharedChat(id: string) {
    const redis = await getRedis()
    const chat = await redis.hgetall(`chat:${id}`) as Chat

    if (!chat || !chat.sharePath) {
        return null
    }

    return chat
}

export async function shareChat(id: string, userId: string) {
    const redis = await getRedis()
    const chat = await redis.hgetall(`chat:${id}`) as Chat

    if (!chat || chat.userId !== userId) {
        return null
    }

    const payload = {
        ...chat,
        sharePath: `/share/${id}`
    }

    await redis.hmset(`chat:${id}`, payload)

    return payload
}
