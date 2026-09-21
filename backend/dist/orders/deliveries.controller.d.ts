import { DeliveryService } from './delivery.service';
import { FileUploadService } from './file-upload.service';
export declare class DeliveriesController {
    private readonly deliveryService;
    private readonly fileUploadService;
    constructor(deliveryService: DeliveryService, fileUploadService: FileUploadService);
    findAll(req: any): Promise<({
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
        createdAt: Date;
        status: import(".prisma/client").$Enums.DeliveryStatus;
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
            name: string | null;
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.DeliveryStatus;
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
    findOne(req: any, id: string): Promise<{
        salesOrder: {
            organizationId: string;
            branchId: string;
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            updatedAt: Date;
            tin: string;
            taxRate: number;
            note: string | null;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            salesRepId: string;
            customerId: string | null;
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
                    organizationId: string;
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
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
            organizationId: string;
            id: string;
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
            name: string | null;
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.DeliveryStatus;
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
    pickup(req: any, id: string): Promise<{
        order: {
            organizationId: string;
            branchId: string;
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            updatedAt: Date;
            tin: string;
            taxRate: number;
            note: string | null;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            salesRepId: string;
            customerId: string | null;
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
            createdAt: Date;
            status: import(".prisma/client").$Enums.DeliveryStatus;
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
    confirmDelivery(req: any, id: string, file: Express.Multer.File): Promise<{
        order: {
            organizationId: string;
            branchId: string;
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            updatedAt: Date;
            tin: string;
            taxRate: number;
            note: string | null;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            salesRepId: string;
            customerId: string | null;
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
            createdAt: Date;
            status: import(".prisma/client").$Enums.DeliveryStatus;
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
    confirmDeliveryNote(req: any, id: string, body: {
        note?: string;
    }): Promise<{
        order: {
            organizationId: string;
            branchId: string;
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            updatedAt: Date;
            tin: string;
            taxRate: number;
            note: string | null;
            customerName: string;
            deliveryAddress: string;
            customerPhone: string | null;
            salesRepId: string;
            customerId: string | null;
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
            createdAt: Date;
            status: import(".prisma/client").$Enums.DeliveryStatus;
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
}
