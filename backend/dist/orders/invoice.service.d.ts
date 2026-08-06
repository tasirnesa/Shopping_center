import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class InvoiceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    generateInvoice(prismaClient: Prisma.TransactionClient | PrismaService, salesOrder: any, invoiceMakerId: string, orgId: string): Promise<any>;
}
