import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

export const fetchUsers = async () => {
    return prisma.user.findMany({
        include: { department: true },
    });
};

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

export const updateUser = async (id: string, data: Partial<{ name: string; phone: string; departmentId: string; password: string; isAdmin: boolean; }>) => {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    return prisma.user.update({
        where: { id },
        data,
    });
};

export const deleteUser = async (id: string) => {
    return prisma.user.delete({ where: { id } });
};
