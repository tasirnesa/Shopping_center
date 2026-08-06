import { Injectable, NotFoundException, BadRequestException, ForbiddenException, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StateMachineService } from './state-machine.service';
import { AuditService } from './audit.service';
import { DeliveryService } from './delivery.service';
import { OrderStatus, Prisma, Role, SalesOrder, SalesOrderLine } from '@prisma/client';

export interface InsufficientStockItem {
    productId: string;
    requested: number;
    available: number;
}

export class InsufficientStockError extends BadRequestException {
    readonly insufficientItems: InsufficientStockItem[];

    constructor(items: InsufficientStockItem[]) {
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

type SalesOrderWithLines = SalesOrder & { lines: SalesOrderLine[] };

@Injectable()
export class WarehouseService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly stateMachine: StateMachineService,
        private readonly audit: AuditService,
        @Inject(forwardRef(() => DeliveryService))
        private readonly deliveryService: DeliveryService,
    ) { }

    /**
     * Creates a PickingList and its PickingListLine records from the given sales order's lines.
     * Intended to be called inside an existing transaction.
     * Req 3.1
     */
    async createPickingList(
        prismaClient: Prisma.TransactionClient,
        salesOrder: SalesOrderWithLines,
    ) {
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

    /**
     * Validates stock levels and performs stock deduction for all order lines.
     * Throws a structured INSUFFICIENT_STOCK error listing each affected product
     * and its available quantity if any line would cause a negative balance.
     * Creates InventoryTransaction (type OUT) for each line.
     * Must be called inside a prisma.$transaction.
     * Req 3.3, 3.4, 3.5, 9.3
     */
    async confirmPicking(
        prismaClient: Prisma.TransactionClient,
        salesOrderId: string,
        actorId: string,
    ) {
        const order = await prismaClient.salesOrder.findUnique({
            where: { id: salesOrderId },
            include: {
                pickingList: { include: { lines: true } },
                lines: { include: { product: true } },
                invoice: true,
            },
        });

        if (!order) throw new NotFoundException(`Order ${salesOrderId} not found`);
        if (!order.pickingList) throw new NotFoundException('Picking List not found for this order');
        if (!order.invoice) throw new NotFoundException('Invoice not found for this order');

        // Req 3.5: Check all stock balances first before making any changes
        const insufficientItems: InsufficientStockItem[] = [];

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

        // If any products have insufficient stock, throw structured error with all details
        if (insufficientItems.length > 0) {
            throw new InsufficientStockError(insufficientItems);
        }

        // All stock checks passed — perform deductions and create OUT transactions
        // Req 3.3, 3.4, 9.3
        for (const line of order.lines) {
            const stock = await prismaClient.stockBalance.findFirst({
                where: { branchId: order.branchId, productId: line.productId },
            });

            // stock is guaranteed non-null here (checked above)
            await prismaClient.stockBalance.update({
                where: { id: stock!.id },
                data: { quantity: stock!.quantity - line.quantity },
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

        // State machine transition: PICKING → PACKED (intermediate) → READY_FOR_DELIVERY
        const nextStatus = this.stateMachine.transition(order.status, 'confirm-picking', Role.STORE_MAN);
        const intermediates = this.stateMachine.getIntermediates(order.status, 'confirm-picking');

        let current: OrderStatus = order.status;
        for (const inter of intermediates) {
            await this.audit.recordTransition(prismaClient, salesOrderId, current, inter, actorId, 'Intermediate state on picking confirmation');
            current = inter;
        }

        const updatedOrder = await prismaClient.salesOrder.update({
            where: { id: salesOrderId },
            data: { status: nextStatus },
        });

        await this.audit.recordTransition(
            prismaClient,
            salesOrderId,
            current,
            nextStatus,
            actorId,
            'Picking confirmed — order packed and ready for delivery',
        );

        // Mark all picking list lines as picked
        for (const pl of order.pickingList.lines) {
            await prismaClient.pickingListLine.update({
                where: { id: pl.id },
                data: { picked: true },
            });
        }

        // Req 4.1: Create Delivery record now that order is READY_FOR_DELIVERY
        await this.deliveryService.createDelivery(prismaClient, order, order.invoice.id);

        return updatedOrder;
    }

    /**
     * Reverses stock deductions for a cancelled Sales Order.
     *
     * Called when a Manager cancels an order that is in PICKING, PACKED, or READY_FOR_DELIVERY
     * status — i.e. stock was already deducted during packing confirmation.
     *
     * For each order line:
     *   1. Creates a compensating InventoryTransaction of type IN.
     *   2. Increments the StockBalance by the line quantity (creates the balance record if missing).
     *
     * Must be called inside an existing prisma.$transaction.
     * Req 5.3, 9.3
     */
    async reverseStockDeduction(
        prismaClient: Prisma.TransactionClient,
        order: SalesOrderWithLines,
    ): Promise<void> {
        for (const line of order.lines) {
            // Create compensating IN transaction (Req 5.3, 9.3)
            await prismaClient.inventoryTransaction.create({
                data: {
                    productId: line.productId,
                    branchId: order.branchId,
                    type: 'IN',
                    quantity: line.quantity,
                    reference: order.id,
                },
            });

            // Restore StockBalance — upsert in case the record was somehow deleted
            const stock = await prismaClient.stockBalance.findFirst({
                where: { branchId: order.branchId, productId: line.productId },
            });

            if (stock) {
                await prismaClient.stockBalance.update({
                    where: { id: stock.id },
                    data: { quantity: stock.quantity + line.quantity },
                });
            } else {
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

    /**
     * High-level entry point: transitions WAITING_FOR_WAREHOUSE → PICKING, creates a PickingList.
     * Wraps everything in a prisma.$transaction.
     * Req 3.2
     */
    async startPicking(orderId: string, storeManId: string, organizationId: string) {
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.salesOrder.findUnique({
                where: { id: orderId, organizationId },
                include: { lines: true },
            });
            if (!order) throw new NotFoundException('Order not found');

            const nextStatus = this.stateMachine.transition(order.status, 'start-picking', Role.STORE_MAN);

            const updatedOrder = await tx.salesOrder.update({
                where: { id: orderId },
                data: { status: nextStatus },
            });

            await this.audit.recordTransition(tx, orderId, order.status, nextStatus, storeManId, 'Started picking');

            const pickingList = await this.createPickingList(tx, order);

            return { order: updatedOrder, pickingList };
        });
    }

    /**
     * High-level entry point: confirms all picking for an order.
     * Wraps confirmPicking in a prisma.$transaction.
     * Req 3.3, 3.5, 3.6
     */
    async confirmPickingForOrder(orderId: string, storeManId: string, organizationId: string) {
        // Validate the order exists and belongs to the org before entering the transaction
        const order = await this.prisma.salesOrder.findUnique({
            where: { id: orderId, organizationId },
        });
        if (!order) throw new NotFoundException('Order not found');

        return this.prisma.$transaction(async (tx) => {
            return this.confirmPicking(tx, orderId, storeManId);
        });
    }
}
