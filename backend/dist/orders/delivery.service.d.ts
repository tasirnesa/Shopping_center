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
        status: import(".prisma/client").$Enums.DeliveryStatus;
        createdAt: Date;
        updatedAt: Date;
        salesOrderId: string;
        customerName: string;
        deliveryAddress: string;
        customerPhone: string | null;
        confirmationPath: string | null;
        confirmedAt: Date | null;
        invoiceId: string;
        driverId: string | null;
        confirmedById: string | null;
    }>;
    pickup(orderId: string, driverId: string, organizationId: string): Promise<{
        order: {
            id: string;
            organizationId: string;
            branchId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            updatedAt: Date;
            tin: string;
            customerId: string | null;
            taxRate: number;
            salesRepId: string;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            subtotal: number;
            taxAmount: number;
            grandTotal: number;
            paymentMethod: string;
            paymentTerm: string | null;
            chequeNumber: string | null;
            creditDueDate: Date | null;
            rejectionReason: string | null;
            cancellationReason: string | null;
        };
        delivery: {
            id: string;
            status: import(".prisma/client").$Enums.DeliveryStatus;
            createdAt: Date;
            updatedAt: Date;
            salesOrderId: string;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            confirmationPath: string | null;
            confirmedAt: Date | null;
            invoiceId: string;
            driverId: string | null;
            confirmedById: string | null;
        };
    }>;
    confirmDelivery(orderId: string, driverId: string, organizationId: string, confirmationPath?: string): Promise<{
        order: {
            id: string;
            organizationId: string;
            branchId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            updatedAt: Date;
            tin: string;
            customerId: string | null;
            taxRate: number;
            salesRepId: string;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            subtotal: number;
            taxAmount: number;
            grandTotal: number;
            paymentMethod: string;
            paymentTerm: string | null;
            chequeNumber: string | null;
            creditDueDate: Date | null;
            rejectionReason: string | null;
            cancellationReason: string | null;
        };
        delivery: {
            id: string;
            status: import(".prisma/client").$Enums.DeliveryStatus;
            createdAt: Date;
            updatedAt: Date;
            salesOrderId: string;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            confirmationPath: string | null;
            confirmedAt: Date | null;
            invoiceId: string;
            driverId: string | null;
            confirmedById: string | null;
        };
    }>;
    pickupByDeliveryId(deliveryId: string, driverId: string, organizationId: string): Promise<{
        order: {
            id: string;
            organizationId: string;
            branchId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            updatedAt: Date;
            tin: string;
            customerId: string | null;
            taxRate: number;
            salesRepId: string;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            subtotal: number;
            taxAmount: number;
            grandTotal: number;
            paymentMethod: string;
            paymentTerm: string | null;
            chequeNumber: string | null;
            creditDueDate: Date | null;
            rejectionReason: string | null;
            cancellationReason: string | null;
        };
        delivery: {
            id: string;
            status: import(".prisma/client").$Enums.DeliveryStatus;
            createdAt: Date;
            updatedAt: Date;
            salesOrderId: string;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            confirmationPath: string | null;
            confirmedAt: Date | null;
            invoiceId: string;
            driverId: string | null;
            confirmedById: string | null;
        };
    }>;
    confirmDeliveryById(deliveryId: string, driverId: string, organizationId: string, confirmationPath: string): Promise<{
        order: {
            id: string;
            organizationId: string;
            branchId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            updatedAt: Date;
            tin: string;
            customerId: string | null;
            taxRate: number;
            salesRepId: string;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            subtotal: number;
            taxAmount: number;
            grandTotal: number;
            paymentMethod: string;
            paymentTerm: string | null;
            chequeNumber: string | null;
            creditDueDate: Date | null;
            rejectionReason: string | null;
            cancellationReason: string | null;
        };
        delivery: {
            id: string;
            status: import(".prisma/client").$Enums.DeliveryStatus;
            createdAt: Date;
            updatedAt: Date;
            salesOrderId: string;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            confirmationPath: string | null;
            confirmedAt: Date | null;
            invoiceId: string;
            driverId: string | null;
            confirmedById: string | null;
        };
    }>;
    findAll(userId: string, role: Role, orgId: string): Promise<({
        salesOrder: {
            organizationId: string;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
        };
        invoice: {
            invoiceNumber: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.DeliveryStatus;
        createdAt: Date;
        updatedAt: Date;
        salesOrderId: string;
        customerName: string;
        deliveryAddress: string;
        customerPhone: string | null;
        confirmationPath: string | null;
        confirmedAt: Date | null;
        invoiceId: string;
        driverId: string | null;
        confirmedById: string | null;
    })[] | ({
        salesOrder: {
            organizationId: string;
            customerName: string;
            deliveryAddress: string;
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
        status: import(".prisma/client").$Enums.DeliveryStatus;
        createdAt: Date;
        updatedAt: Date;
        salesOrderId: string;
        customerName: string;
        deliveryAddress: string;
        customerPhone: string | null;
        confirmationPath: string | null;
        confirmedAt: Date | null;
        invoiceId: string;
        driverId: string | null;
        confirmedById: string | null;
    })[]>;
    findOne(id: string, userId: string, role: Role, orgId: string): Promise<{
        salesOrder: {
            id: string;
            organizationId: string;
            branchId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            updatedAt: Date;
            tin: string;
            customerId: string | null;
            taxRate: number;
            salesRepId: string;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            subtotal: number;
            taxAmount: number;
            grandTotal: number;
            paymentMethod: string;
            paymentTerm: string | null;
            chequeNumber: string | null;
            creditDueDate: Date | null;
            rejectionReason: string | null;
            cancellationReason: string | null;
        };
        invoice: {
            lines: ({
                product: {
                    id: string;
                    organizationId: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    barcode: string | null;
                    price: number;
                    cost: number;
                    categoryId: string | null;
                    brandId: string | null;
                    unitId: string | null;
                };
            } & {
                id: string;
                productId: string;
                discount: number;
                quantity: number;
                invoiceId: string;
                unitPrice: number;
                total: number;
            })[];
        } & {
            id: string;
            organizationId: string;
            createdAt: Date;
            taxRate: number;
            salesOrderId: string;
            subtotal: number;
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
        status: import(".prisma/client").$Enums.DeliveryStatus;
        createdAt: Date;
        updatedAt: Date;
        salesOrderId: string;
        customerName: string;
        deliveryAddress: string;
        customerPhone: string | null;
        confirmationPath: string | null;
        confirmedAt: Date | null;
        invoiceId: string;
        driverId: string | null;
        confirmedById: string | null;
    }>;
}
