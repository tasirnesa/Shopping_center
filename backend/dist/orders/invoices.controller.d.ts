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
    }>;
    printInvoice(req: any, id: string, res: any): Promise<void>;
}
