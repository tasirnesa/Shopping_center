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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InventoryService = class InventoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSuppliers(orgId) {
        return this.prisma.supplier.findMany({
            where: { organizationId: orgId },
            orderBy: { name: 'asc' },
        });
    }
    async createSupplier(orgId, dto) {
        return this.prisma.supplier.create({
            data: { ...dto, organizationId: orgId },
        });
    }
    async getPurchases(orgId) {
        return this.prisma.purchase.findMany({
            where: { organizationId: orgId },
            include: {
                supplier: true,
                branch: true,
                details: { include: { product: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createPurchase(orgId, dto) {
        const totalAmount = dto.details.reduce((sum, d) => sum + d.quantity * d.cost, 0);
        return this.prisma.$transaction(async (tx) => {
            const purchase = await tx.purchase.create({
                data: {
                    organizationId: orgId,
                    branchId: dto.branchId,
                    supplierId: dto.supplierId,
                    totalAmount,
                    details: {
                        create: dto.details.map((d) => ({
                            productId: d.productId,
                            quantity: d.quantity,
                            cost: d.cost,
                        })),
                    },
                },
                include: { details: true },
            });
            for (const detail of dto.details) {
                await this.upsertStockBalance(tx, dto.branchId, detail.productId, detail.quantity);
                await tx.inventoryTransaction.create({
                    data: {
                        productId: detail.productId,
                        branchId: dto.branchId,
                        type: 'IN',
                        quantity: detail.quantity,
                        reference: `Purchase:${purchase.id}`,
                    },
                });
            }
            return purchase;
        });
    }
    async getStockBalance(orgId, branchId) {
        const where = {};
        if (branchId) {
            where.branchId = branchId;
        }
        else {
            where.branch = { organizationId: orgId };
        }
        return this.prisma.stockBalance.findMany({
            where,
            include: {
                product: { include: { category: true, unit: true } },
                branch: true,
            },
            orderBy: { product: { name: 'asc' } },
        });
    }
    async getTransactions(orgId, branchId) {
        const where = {};
        if (branchId) {
            where.branchId = branchId;
        }
        else {
            where.branch = { organizationId: orgId };
        }
        return this.prisma.inventoryTransaction.findMany({
            where,
            include: { product: true, branch: true },
            orderBy: { createdAt: 'desc' },
            take: 200,
        });
    }
    async adjustStock(orgId, dto) {
        return this.prisma.$transaction(async (tx) => {
            if (dto.quantityChange < 0) {
                const current = await tx.stockBalance.findFirst({
                    where: { branchId: dto.branchId, productId: dto.productId },
                });
                if (!current || current.quantity + dto.quantityChange < 0) {
                    throw new common_1.BadRequestException(`Insufficient stock. Current: ${current?.quantity ?? 0}`);
                }
            }
            await this.upsertStockBalance(tx, dto.branchId, dto.productId, dto.quantityChange);
            return tx.inventoryTransaction.create({
                data: {
                    productId: dto.productId,
                    branchId: dto.branchId,
                    type: dto.quantityChange > 0 ? 'IN' : 'OUT',
                    quantity: Math.abs(dto.quantityChange),
                    reference: `Adjustment: ${dto.reason}`,
                },
            });
        });
    }
    async transferStock(orgId, dto) {
        if (dto.quantity <= 0) {
            throw new common_1.BadRequestException('Transfer quantity must be positive.');
        }
        return this.prisma.$transaction(async (tx) => {
            const sourceBalance = await tx.stockBalance.findFirst({
                where: { branchId: dto.fromBranchId, productId: dto.productId },
            });
            if (!sourceBalance || sourceBalance.quantity < dto.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock at source branch. Available: ${sourceBalance?.quantity ?? 0}`);
            }
            await tx.stockBalance.update({
                where: { id: sourceBalance.id },
                data: { quantity: { decrement: dto.quantity } },
            });
            await this.upsertStockBalance(tx, dto.toBranchId, dto.productId, dto.quantity);
            await tx.inventoryTransaction.create({
                data: {
                    productId: dto.productId,
                    branchId: dto.fromBranchId,
                    type: 'OUT',
                    quantity: dto.quantity,
                    reference: `Transfer to branch ${dto.toBranchId}`,
                },
            });
            await tx.inventoryTransaction.create({
                data: {
                    productId: dto.productId,
                    branchId: dto.toBranchId,
                    type: 'IN',
                    quantity: dto.quantity,
                    reference: `Transfer from branch ${dto.fromBranchId}`,
                },
            });
            return {
                message: 'Stock transferred successfully',
                quantity: dto.quantity,
            };
        });
    }
    async upsertStockBalance(tx, branchId, productId, quantityDelta) {
        const existing = await tx.stockBalance.findFirst({
            where: { branchId, productId },
        });
        if (existing) {
            return tx.stockBalance.update({
                where: { id: existing.id },
                data: { quantity: { increment: quantityDelta } },
            });
        }
        else {
            return tx.stockBalance.create({
                data: { branchId, productId, quantity: quantityDelta },
            });
        }
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map