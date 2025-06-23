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
            { title: { contains: search } },
            { requestNumber: { contains: search } },
            { studentName: { contains: search } },
        ];
    }

    if (filters) {
        Object.assign(where, filters);
    }

    if (user && !user.isAdmin && !user.studentNo) {
        // where.departmentId = user.departmentId;
        // where.assignedToId = user.id;

        where.AND = [
            {
                OR: [
                    { assignedToId: user.id },
                    { RequestMovement: { some: { assignedToId: user.id } } }
                ]
            },
            { departmentId: user.departmentId }
        ];
    } else if (user && user.studentNo) {
        where.studentAccountId = user.id;
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
            RequestMovement: true,
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
            RequestType: true,
            RequestMovement: {
                include: {
                    assignedTo: true,
                }
            },
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
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(now);
    const formattedTime = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(now);

    return prisma.request.create({
        data: {
            requestNumber: `REQ-${Date.now()}`,
            studentName: data.fullName,
            phone: data.phone,
            message: data.message,
            status: 'pending',
            RequestType: { connect: { id: data.requestTypeId } },
            department: { connect: { id: data.departmentId } },
            assignedTo: data.assignedToId ? { connect: { id: data.assignedToId } } : undefined,
            createdAtDate: formattedDate,
            createdAt: formattedTime,
            StudentAccount: { connect: { id: data.studentAccountId } },
        },
    });
};


export const fetchRequestCountsDaily = async (): Promise<{ date: string; count: string }[]> => {
    const results = await prisma.$queryRaw<
        { date: string; count: number }[]
    >`SELECT createdAtDate as date, COUNT(*) AS count
        FROM Request
        GROUP BY date
        ORDER BY date ASC;`;

    const serializedResults = results.map(record => ({
        date: record.date,
        count: record.count.toString(),
    }));

    return serializedResults;
};

export const getRequestTodayReport = async (): Promise<{ pending: number; late: number }> => {
    const today = new Date().toISOString().split('T')[0];
    console.log()
    const pending = await prisma.request.count({
        where: {
            status: 'pending',
            createdAtDate: {
                gte: today,
            },
        },
        orderBy: {
            createdAtDate: "desc"
        }
    });
    // Late: pending and created more than 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    const late = await prisma.request.count({
        where: {
            status: 'pending',
            createdAt: {
                lt: threeDaysAgo.toISOString().split('T')[0],
            },
        },
        orderBy: {
            createdAtDate: "desc"
        }
    });
    return { pending, late };
};
