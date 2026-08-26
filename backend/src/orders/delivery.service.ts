import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StateMachineService } from './state-machine.service';
import { AuditService } from './audit.service';
import { DeliveryStatus, OrderStatus, Prisma, Role, SalesOrder } from '@prisma/client';
@Injectable()
export class DeliveryService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly stateMachine: StateMachineService,
        private readonly audit: AuditService,
    ) { }

    /**
     * Creates a Delivery record when a SalesOrder reaches READY_FOR_DELIVERY.
     * Called inside an existing transaction from WarehouseService.
     * Req 4.1, 4.5
     */
    async createDelivery(
        prismaClient: Prisma.TransactionClient,
        salesOrder: SalesOrder,
        invoiceId: string,
    ) {
        return prismaClient.delivery.create({
            data: {
                salesOrderId: salesOrder.id,
                invoiceId,
                customerName: salesOrder.customerName,
                deliveryAddress: salesOrder.deliveryAddress,
                customerPhone: salesOrder.customerPhone ?? undefined,
                status: DeliveryStatus.PENDING,
            },
        });
    }

    /**
     * Driver picks up the order: Delivery → OUT_FOR_DELIVERY, SalesOrder → OUT_FOR_DELIVERY.
     * Req 4.2
     */
    async pickup(orderId: string, driverId: string, organizationId: string) {
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.salesOrder.findUnique({
                where: { id: orderId, organizationId },
                include: { delivery: true },
            });

            if (!order) throw new NotFoundException('Order not found');
            if (!order.delivery) throw new NotFoundException('Delivery record not found for this order');

            // Validate state machine transition
            const nextStatus = this.stateMachine.transition(order.status, 'pickup', Role.DRIVER);

            // Assign driver and transition delivery to OUT_FOR_DELIVERY
            const updatedDelivery = await tx.delivery.update({
                where: { id: order.delivery.id },
                data: {
                    driverId,
                    status: DeliveryStatus.OUT_FOR_DELIVERY,
                },
            });

            // Transition SalesOrder
            const updatedOrder = await tx.salesOrder.update({
                where: { id: orderId },
                data: { status: nextStatus },
            });

            await this.audit.recordTransition(
                tx,
                orderId,
                order.status,
                nextStatus,
                driverId,
                'Order picked up by driver',
            );

            return { order: updatedOrder, delivery: updatedDelivery };
        });
    }

    /**
     * Driver confirms delivery: requires a confirmationPath file upload.
     * Sets confirmationPath, confirmedAt, confirmedById, transitions Delivery → DELIVERED,
     * then automatically transitions SalesOrder → DELIVERED → COMPLETED.
     * Req 4.3, 4.4, 4.8, 9.4
     */
    async confirmDelivery(
        orderId: string,
        driverId: string,
        organizationId: string,
        confirmationPath?: string,
    ) {
        // Req 4.8: confirmation file is mandatory
        if (!confirmationPath) {
            throw new BadRequestException('Delivery confirmation file upload is required');
        }

        return this.prisma.$transaction(async (tx) => {
            const order = await tx.salesOrder.findUnique({
                where: { id: orderId, organizationId },
                include: { delivery: true },
            });

            if (!order) throw new NotFoundException('Order not found');
            if (!order.delivery) throw new NotFoundException('Delivery record not found for this order');

            // Only the assigned driver is restricted; OWNER/MANAGER can confirm on their behalf
            const actor = await tx.user.findUnique({ where: { id: driverId }, select: { role: true } });
            if (actor?.role === Role.DRIVER && order.delivery.driverId !== driverId) {
                throw new ForbiddenException('Only the assigned driver can confirm delivery');
            }

            // Validate transition: OUT_FOR_DELIVERY → DELIVERED (intermediate) → COMPLETED (final)
            const nextStatus = this.stateMachine.transition(order.status, 'confirm-delivery', Role.DRIVER);
            const intermediates = this.stateMachine.getIntermediates(order.status, 'confirm-delivery');

            // Record intermediate status events (DELIVERED)
            let current = order.status;
            for (const inter of intermediates) {
                await this.audit.recordTransition(tx, orderId, current, inter, driverId, 'Delivery confirmed');
                current = inter;
            }

            // Req 9.4: record driver, timestamp, and file path on the Delivery record
            const updatedDelivery = await tx.delivery.update({
                where: { id: order.delivery.id },
                data: {
                    confirmationPath,
                    status: DeliveryStatus.DELIVERED,
                    confirmedAt: new Date(),
                    confirmedById: driverId,
                },
            });

            // Transition SalesOrder to final status (COMPLETED per state machine)
            const updatedOrder = await tx.salesOrder.update({
                where: { id: orderId },
                data: { status: nextStatus },
            });

            await this.audit.recordTransition(
                tx,
                orderId,
                current,
                nextStatus,
                driverId,
                'Order delivered and completed',
            );



            return { order: updatedOrder, delivery: updatedDelivery };
        });
    }

    /**
     * Driver picks up the order by Delivery ID (used by DeliveriesController).
     * Looks up the delivery, verifies driver ownership, then delegates to the
     * orderId-based `pickup` method.
     * Req 4.2
     */
    async pickupByDeliveryId(deliveryId: string, driverId: string, organizationId: string) {
        const delivery = await this.prisma.delivery.findUnique({
            where: { id: deliveryId },
            include: { salesOrder: { select: { id: true, organizationId: true } } },
        });

        if (!delivery) throw new NotFoundException(`Delivery ${deliveryId} not found`);

        if (delivery.salesOrder.organizationId !== organizationId) {
            throw new ForbiddenException();
        }

        return this.pickup(delivery.salesOrder.id, driverId, organizationId);
    }

    /**
     * Driver confirms delivery by Delivery ID (used by DeliveriesController).
     * Looks up the delivery, verifies driver ownership, then delegates to the
     * orderId-based `confirmDelivery` method.
     * Req 4.3, 4.4, 4.8, 9.4
     */
    async confirmDeliveryById(
        deliveryId: string,
        driverId: string,
        organizationId: string,
        confirmationPath: string,
    ) {
        const delivery = await this.prisma.delivery.findUnique({
            where: { id: deliveryId },
            include: { salesOrder: { select: { id: true, organizationId: true } } },
        });

        if (!delivery) throw new NotFoundException(`Delivery ${deliveryId} not found`);

        if (delivery.salesOrder.organizationId !== organizationId) {
            throw new ForbiddenException();
        }

        return this.confirmDelivery(delivery.salesOrder.id, driverId, organizationId, confirmationPath);
    }

    /**
     * Lists deliveries. DRIVER role sees only their own assigned deliveries.
     * MANAGER sees all deliveries for the organization.
     * Req 4.6, 6.4
     */
    async findAll(userId: string, role: Role, orgId: string) {
        if (role === Role.DRIVER) {
            // Drivers see:
            // 1. All PENDING deliveries in the org (available for pickup - not yet assigned)
            // 2. Their own OUT_FOR_DELIVERY deliveries (already picked up by them)
            // 3. Their own DELIVERED deliveries (completed by them, for history)
            return this.prisma.delivery.findMany({
                where: {
                    salesOrder: { organizationId: orgId },
                    OR: [
                        { status: DeliveryStatus.PENDING },                         // available to pick up
                        { driverId: userId, status: DeliveryStatus.OUT_FOR_DELIVERY }, // in progress
                        { driverId: userId, status: DeliveryStatus.DELIVERED },        // completed
                    ],
                },
                include: {
                    salesOrder: { select: { organizationId: true, customerName: true, deliveryAddress: true, customerPhone: true } },
                    invoice: { select: { invoiceNumber: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
        }

        // MANAGER and other permitted roles: scoped to organization
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

    /**
     * Returns a single delivery. DRIVER ownership is enforced (only their own deliveries).
     * Req 4.9, 6.4, 6.6
     */
    async findOne(id: string, userId: string, role: Role, orgId: string) {
        const delivery = await this.prisma.delivery.findUnique({
            where: { id },
            include: {
                salesOrder: true,
                invoice: { include: { lines: { include: { product: true } } } },
                driver: { select: { id: true, name: true } },
            },
        });

        if (!delivery) throw new NotFoundException(`Delivery ${id} not found`);

        // Verify the delivery belongs to this organization
        if (delivery.salesOrder.organizationId !== orgId) {
            throw new ForbiddenException();
        }

        // Req 6.4: DRIVER can only access their own delivery records OR unassigned PENDING ones
        if (role === Role.DRIVER && delivery.driverId !== userId && delivery.status !== DeliveryStatus.PENDING) {
            throw new ForbiddenException('Drivers can only access their own delivery records');
        }

        return delivery;
    }
}
