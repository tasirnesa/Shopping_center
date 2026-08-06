import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, OrderStatusEvent, Prisma } from '@prisma/client';

@Injectable()
export class AuditService {
    constructor(private readonly prisma: PrismaService) { }

    async recordTransition(
        prismaClient: Prisma.TransactionClient | PrismaService,
        salesOrderId: string,
        previousStatus: OrderStatus | null,
        newStatus: OrderStatus,
        actorId: string,
        note?: string,
    ): Promise<OrderStatusEvent> {
        return prismaClient.orderStatusEvent.create({
            data: {
                salesOrderId,
                previousStatus,
                newStatus,
                actorId,
                note,
            },
        });
    }
}
