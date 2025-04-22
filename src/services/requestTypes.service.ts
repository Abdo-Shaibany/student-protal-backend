import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const fetchRequestsTypes = async () => {
    return prisma.requestType.findMany({
        include: {
            department: true
        }
    });
};

export const createRequestType = async (data: { name: string, departmentId: string }) => {
    return prisma.requestType.create({
        data,
        include: {
            department: true
        }
    });
};

export const updateRequestType = async (id: string, data: { name?: string; totalRequests?: number; }) => {
    return prisma.requestType.update({
        where: { id },
        data,
        include: {
            department: true
        }
    });
};

export const updateRequestTypeTotalRequests = async (id: string) => {
    return prisma.requestType.update({
        where: { id },
        data: {
            totalRequests: {
                increment: 1
            }
        },

    });
}

export const deleteRequestTypeById = async (id: string) => {
    return prisma.requestType.delete({
        where: { id },
    });
};

export const fetchRequestTypesReport = async (): Promise<any[]> => {
    const requestsTypes = await prisma.requestType.findMany({
        include: {
            requests: true,
        },
    });
    return requestsTypes.map(dept => {
        const completed = dept.requests.filter(req => req.status === 'completed').length;
        const pending = dept.requests.filter(req => req.status === 'pending').length;
        const late = dept.requests.filter(req => {
            if (req.status === 'pending') {
                const createdAt = new Date(req.createdAt);
                const now = new Date();
                return (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24) > 3;
            }
            return false;
        }).length;
        return {
            name: dept.name,
            completed,
            pending,
            late,
        };
    });
};

