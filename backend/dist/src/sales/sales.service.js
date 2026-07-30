"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SalesService = class SalesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    saleInclude = {
        details: { include: { product: true } },
        organization: true,
        branch: true,
        customer: true,
        returns: { include: { details: true } },
    };
    async create(orgId, data) {
        if (!data.details || data.details.length === 0) {
            throw new common_1.BadRequestException('Cannot create empty sale');
        }
        return this.prisma.$transaction(async (tx) => {
            let subTotal = 0;
            for (const item of data.details) {
                const product = await tx.product.findFirst({
                    where: { id: item.productId, organizationId: orgId },
                });
                if (!product)
                    throw new common_1.BadRequestException(`Product ${item.productId} not found`);
                const stock = await tx.stockBalance.findFirst({
                    where: { branchId: data.branchId, productId: item.productId },
                });
                if (!stock || stock.quantity < item.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for product ${product.name}`);
                }
                subTotal += item.price * item.quantity;
            }
            const discount = data.discount || 0;
            const totalAmount = subTotal - discount;
            const sale = await tx.sale.create({
                data: {
                    organizationId: orgId,
                    branchId: data.branchId,
                    customerId: data.customerId,
                    subTotal,
                    discount,
                    totalAmount,
                    details: {
                        create: data.details.map((d) => ({
                            productId: d.productId,
                            quantity: d.quantity,
                            price: d.price,
                        })),
                    },
                },
                include: this.saleInclude,
            });
            for (const item of data.details) {
                await tx.stockBalance.updateMany({
                    where: { branchId: data.branchId, productId: item.productId },
                    data: { quantity: { decrement: item.quantity } },
                });
                await tx.inventoryTransaction.create({
                    data: {
                        productId: item.productId,
                        branchId: data.branchId,
                        type: 'OUT',
                        quantity: item.quantity,
                        reference: `SALE_${sale.id}`,
                    },
                });
            }
            return sale;
        });
    }
    async findAll(orgId) {
        return this.prisma.sale.findMany({
            where: { organizationId: orgId },
            include: this.saleInclude,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(orgId, id) {
        return this.prisma.sale.findFirst({
            where: { id, organizationId: orgId },
            include: this.saleInclude,
        });
    }
    async processReturn(orgId, data) {
        if (!data.details || data.details.length === 0) {
            throw new common_1.BadRequestException('Cannot process empty return');
        }
        return this.prisma.$transaction(async (tx) => {
            const sale = await tx.sale.findFirst({
                where: { id: data.saleId, organizationId: orgId },
                include: { details: true },
            });
            if (!sale)
                throw new common_1.BadRequestException('Sale not found');
            let totalRefund = 0;
            for (const item of data.details) {
                totalRefund += item.price * item.quantity;
            }
            const ret = await tx.return.create({
                data: {
                    saleId: data.saleId,
                    totalRefund,
                    details: {
                        create: data.details.map((d) => ({
                            productId: d.productId,
                            quantity: d.quantity,
                            price: d.price,
                        })),
                    },
                },
                include: { details: true },
            });
            for (const item of data.details) {
                const stock = await tx.stockBalance.findFirst({
                    where: { branchId: data.branchId, productId: item.productId },
                });
                if (stock) {
                    await tx.stockBalance.update({
                        where: { id: stock.id },
                        data: { quantity: { increment: item.quantity } },
                    });
                }
                else {
                    await tx.stockBalance.create({
                        data: {
                            branchId: data.branchId,
                            productId: item.productId,
                            quantity: item.quantity,
                        },
                    });
                }
                await tx.inventoryTransaction.create({
                    data: {
                        productId: item.productId,
                        branchId: data.branchId,
                        type: 'IN',
                        quantity: item.quantity,
                        reference: `RETURN_${ret.id}`,
                    },
                });
            }
            return ret;
        });
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalesService);
//# sourceMappingURL=sales.service.js.map