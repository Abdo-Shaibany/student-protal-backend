import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

export const submitLoginRequest = async (phone: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user || !user.password) {
        throw new Error('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { id: user.id, phone: user.phone, isAdmin: user.isAdmin, departmentId: user.departmentId, name: user.name },
        JWT_SECRET
    );

    return { token, user };
};

export const changePassword = async (
    userId: string,
    currentPassword: string,
    newPassword: string
) => {
    // 1) fetch user
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.password) {
        throw new Error("User not found")
    }

    // 2) verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
        throw new Error("Current password is incorrect")
    }

    // 3) hash & update
    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
    })

    return { message: "Password changed successfully" }
}