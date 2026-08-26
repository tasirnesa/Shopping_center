import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { tenantStorage } from './tenant.storage';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();

    this.$use(async (params, next) => {
      const store = tenantStorage.getStore();

      // Models that strictly have an organizationId field
      const modelsWithOrg = [
        'OrganizationSettings', 'Branch', 'Category', 'Brand', 'Unit', 'Product',
        'Supplier', 'Customer', 'Purchase', 'Sale', 'Expense', 'SalesOrder',
        'Invoice', 'Notification', 'InvoiceSequence', 'InternalMessage'
      ];

      if (store?.organizationId && params.model && modelsWithOrg.includes(params.model)) {
        // Read & Update queries -> Inject WHERE clause
        const findAndModifyActions = [
          'findUnique', 'findUniqueOrThrow', 'findFirst', 'findFirstOrThrow',
          'findMany', 'update', 'updateMany', 'delete', 'deleteMany', 'count', 'aggregate', 'groupBy'
        ];

        if (findAndModifyActions.includes(params.action)) {
          if (!params.args) params.args = {};
          if (!params.args.where) params.args.where = {};

          if (params.args.where.organizationId === undefined) {
            params.args.where.organizationId = store.organizationId;
          }
        }

        // Create queries -> Inject DATA payload
        if (params.action === 'create' || params.action === 'createMany') {
          if (!params.args) params.args = {};
          if (!params.args.data) params.args.data = {};

          if (Array.isArray(params.args.data)) {
            for (const item of params.args.data) {
              if (item.organizationId === undefined) item.organizationId = store.organizationId;
            }
          } else {
            if (params.args.data.organizationId === undefined) {
              params.args.data.organizationId = store.organizationId;
            }
          }
        }
      }

      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
