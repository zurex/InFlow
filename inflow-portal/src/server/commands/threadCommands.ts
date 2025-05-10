import { prisma } from 'inflow/base/storage/common/prisma';

export async function threadLister() {
    
}

export type ThreadCreatorOptions = {
    title: string;
    threadId?: string;
    userId: string;
    spaceId?: string;
};

export async function threadCreator({
    title,
    threadId,
    userId,
    spaceId,
} : ThreadCreatorOptions) {
    const thread = await prisma.thread.create({
        data: {
            id: threadId,
            title,
            userId,
            spaceId,
        },
    });
}