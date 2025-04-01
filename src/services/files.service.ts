import { PrismaClient, FileType } from '@prisma/client';
const prisma = new PrismaClient();

export const fetchRequestFilesByRequestId = async (requestId: string) => {
    return prisma.requestFile.findMany({
        where: { request: { some: { id: requestId } } },
    });
};

export const createRequestFile = async (data: { name: string; type: FileType; url: string; requestId: string }) => {
    return prisma.requestFile.create({
        data: {
            name: data.name,
            type: data.type,
            url: data.url,
            request: { connect: { id: data.requestId } },
        },
    });
};

export const updateRequestFile = async (id: string, data: { name?: string; type?: FileType; url?: string }) => {
    return prisma.requestFile.update({
        where: { id },
        data,
    });
};

export const deleteRequestFileById = async (id: string) => {
    return prisma.requestFile.delete({
        where: { id },
    });
};

