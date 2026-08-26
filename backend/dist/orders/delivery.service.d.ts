import { PrismaService } from '../prisma/prisma.service';
import { StateMachineService } from './state-machine.service';
import { AuditService } from './audit.service';
import { Prisma, Role, SalesOrder } from '@prisma/client';
export declare class DeliveryService {
    private readonly prisma;
    private readonly stateMachine;
    private readonly audit;
    constructor(prisma: PrismaService, stateMachine: StateMachineService, audit: AuditService);
    createDelivery(prismaClient: Prisma.TransactionClient, salesOrder: SalesOrder, invoiceId: string): Promise<{
        id: string;
        customerName: string;
        deliveryAddress: string;
        customerPhone: string | null;
        status: import(".prisma/client").$Enums.DeliveryStatus;
        confirmationPath: string | null;
        confirmedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        salesOrderId: string;
        invoiceId: string;
        driverId: string | null;
        confirmedById: string | null;
    }>;
    pickup(orderId: string, driverId: string, organizationId: string): Promise<{
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
            paymentMethod: string;
            paymentTerm: string | null;
            chequeNumber: string | null;
            creditDueDate: Date | null;
            rejectionReason: string | null;
            cancellationReason: string | null;
            note: string | null;
        };
        delivery: {
            id: string;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            status: import(".prisma/client").$Enums.DeliveryStatus;
            confirmationPath: string | null;
            confirmedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            salesOrderId: string;
            invoiceId: string;
            driverId: string | null;
            confirmedById: string | null;
        };
    }>;
    confirmDelivery(orderId: string, driverId: string, organizationId: string, confirmationPath?: string): Promise<{
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
            paymentMethod: string;
            paymentTerm: string | null;
            chequeNumber: string | null;
            creditDueDate: Date | null;
            rejectionReason: string | null;
            cancellationReason: string | null;
            note: string | null;
        };
        delivery: {
            id: string;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            status: import(".prisma/client").$Enums.DeliveryStatus;
            confirmationPath: string | null;
            confirmedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            salesOrderId: string;
            invoiceId: string;
            driverId: string | null;
            confirmedById: string | null;
        };
    }>;
    pickupByDeliveryId(deliveryId: string, driverId: string, organizationId: string): Promise<{
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
            paymentMethod: string;
            paymentTerm: string | null;
            chequeNumber: string | null;
            creditDueDate: Date | null;
            rejectionReason: string | null;
            cancellationReason: string | null;
            note: string | null;
        };
        delivery: {
            id: string;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            status: import(".prisma/client").$Enums.DeliveryStatus;
            confirmationPath: string | null;
            confirmedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            salesOrderId: string;
            invoiceId: string;
            driverId: string | null;
            confirmedById: string | null;
        };
    }>;
    confirmDeliveryById(deliveryId: string, driverId: string, organizationId: string, confirmationPath: string): Promise<{
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
            paymentMethod: string;
            paymentTerm: string | null;
            chequeNumber: string | null;
            creditDueDate: Date | null;
            rejectionReason: string | null;
            cancellationReason: string | null;
            note: string | null;
        };
        delivery: {
            id: string;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            status: import(".prisma/client").$Enums.DeliveryStatus;
            confirmationPath: string | null;
            confirmedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            salesOrderId: string;
            invoiceId: string;
            driverId: string | null;
            confirmedById: string | null;
        };
    }>;
    findAll(userId: string, role: Role, orgId: string): Promise<({
        salesOrder: {
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            organizationId: string;
        };
        invoice: {
            invoiceNumber: string;
        };
    } & {
        id: string;
        customerName: string;
        deliveryAddress: string;
        customerPhone: string | null;
        status: import(".prisma/client").$Enums.DeliveryStatus;
        confirmationPath: string | null;
        confirmedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        salesOrderId: string;
        invoiceId: string;
        driverId: string | null;
        confirmedById: string | null;
    })[] | ({
        salesOrder: {
            customerName: string;
            deliveryAddress: string;
            organizationId: string;
        };
        invoice: {
            invoiceNumber: string;
        };
        driver: {
            id: string;
            name: string | null;
        } | null;
    } & {
        id: string;
        customerName: string;
        deliveryAddress: string;
        customerPhone: string | null;
        status: import(".prisma/client").$Enums.DeliveryStatus;
        confirmationPath: string | null;
        confirmedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        salesOrderId: string;
        invoiceId: string;
        driverId: string | null;
        confirmedById: string | null;
    })[]>;
    findOne(id: string, userId: string, role: Role, orgId: string): Promise<{
        salesOrder: {
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
            paymentMethod: string;
            paymentTerm: string | null;
            chequeNumber: string | null;
            creditDueDate: Date | null;
            rejectionReason: string | null;
            cancellationReason: string | null;
            note: string | null;
        };
        invoice: {
            lines: ({
                product: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    organizationId: string;
                    barcode: string | null;
                    categoryId: string | null;
                    brandId: string | null;
                    unitId: string | null;
                    price: number;
                    cost: number;
                };
            } & {
                id: string;
                invoiceId: string;
                productId: string;
                quantity: number;
                unitPrice: number;
                discount: number;
                total: number;
            })[];
        } & {
            id: string;
            createdAt: Date;
            salesOrderId: string;
            organizationId: string;
            subtotal: number;
            taxRate: number;
            taxAmount: number;
            grandTotal: number;
            invoiceNumber: string;
            invoiceDate: Date;
            invoiceMakerId: string;
        };
        driver: {
            id: string;
            name: string | null;
        } | null;
    } & {
        id: string;
        customerName: string;
        deliveryAddress: string;
        customerPhone: string | null;
        status: import(".prisma/client").$Enums.DeliveryStatus;
        confirmationPath: string | null;
        confirmedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        salesOrderId: string;
        invoiceId: string;
        driverId: string | null;
        confirmedById: string | null;
    }>;
}
