import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findUnique({ where: { id: '9c1def29-5674-49d0-8d3c-f8a5e80918ee' } });
  console.log(user);
}
main().catch(console.error).finally(() => prisma.$disconnect());
