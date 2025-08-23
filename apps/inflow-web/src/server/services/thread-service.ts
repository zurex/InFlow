import { ChatMessage, Prisma, Thread } from '@prisma/client';
import { AssistantModelMessage, ModelMessage, ToolModelMessage } from 'ai';
import { ChatUIMessage } from 'inflow/ai/message';
import { prisma } from 'inflow/base/storage/prisma';

type ResponseMessage = AssistantModelMessage | ToolModelMessage;
type ThreadWithDetails = Thread & {
    messages: ChatMessage[];
};


type ThreadFindOptions = {
    limit: number;
    offset?: number;
}

type ThreadUpdateOptions = Partial<Thread> & Pick<Thread, 'id'>;

class ThreadService {
    async getThread(threadId: string): Promise<Thread|null> {
        return prisma.thread.findUnique({
            where: { id: threadId}
        });
    }

    async getThreadWithDetails(threadId: string): Promise<ThreadWithDetails|null> {
        return prisma.thread.findUnique({
            where: { id: threadId},
            include: {
                messages: true
            }
        });
    }

    async getThreads(options: ThreadFindOptions) {
        return prisma.thread.findMany({
            take: options.limit,
            skip: options.offset,
            orderBy: { createdAt: 'desc' }
        })
    }

    async saveThread(thread: ThreadUpdateOptions): Promise<Thread> {
        return await prisma.thread.upsert({
            create: {
                id: thread.id,
                userId: thread.userId!,
                title: thread.title || '',
            },
            update: {
                title: thread.title || '',
                preview: thread.preview as any
            },
            where: {
                id: thread.id
            }
        });
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

    async saveMessage(threadId: string, message: ChatUIMessage) {
        const { role } = message;
        await prisma.chatMessage.create({
            data: {
                threadId,
                role,
                parts: message.parts as Prisma.InputJsonValue || []
            }
        });
    }
}

export const threadService = new ThreadService();