"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InvoiceService = class InvoiceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateInvoice(prismaClient, salesOrder, invoiceMakerId, orgId) {
        await prismaClient.invoiceSequence.upsert({
            where: { organizationId: orgId },
            update: {},
            create: { organizationId: orgId, lastNumber: 0 },
        });
        const sequence = await prismaClient.invoiceSequence.update({
            where: { organizationId: orgId },
            data: { lastNumber: { increment: 1 } },
        });
        const newNumber = sequence.lastNumber;
        const invoiceNumber = `INV-${String(newNumber).padStart(4, '0')}`;
        const subtotal = salesOrder.subtotal;
        const taxRate = salesOrder.taxRate;
        const taxAmount = subtotal * (taxRate / 100);
        const grandTotal = subtotal + taxAmount;
        const invoiceLines = salesOrder.lines.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            discount: line.discount ?? 0,
            total: line.total,
        }));
        const invoice = await prismaClient.invoice.create({
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
        const sale = await prismaClient.sale.create({
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
        await prismaClient.payment.create({
            data: {
                referenceId: sale.id,
                referenceType: 'SALE',
                amount: grandTotal,
                method: 'INVOICE',
            },
        });
        return invoice;
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map