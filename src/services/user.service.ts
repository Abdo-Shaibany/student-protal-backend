import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

export const fetchUsers = async (search?: string, orderBy?: string) => {
    if (search) {
        console.log(search);
        return prisma.user.findMany({
            include: { department: true },
            where: {
                OR: [
                    { name: { contains: search } },
                    { phone: { contains: search } },
                ],
                isAdmin: false
            },
            orderBy: orderBy && (orderBy === 'asc' || orderBy === 'desc') ? { totalRequests: orderBy } : undefined,
        });
    }
    return prisma.user.findMany({
        include: { department: true },
        where: {
            isAdmin: false
        },
        orderBy: orderBy && (orderBy === 'asc' || orderBy === 'desc') ? { totalRequests: orderBy } : undefined,
    });
};

export const getUserById = async (id: string) => {
    return prisma.user.findUnique({
        where: { id },
        include: { department: true },
    });
};

export const getUserByDepartmentId = async (id: string) => {
    return prisma.user.findFirst({
        where: { departmentId: id },
        include: { department: true },
    });
};

export const updateUserTotalRequests = async (id: string) => {
    return prisma.user.update({
        where: { id },
        data: {
            totalRequests: {
                increment: 1
            }
        },
    });
}

export const createUser = async (data: { name: string; phone: string; departmentId: string; password: string; isAdmin?: boolean; totalRequests?: number; }) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
        data: {
            name: data.name,
            phone: data.phone,
            departmentId: data.departmentId,
            password: hashedPassword,
            isAdmin: data.isAdmin || false,
            totalRequests: data.totalRequests || 0,
        },
    });
};

export const updateUser = async (id: string, data: Partial<{ name: string; phone: string; departmentId: string; password?: string; isAdmin: boolean; }>) => {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    return prisma.user.update({
        where: { id },
        data: {
            name: data.name,
            phone: data.phone,
            departmentId: data.departmentId,
            password: data.password ? data.password : undefined,
            isAdmin: data.isAdmin
        },
    });
};

export const deleteUser = async (id: string) => {
    return prisma.user.delete({ where: { id } });
};
