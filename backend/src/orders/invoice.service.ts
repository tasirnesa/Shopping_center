import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InvoiceService {
    constructor(private readonly prisma: PrismaService) { }

    async generateInvoice(
        prismaClient: Prisma.TransactionClient | PrismaService,
        salesOrder: any,
        invoiceMakerId: string,
        orgId: string,
    ) {
        // Step 1: Ensure the InvoiceSequence row exists for this org (no-op update if already there)
        await (prismaClient as any).invoiceSequence.upsert({
            where: { organizationId: orgId },
            update: {},
            create: { organizationId: orgId, lastNumber: 0 },
        });

        // Step 2: Atomically increment and read back the new sequence number
        const sequence = await (prismaClient as any).invoiceSequence.update({
            where: { organizationId: orgId },
            data: { lastNumber: { increment: 1 } },
        });

        const newNumber: number = sequence.lastNumber;
        const invoiceNumber = `INV-${String(newNumber).padStart(4, '0')}`;

        const subtotal: number = salesOrder.subtotal;
        const taxRate: number = salesOrder.taxRate;
        const taxAmount = subtotal * (taxRate / 100);
        const grandTotal = subtotal + taxAmount;

        const invoiceLines = (salesOrder.lines as any[]).map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            discount: line.discount ?? 0,
            total: line.total,
        }));

        const invoice = await (prismaClient as any).invoice.create({
            data: {
                salesOrderId: salesOrder.id,
                organizationId: orgId,
                invoiceNumber,
                invoiceMakerId,
                subtotal,
                taxRate,
                taxAmount,
                grandTotal,
                lines: {
                    create: invoiceLines,
                },
            },
            include: {
                lines: true,
            },
        });

        // ── Create a Sale record so the order appears in Sales history & dashboard ──
        // Stock is deducted during packing — we record the financial transaction at invoice generation.
        const sale = await (prismaClient as any).sale.create({
            data: {
                organizationId: orgId,
                branchId: salesOrder.branchId,
                customerId: salesOrder.customerId || null,
                subTotal: subtotal,
                discount: 0,
                totalAmount: grandTotal,
                details: {
                    create: invoiceLines.map((line) => ({
                        productId: line.productId,
                        quantity: line.quantity,
                        price: line.unitPrice,
                    })),
                },
            },
        });

        // Record payment linked to this sale
        await (prismaClient as any).payment.create({
            data: {
                referenceId: sale.id,
                referenceType: 'SALE',
                amount: grandTotal,
                method: 'INVOICE',
            },
        });

        return invoice;
    }
}
