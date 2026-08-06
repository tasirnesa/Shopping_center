import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, OrderStatusEvent, Prisma } from '@prisma/client';
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    recordTransition(prismaClient: Prisma.TransactionClient | PrismaService, salesOrderId: string, previousStatus: OrderStatus | null, newStatus: OrderStatus, actorId: string, note?: string): Promise<OrderStatusEvent>;
}
