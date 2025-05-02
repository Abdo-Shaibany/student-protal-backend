import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

export const fetchStudentAccounts = async (search?: string, orderBy?: string) => {
    if (search) {
        return prisma.studentAccount.findMany({
            where: {
                OR: [
                    { name: { contains: search } },
                    { phone: { contains: search } },
                    { studentNo: { contains: search } },
                ],
            },
        });
    }
    return prisma.studentAccount.findMany({});
};

export const getStudentAccountById = async (id: string) => {
    return prisma.studentAccount.findUnique({
        where: { id },
    });
};

export const createStudentAccount = async (data: { name: string; phone: string; studentNo: string; password: string; }) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.studentAccount.create({
        data: {
            name: data.name,
            phone: data.phone,
            password: hashedPassword,
            studentNo: data.studentNo,
        },
    });
};

export const updateStudentAccount = async (id: string, data: Partial<{ name: string; phone: string; studentNo: string; password?: string; }>) => {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    return prisma.studentAccount.update({
        where: { id },
        data: {
            name: data.name,
            phone: data.phone,
            studentNo: data.studentNo,
            password: data.password ? data.password : undefined,
        },
    });
};

export const deleteStudentAccount = async (id: string) => {
    return prisma.studentAccount.delete({ where: { id } });
};
