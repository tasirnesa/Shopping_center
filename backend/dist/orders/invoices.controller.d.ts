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
            organizationId: string;
            id: string;
            branchId: string;
            customerId: string | null;
            createdAt: Date;
            updatedAt: Date;
            salesRepId: string;
            customerName: string;
            tin: string;
            deliveryAddress: string;
            customerPhone: string | null;
            status: import(".prisma/client").$Enums.OrderStatus;
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
        lines: ({
            product: {
                organizationId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
            discount: number;
            productId: string;
            quantity: number;
            invoiceId: string;
            unitPrice: number;
            total: number;
        })[];
    } & {
        organizationId: string;
        id: string;
        createdAt: Date;
        subtotal: number;
        taxRate: number;
        taxAmount: number;
        grandTotal: number;
        salesOrderId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        invoiceMakerId: string;
    }>;
    printInvoice(req: any, id: string, res: any): Promise<void>;
}
