import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const result = await prisma.salesOrder.findUnique({ where: { id: '575498f9-07fc-47e6-ae58-d8c5b53d8ffb' }, select: { salesRepId: true } });
  console.log('Result:', result !== null);
}
main().catch(console.error).finally(() => prisma.$disconnect());
