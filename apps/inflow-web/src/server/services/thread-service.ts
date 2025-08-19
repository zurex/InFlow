import { prisma } from "inflow/base/storage/prisma";

class ThreadService {
    async getMessages(threadId: string) {
        // Fetch messages for the given thread ID
        return prisma.chatMessage.findMany({
            where: { threadId },
            orderBy: { createdAt: 'asc' },
        });
    }
}

export const threadService = new ThreadService();