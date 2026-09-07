import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const order = await prisma.salesOrder.findUnique({
      where: { id: '575498f9-07fc-47e6-ae58-d8c5b53d8ffb' },
      include: { attachments: true }
  });
  console.log(JSON.stringify(order?.attachments, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
