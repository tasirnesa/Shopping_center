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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseService = exports.InsufficientStockError = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const state_machine_service_1 = require("./state-machine.service");
const audit_service_1 = require("./audit.service");
const delivery_service_1 = require("./delivery.service");
const client_1 = require("@prisma/client");
class InsufficientStockError extends common_1.BadRequestException {
    insufficientItems;
    constructor(items) {
        super({
            statusCode: 400,
            error: 'INSUFFICIENT_STOCK',
            message: 'Insufficient stock for one or more products',
            items: items.map((item) => ({
                productId: item.productId,
                requested: item.requested,
                available: item.available,
            })),
        });
        this.insufficientItems = items;
    }
}
exports.InsufficientStockError = InsufficientStockError;
let WarehouseService = class WarehouseService {
    prisma;
    stateMachine;
    audit;
    deliveryService;
    constructor(prisma, stateMachine, audit, deliveryService) {
        this.prisma = prisma;
        this.stateMachine = stateMachine;
        this.audit = audit;
        this.deliveryService = deliveryService;
    }
    async createPickingList(prismaClient, salesOrder) {
        return prismaClient.pickingList.create({
            data: {
                salesOrderId: salesOrder.id,
                lines: {
                    create: salesOrder.lines.map((line) => ({
                        productId: line.productId,
                        quantity: line.quantity,
                        picked: false,
                    })),
                },
            },
            include: { lines: true },
        });
    }
    async confirmPicking(prismaClient, salesOrderId, actorId) {
        const order = await prismaClient.salesOrder.findUnique({
            where: { id: salesOrderId },
            include: {
                pickingList: { include: { lines: true } },
                lines: { include: { product: true } },
                invoice: true,
            },
        });
        if (!order)
            throw new common_1.NotFoundException(`Order ${salesOrderId} not found`);
        if (!order.pickingList)
            throw new common_1.NotFoundException('Picking List not found for this order');
        if (!order.invoice)
            throw new common_1.NotFoundException('Invoice not found for this order');
        const insufficientItems = [];
        for (const line of order.lines) {
            const stock = await prismaClient.stockBalance.findFirst({
                where: { branchId: order.branchId, productId: line.productId },
            });
            const available = stock?.quantity ?? 0;
            if (available < line.quantity) {
                insufficientItems.push({
                    productId: line.productId,
                    requested: line.quantity,
                    available,
                });
            }
        }
        if (insufficientItems.length > 0) {
            throw new InsufficientStockError(insufficientItems);
        }
        for (const line of order.lines) {
            const stock = await prismaClient.stockBalance.findFirst({
                where: { branchId: order.branchId, productId: line.productId },
            });
            await prismaClient.stockBalance.update({
                where: { id: stock.id },
                data: { quantity: stock.quantity - line.quantity },
            });
            await prismaClient.inventoryTransaction.create({
                data: {
                    productId: line.productId,
                    branchId: order.branchId,
                    type: 'OUT',
                    quantity: line.quantity,
                    reference: salesOrderId,
                },
            });
        }
        const nextStatus = this.stateMachine.transition(order.status, 'confirm-picking', client_1.Role.STORE_MAN);
        const intermediates = this.stateMachine.getIntermediates(order.status, 'confirm-picking');
        let current = order.status;
        for (const inter of intermediates) {
            await this.audit.recordTransition(prismaClient, salesOrderId, current, inter, actorId, 'Intermediate state on picking confirmation');
            current = inter;
        }
        const updatedOrder = await prismaClient.salesOrder.update({
            where: { id: salesOrderId },
            data: { status: nextStatus },
        });
        await this.audit.recordTransition(prismaClient, salesOrderId, current, nextStatus, actorId, 'Picking confirmed — order packed and ready for delivery');
        for (const pl of order.pickingList.lines) {
            await prismaClient.pickingListLine.update({
                where: { id: pl.id },
                data: { picked: true },
            });
        }
        await this.deliveryService.createDelivery(prismaClient, order, order.invoice.id);
        return updatedOrder;
    }
    async reverseStockDeduction(prismaClient, order) {
        for (const line of order.lines) {
            await prismaClient.inventoryTransaction.create({
                data: {
                    productId: line.productId,
                    branchId: order.branchId,
                    type: 'IN',
                    quantity: line.quantity,
                    reference: order.id,
                },
            });
            const stock = await prismaClient.stockBalance.findFirst({
                where: { branchId: order.branchId, productId: line.productId },
            });
            if (stock) {
                await prismaClient.stockBalance.update({
                    where: { id: stock.id },
                    data: { quantity: stock.quantity + line.quantity },
                });
            }
            else {
                await prismaClient.stockBalance.create({
                    data: {
                        branchId: order.branchId,
                        productId: line.productId,
                        quantity: line.quantity,
                    },
                });
            }
        }
    }
    async startPicking(orderId, storeManId, organizationId) {
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.salesOrder.findUnique({
                where: { id: orderId, organizationId },
                include: { lines: true },
            });
            if (!order)
                throw new common_1.NotFoundException('Order not found');
            const nextStatus = this.stateMachine.transition(order.status, 'start-picking', client_1.Role.STORE_MAN);
            const updatedOrder = await tx.salesOrder.update({
                where: { id: orderId },
                data: { status: nextStatus },
            });
            await this.audit.recordTransition(tx, orderId, order.status, nextStatus, storeManId, 'Started picking');
            const pickingList = await this.createPickingList(tx, order);
            return { order: updatedOrder, pickingList };
        });
    }
    async confirmPickingForOrder(orderId, storeManId, organizationId) {
        const order = await this.prisma.salesOrder.findUnique({
            where: { id: orderId, organizationId },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return this.prisma.$transaction(async (tx) => {
            return this.confirmPicking(tx, orderId, storeManId);
        });
    }
};
exports.WarehouseService = WarehouseService;
exports.WarehouseService = WarehouseService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => delivery_service_1.DeliveryService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        state_machine_service_1.StateMachineService,
        audit_service_1.AuditService,
        delivery_service_1.DeliveryService])
], WarehouseService);
//# sourceMappingURL=warehouse.service.js.map