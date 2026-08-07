import { PrismaService } from '../prisma/prisma.service';
export declare class InvoicesController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findOne(req: any, id: string): Promise<{
        salesOrder: {
            salesRep: {
                name: string | null;
                email: string;
            };
        } & {
            id: string;
            customerName: string;
            tin: string;
            deliveryAddress: string;
            customerPhone: string | null;
            status: import(".prisma/client").$Enums.OrderStatus;
            subtotal: number;
            taxRate: number;
            taxAmount: number;
            grandTotal: number;
            rejectionReason: string | null;
            cancellationReason: string | null;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            branchId: string;
            salesRepId: string;
            customerId: string | null;
        };
        lines: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                organizationId: string;
                name: string;
                barcode: string | null;
                categoryId: string | null;
                brandId: string | null;
                unitId: string | null;
                price: number;
                cost: number;
            };
        } & {
            id: string;
            quantity: number;
            unitPrice: number;
            discount: number;
            total: number;
            productId: string;
            invoiceId: string;
        })[];
    } & {
        id: string;
        subtotal: number;
        taxRate: number;
        taxAmount: number;
        grandTotal: number;
        createdAt: Date;
        organizationId: string;
        salesOrderId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        invoiceMakerId: string;
    }>;
    printInvoice(req: any, id: string, res: any): Promise<void>;
}
