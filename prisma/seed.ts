import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Hash the password "admin"
    const hashedPassword = await bcrypt.hash('admin', 10);

    // Create (or update) the super admin user
    const superAdmin = await prisma.user.upsert({
        where: { phone: '712345678' },
        update: {},
        create: {
            name: 'سوبر ادمن',
            phone: '712345678',
            totalRequests: 0,
            password: hashedPassword,
            isAdmin: true,
        },
    });

    console.log('Super admin created:', superAdmin);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
