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
exports.DeliveryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const state_machine_service_1 = require("./state-machine.service");
const audit_service_1 = require("./audit.service");
const client_1 = require("@prisma/client");
let DeliveryService = class DeliveryService {
    prisma;
    stateMachine;
    audit;
    constructor(prisma, stateMachine, audit) {
        this.prisma = prisma;
        this.stateMachine = stateMachine;
        this.audit = audit;
    }
    async createDelivery(prismaClient, salesOrder, invoiceId) {
        return prismaClient.delivery.create({
            data: {
                salesOrderId: salesOrder.id,
                invoiceId,
                customerName: salesOrder.customerName,
                deliveryAddress: salesOrder.deliveryAddress,
                customerPhone: salesOrder.customerPhone ?? undefined,
                status: client_1.DeliveryStatus.PENDING,
            },
        });
    }
    async pickup(orderId, driverId, organizationId) {
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.salesOrder.findUnique({
                where: { id: orderId, organizationId },
                include: { delivery: true },
            });
            if (!order)
                throw new common_1.NotFoundException('Order not found');
            if (!order.delivery)
                throw new common_1.NotFoundException('Delivery record not found for this order');
            const nextStatus = this.stateMachine.transition(order.status, 'pickup', client_1.Role.DRIVER);
            const updatedDelivery = await tx.delivery.update({
                where: { id: order.delivery.id },
                data: {
                    driverId,
                    status: client_1.DeliveryStatus.OUT_FOR_DELIVERY,
                },
            });
            const updatedOrder = await tx.salesOrder.update({
                where: { id: orderId },
                data: { status: nextStatus },
            });
            await this.audit.recordTransition(tx, orderId, order.status, nextStatus, driverId, 'Order picked up by driver');
            return { order: updatedOrder, delivery: updatedDelivery };
        });
    }
    async confirmDelivery(orderId, driverId, organizationId, confirmationPath) {
        if (!confirmationPath) {
            throw new common_1.BadRequestException('Delivery confirmation file upload is required');
        }
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.salesOrder.findUnique({
                where: { id: orderId, organizationId },
                include: { delivery: true },
            });
            if (!order)
                throw new common_1.NotFoundException('Order not found');
            if (!order.delivery)
                throw new common_1.NotFoundException('Delivery record not found for this order');
            const actor = await tx.user.findUnique({ where: { id: driverId }, select: { role: true } });
            if (actor?.role === client_1.Role.DRIVER && order.delivery.driverId !== driverId) {
                throw new common_1.ForbiddenException('Only the assigned driver can confirm delivery');
            }
            const nextStatus = this.stateMachine.transition(order.status, 'confirm-delivery', client_1.Role.DRIVER);
            const intermediates = this.stateMachine.getIntermediates(order.status, 'confirm-delivery');
            let current = order.status;
            for (const inter of intermediates) {
                await this.audit.recordTransition(tx, orderId, current, inter, driverId, 'Delivery confirmed');
                current = inter;
            }
            const updatedDelivery = await tx.delivery.update({
                where: { id: order.delivery.id },
                data: {
                    confirmationPath,
                    status: client_1.DeliveryStatus.DELIVERED,
                    confirmedAt: new Date(),
                    confirmedById: driverId,
                },
            });
            const updatedOrder = await tx.salesOrder.update({
                where: { id: orderId },
                data: { status: nextStatus },
            });
            await this.audit.recordTransition(tx, orderId, current, nextStatus, driverId, 'Order delivered and completed');
            return { order: updatedOrder, delivery: updatedDelivery };
        });
    }
    async pickupByDeliveryId(deliveryId, driverId, organizationId) {
        const delivery = await this.prisma.delivery.findUnique({
            where: { id: deliveryId },
            include: { salesOrder: { select: { id: true, organizationId: true } } },
        });
        if (!delivery)
            throw new common_1.NotFoundException(`Delivery ${deliveryId} not found`);
        if (delivery.salesOrder.organizationId !== organizationId) {
            throw new common_1.ForbiddenException();
        }
        return this.pickup(delivery.salesOrder.id, driverId, organizationId);
    }
    async confirmDeliveryById(deliveryId, driverId, organizationId, confirmationPath) {
        const delivery = await this.prisma.delivery.findUnique({
            where: { id: deliveryId },
            include: { salesOrder: { select: { id: true, organizationId: true } } },
        });
        if (!delivery)
            throw new common_1.NotFoundException(`Delivery ${deliveryId} not found`);
        if (delivery.salesOrder.organizationId !== organizationId) {
            throw new common_1.ForbiddenException();
        }
        return this.confirmDelivery(delivery.salesOrder.id, driverId, organizationId, confirmationPath);
    }
    async findAll(userId, role, orgId) {
        if (role === client_1.Role.DRIVER) {
            return this.prisma.delivery.findMany({
                where: { driverId: userId },
                include: {
                    salesOrder: { select: { organizationId: true, customerName: true, deliveryAddress: true } },
                    invoice: { select: { invoiceNumber: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
        }
        return this.prisma.delivery.findMany({
            where: {
                salesOrder: { organizationId: orgId },
            },
            include: {
                salesOrder: { select: { organizationId: true, customerName: true, deliveryAddress: true } },
                invoice: { select: { invoiceNumber: true } },
                driver: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId, role, orgId) {
        const delivery = await this.prisma.delivery.findUnique({
            where: { id },
            include: {
                salesOrder: true,
                invoice: { include: { lines: { include: { product: true } } } },
                driver: { select: { id: true, name: true } },
            },
        });
        if (!delivery)
            throw new common_1.NotFoundException(`Delivery ${id} not found`);
        if (delivery.salesOrder.organizationId !== orgId) {
            throw new common_1.ForbiddenException();
        }
        if (role === client_1.Role.DRIVER && delivery.driverId !== userId) {
            throw new common_1.ForbiddenException('Drivers can only access their own delivery records');
        }
        return delivery;
    }
};
exports.DeliveryService = DeliveryService;
exports.DeliveryService = DeliveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        state_machine_service_1.StateMachineService,
        audit_service_1.AuditService])
], DeliveryService);
//# sourceMappingURL=delivery.service.js.map