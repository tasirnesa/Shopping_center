import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Check if any shops exist first
    const existingShop = await prisma.shop.findFirst({
        include: { branches: true }
    });

    if (existingShop) {
        console.log('A shop already exists!');
        console.log('Shop ID:', existingShop.id);
        console.log('Branch ID for Registration:', existingShop.branches[0]?.id);
        return;
    }

    // Create a new Shop and Branch
    const shop = await prisma.shop.create({
        data: {
            name: 'Central Shopping Center',
            ownerId: 'root-owner-123',
            branches: {
                create: {
                    name: 'Main Store Branch'
                }
            }
        },
        include: {
            branches: true
        }
    });

    console.log('Successfully seeded database!');
    console.log('---');
    console.log('New Shop Name:', shop.name);
    console.log('New Shop ID:', shop.id);
    console.log('---');
    console.log('New Branch Name:', shop.branches[0].name);
    console.log('NEW BRANCH ID (Copy this to mobile app):', shop.branches[0].id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
