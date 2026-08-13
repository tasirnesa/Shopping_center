import { PrismaService } from '../prisma/prisma.service';
export declare class InvoicesController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findOne(req: any, id: string): Promise<{
        salesOrder: {
            salesRep: {
                email: string;
                name: string | null;
            };
        } & {
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
            paymentMethod: string;
            paymentTerm: string | null;
            chequeNumber: string | null;
            creditDueDate: Date | null;
            rejectionReason: string | null;
            cancellationReason: string | null;
        };
        lines: ({
            product: {
                name: string;
                organizationId: string;
                id: string;
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
    printInvoice(req: any, id: string, res: any): Promise<void>;
}
