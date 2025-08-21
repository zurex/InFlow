import { Prisma, Thread } from '@prisma/client';
import { AssistantModelMessage, ModelMessage, ToolModelMessage } from 'ai';
import { prisma } from 'inflow/base/storage/prisma';

type ResponseMessage = AssistantModelMessage | ToolModelMessage;

type ThreadFindOptions = {
    limit: number;
    offset?: number;
}

class ThreadService {
    async getThread(threadId: string): Promise<Thread|null> {
        return prisma.thread.findUnique({
            where: { id: threadId}
        });
    }

    async getThreads(options: ThreadFindOptions) {
        return prisma.thread.findMany({
            take: options.limit,
            skip: options.offset,
            orderBy: { createdAt: 'desc' }
        })
    }

    async createThread(thread: Partial<Thread>) {
        console.log(`[ThreadService] create thread: ${JSON.stringify(thread)}`)
        await prisma.thread.create({
            data: {
                id: thread.id!,
                userId: thread.userId!,
                title: thread.title || ''
            }
        });
    }

    async getMessages(threadId: string) {
        // Fetch messages for the given thread ID
        return prisma.chatMessage.findMany({
            where: { threadId },
            orderBy: { createdAt: 'asc' },
        });
    }

    async saveMessage(threadId: string, message: ModelMessage) {
        const { role } = message;
        await prisma.chatMessage.create({
            data: {
                threadId,
                role,
                parts: message.content as Prisma.InputJsonValue
            }
        });
    }
}

export const threadService = new ThreadService();