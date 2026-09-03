const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const order = await prisma.salesOrder.findFirst();
  console.log('Order:', order.id, order.organizationId);
  const user = await prisma.user.findFirst({ where: { id: order.salesRepId } });
  console.log('User:', user.name, user.organizationId);
  
  const { tenantStorage } = require('./dist/prisma/tenant.storage.js');
  const PrismaService = require('./dist/prisma/prisma.service.js').PrismaService;
  const pService = new PrismaService();
  await pService.onModuleInit();

  await new Promise((resolve) => {
    tenantStorage.run({ organizationId: user.organizationId, role: user.role }, async () => {
      console.log('In tenant context. OrgId:', user.organizationId);
      const found = await pService.salesOrder.findUnique({ where: { id: order.id } });
      console.log('Found with findUnique:', !!found);
      resolve(true);
    });
  });
}
run().catch(console.error).finally(() => prisma.$disconnect());
