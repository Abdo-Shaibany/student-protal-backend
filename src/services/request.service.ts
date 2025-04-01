import { PrismaClient, RequestStatus } from '@prisma/client';
const prisma = new PrismaClient();

interface Pagination {
    page: number;
    pageSize: number;
    orderBy?: { [key: string]: 'asc' | 'desc' };
    search?: string;
    filters?: { [key: string]: any };
}

export const fetchRequests = async (pagination: Pagination, user?: any) => {
    const { page, pageSize, orderBy, search, filters } = pagination;
    const skip = (page - 1) * pageSize;
    const where: any = {};

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { studentName: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (filters) {
        Object.assign(where, filters);
    }

    if (user && !user.isAdmin) {
        where.departmentId = user.departmentId;
        where.assignedToId = user.id;
    }

    const requests = await prisma.request.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: {
            department: true,
            assignedTo: true,
            files: true,
            statusHistory: true,
        },
    });

    const total = await prisma.request.count({ where });

    return { data: requests, total, page, pageSize };
};

export const fetchRequestById = async (id: string) => {
    return prisma.request.findUnique({
        where: { id },
        include: {
            department: true,
            assignedTo: true,
            files: true,
            statusHistory: true,
        },
    });
};

export const updateRequestStatus = async (id: string, status: RequestStatus, comment?: string) => {
    // Update the main request status
    const updatedRequest = await prisma.request.update({
        where: { id },
        data: { status },
    });
    // Append status history
    await prisma.requestStatusHistory.create({
        data: {
            status,
            date: new Date(),
            comment,
            request: { connect: { id } },
        },
    });
    return updatedRequest;
};

export const submitStudentRequest = async (data: any) => {
    // Data includes: fullName, phone, title, departmentId, message and optional fileUpload info.
    return prisma.request.create({
        data: {
            requestNumber: `REQ-${Date.now()}`,
            studentName: data.fullName,
            title: data.title,
            phone: data.phone,
            message: data.message,
            status: 'pending',
            department: { connect: { id: data.departmentId } },
            assignedTo: { connect: { id: data.assignedToId } }, // or leave null if unassigned
        },
    });
};

export const fetchRequestCountsDaily = async (): Promise<{ date: string; count: number }[]> => {
    const results = await prisma.$queryRaw<
        { date: string; count: number }[]
    >`SELECT date(createdAt) as date, count(*) as count FROM Request GROUP BY date(createdAt)`;
    return results;
};

export const getRequestTodayReport = async (): Promise<{ pending: number; late: number }> => {
    const today = new Date().toISOString().split('T')[0];
    const pending = await prisma.request.count({
        where: {
            status: 'pending',
            createdAt: {
                gte: new Date(today),
            },
        },
    });
    // Late: pending and created more than 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const late = await prisma.request.count({
        where: {
            status: 'pending',
            createdAt: {
                lt: threeDaysAgo,
            },
        },
    });
    return { pending, late };
};
