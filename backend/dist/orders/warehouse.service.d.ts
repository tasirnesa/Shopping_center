import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StateMachineService } from './state-machine.service';
import { AuditService } from './audit.service';
import { DeliveryService } from './delivery.service';
import { Prisma, SalesOrder, SalesOrderLine } from '@prisma/client';
export interface InsufficientStockItem {
    productId: string;
    requested: number;
    available: number;
}
export declare class InsufficientStockError extends BadRequestException {
    readonly insufficientItems: InsufficientStockItem[];
    constructor(items: InsufficientStockItem[]);
}
type SalesOrderWithLines = SalesOrder & {
    lines: SalesOrderLine[];
};
export declare class WarehouseService {
    private readonly prisma;
    private readonly stateMachine;
    private readonly audit;
    private readonly deliveryService;
    constructor(prisma: PrismaService, stateMachine: StateMachineService, audit: AuditService, deliveryService: DeliveryService);
    createPickingList(prismaClient: Prisma.TransactionClient, salesOrder: SalesOrderWithLines): Promise<{
        lines: {
            id: string;
            productId: string;
            quantity: number;
            picked: boolean;
            binLocation: string | null;
            pickingListId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        salesOrderId: string;
    }>;
    confirmPicking(prismaClient: Prisma.TransactionClient, salesOrderId: string, actorId: string): Promise<{
        id: string;
        customerName: string;
        deliveryAddress: string;
        customerPhone: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        branchId: string;
        salesRepId: string;
        customerId: string | null;
        tin: string;
        subtotal: number;
        taxRate: number;
        taxAmount: number;
        grandTotal: number;
        rejectionReason: string | null;
        cancellationReason: string | null;
    }>;
    reverseStockDeduction(prismaClient: Prisma.TransactionClient, order: SalesOrderWithLines): Promise<void>;
    startPicking(orderId: string, storeManId: string, organizationId: string): Promise<{
        order: {
            id: string;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            branchId: string;
            salesRepId: string;
            customerId: string | null;
            tin: string;
            subtotal: number;
            taxRate: number;
            taxAmount: number;
            grandTotal: number;
            rejectionReason: string | null;
            cancellationReason: string | null;
        };
        pickingList: {
            lines: {
                id: string;
                productId: string;
                quantity: number;
                picked: boolean;
                binLocation: string | null;
                pickingListId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            salesOrderId: string;
        };
    }>;
    confirmPickingForOrder(orderId: string, storeManId: string, organizationId: string): Promise<{
        id: string;
        customerName: string;
        deliveryAddress: string;
        customerPhone: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        branchId: string;
        salesRepId: string;
        customerId: string | null;
        tin: string;
        subtotal: number;
        taxRate: number;
        taxAmount: number;
        grandTotal: number;
        rejectionReason: string | null;
        cancellationReason: string | null;
    }>;
}
export {};
