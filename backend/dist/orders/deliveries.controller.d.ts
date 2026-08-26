import { DeliveryService } from './delivery.service';
import { FileUploadService } from './file-upload.service';
export declare class DeliveriesController {
    private readonly deliveryService;
    private readonly fileUploadService;
    constructor(deliveryService: DeliveryService, fileUploadService: FileUploadService);
    findAll(req: any): Promise<({
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
    findOne(req: any, id: string): Promise<{
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
    pickup(req: any, id: string): Promise<{
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
    confirmDelivery(req: any, id: string, file: Express.Multer.File): Promise<{
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
    confirmDeliveryNote(req: any, id: string, body: {
        note?: string;
    }): Promise<{
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
}
