import { PrismaClient } from '@prisma/client';
import { AsyncLocalStorage } from 'async_hooks';
export const tenantStorage = new AsyncLocalStorage<any>();

const prisma = new PrismaClient();

async function main() {
  prisma.$use(async (params, next) => {
    const store = tenantStorage.getStore();
    const modelsWithOrg = ['SalesOrder'];

    if (store?.organizationId && params.model && modelsWithOrg.includes(params.model)) {
      const findAndModifyActions = [
        'findUnique', 'findUniqueOrThrow', 'findFirst', 'findFirstOrThrow',
        'findMany', 'update', 'updateMany', 'delete', 'deleteMany', 'count', 'aggregate', 'groupBy'
      ];

      if (findAndModifyActions.includes(params.action)) {
        if (!params.args) params.args = {};
        if (!params.args.where) params.args.where = {};

        if (params.args.where.organizationId === undefined) {
          params.args.where.organizationId = store.organizationId;

          if (params.action === 'findUnique') {
            params.action = 'findFirst' as typeof params.action;
          } else if (params.action === 'findUniqueOrThrow') {
            params.action = 'findFirstOrThrow' as typeof params.action;
          }
        }
      }
    }

    return next(params);
  });
  
  await tenantStorage.run({ organizationId: '4d8bcf2e-0039-4ce9-9773-89c063139f6d' }, async () => {
      try {
          const res = await prisma.salesOrder.update({
              where: { id: '575498f9-07fc-47e6-ae58-d8c5b53d8ffb' },
              data: { note: 'test' }
          });
          console.log('Result:', !!res);
      } catch (e) {
          console.error("Error:", e.message);
      }
  });
}
main().catch(console.error).finally(() => prisma.$disconnect());
