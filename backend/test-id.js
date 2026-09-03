const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const orderId = 'd154dbcb-6020-4533-964c-1a5ea6e647d9';
  const orgId = '4d8bcf2e-0039-4ce9-9773-89c063139f6d';
  
  const order = await prisma.salesOrder.findFirst({ where: { id: orderId } });
  console.log('Exists in DB:', !!order);
  if (order) {
    console.log('Record OrgId:', order.organizationId);
    console.log('Matches expected OrgId:', order.organizationId === orgId);
  }
}
run().catch(console.error).finally(() => prisma.$disconnect());
