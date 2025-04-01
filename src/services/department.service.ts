import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const fetchDepartments = async () => {
    return prisma.department.findMany();
};

export const createDepartment = async (data: { name: string }) => {
    return prisma.department.create({
        data,
    });
};

export const updateDepartment = async (id: string, data: { name?: string; totalRequests?: number }) => {
    return prisma.department.update({
        where: { id },
        data,
    });
};

export const deleteDepartmentById = async (id: string) => {
    return prisma.department.delete({
        where: { id },
    });
};

export const fetchDepartmentsReport = async (): Promise<any[]> => {
    const departments = await prisma.department.findMany({
        include: {
            requests: true,
        },
    });
    return departments.map(dept => {
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
