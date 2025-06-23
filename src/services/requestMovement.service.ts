import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export interface CreateRequestMovementData {
    requestId: string;
    assignedToId?: string | null;
    date?: Date;
}

export const fetchRequestMovements = async (options?: {
    requestId?: string;
    assignedToId?: string;
    skip?: number;
    take?: number;
    orderBy?: { date: 'asc' | 'desc' };
}) => {
    const { requestId, assignedToId, skip, take, orderBy } = options || {};
    const where: any = {};
    if (requestId) {
        where.requestId = requestId;
    }
    if (assignedToId) {
        where.assignedToId = assignedToId;
    }
    return prisma.requestMovement.findMany({
        where,
        skip,
        take,
        orderBy: orderBy ? { date: orderBy.date } : { date: 'desc' },
        include: {
            request: true,
            assignedTo: true,
        },
    });
};


export const createRequestMovement = async (data: CreateRequestMovementData) => {
    return prisma.requestMovement.create({
        data: {
            request: { connect: { id: data.requestId } },
            assignedTo: data.assignedToId ? { connect: { id: data.assignedToId } } : undefined,
            date: data.date,
        },
    });
};


export const createRequestMovementAndUpdateRequest = async (data: CreateRequestMovementData) => {
    return prisma.$transaction(async (tx) => {
        const movement = await tx.requestMovement.create({
            data: {
                request: { connect: { id: data.requestId } },
                assignedTo: data.assignedToId ? { connect: { id: data.assignedToId } } : undefined,
                date: data.date,
            },
        });

        if (data.assignedToId) {
            await tx.request.update({
                where: { id: data.requestId },
                data: {
                    assignedToId: data.assignedToId,
                },
            });
        }
        return movement;
    });
};


export const updateRequestMovement = async (
    id: string,
    data: { assignedToId?: string | null; date?: Date }
) => {
    const updateData: any = {};
    if (data.assignedToId !== undefined) {
        updateData.assignedTo = data.assignedToId
            ? { connect: { id: data.assignedToId } }
            : { disconnect: true };
    }
    if (data.date) {
        updateData.date = data.date;
    }
    return prisma.requestMovement.update({
        where: { id },
        data: updateData,
        include: {
            request: true,
            assignedTo: true,
        },
    });
};

export const deleteRequestMovementById = async (id: string) => {
    return prisma.requestMovement.delete({
        where: { id },
    });
};
