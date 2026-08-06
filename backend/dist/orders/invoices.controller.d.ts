import { PrismaService } from '../prisma/prisma.service';
export declare class InvoicesController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findOne(req: any, id: string): Promise<{
        salesOrder: {
            organizationId: string;
            branchId: string;
            id: string;
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
            rejectionReason: string | null;
            cancellationReason: string | null;
        };
        lines: {
            id: string;
            productId: string;
            discount: number;
            quantity: number;
            invoiceId: string;
            unitPrice: number;
            total: number;
        }[];
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
    }>;
    downloadPdf(req: any, id: string, res: any): Promise<void>;
}
