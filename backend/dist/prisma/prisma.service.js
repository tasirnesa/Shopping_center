"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const tenant_storage_1 = require("./tenant.storage");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
        this.$use(async (params, next) => {
            const store = tenant_storage_1.tenantStorage.getStore();
            const modelsWithOrg = [
                'OrganizationSettings', 'Branch', 'Category', 'Brand', 'Unit', 'Product',
                'Supplier', 'Customer', 'Purchase', 'Sale', 'Expense', 'SalesOrder',
                'Invoice', 'Notification', 'InvoiceSequence', 'InternalMessage'
            ];
            if (store?.organizationId && params.model && modelsWithOrg.includes(params.model)) {
                const findAndModifyActions = [
                    'findUnique', 'findUniqueOrThrow', 'findFirst', 'findFirstOrThrow',
                    'findMany', 'update', 'updateMany', 'delete', 'deleteMany', 'count', 'aggregate', 'groupBy'
                ];
                if (findAndModifyActions.includes(params.action)) {
                    if (!params.args)
                        params.args = {};
                    if (!params.args.where)
                        params.args.where = {};
                    if (params.args.where.organizationId === undefined) {
                        params.args.where.organizationId = store.organizationId;
                        if (params.action === 'findUnique') {
                            params.action = 'findFirst';
                        }
                        else if (params.action === 'findUniqueOrThrow') {
                            params.action = 'findFirstOrThrow';
                        }
                    }
                }
                if (params.action === 'create' || params.action === 'createMany') {
                    if (!params.args)
                        params.args = {};
                    if (!params.args.data)
                        params.args.data = {};
                    if (Array.isArray(params.args.data)) {
                        for (const item of params.args.data) {
                            if (item.organizationId === undefined)
                                item.organizationId = store.organizationId;
                        }
                    }
                    else {
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
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map