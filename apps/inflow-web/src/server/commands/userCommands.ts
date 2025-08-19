import { prisma } from 'inflow/base/storage/prisma';

export type UserFinderOptions = {
    id: string;
};

export function userFinder(options: UserFinderOptions) {
    return prisma.user.findUnique({
        where: options,
    });
}