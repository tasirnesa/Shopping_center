import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Guard that enforces SALES_REP ownership of a SalesOrder.
 *
 * - Non-SALES_REP roles pass through immediately (other guards handle their access).
 * - SALES_REP on a route without an `:id` param passes through (e.g. POST /orders creation).
 * - SALES_REP on a route with `:id` must own the order (salesRepId === request.user.id).
 *
 * Validates: Requirements 1.7, 6.7
 */
@Injectable()
export class OrderOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Only enforce ownership for SALES_REP; all other roles are handled by RolesGuard
    if (user?.role !== Role.SALES_REP) {
      return true;
    }

    const orderId: string | undefined = request.params?.id;

    // No order ID in the route (e.g. POST /orders for creation) — ownership not applicable yet
    if (!orderId) {
      return true;
    }

    const salesOrder = await this.prisma.salesOrder.findUnique({
      where: { id: orderId },
      select: { salesRepId: true },
    });

    if (!salesOrder) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (salesOrder.salesRepId !== user.id) {
      throw new ForbiddenException('You do not have permission to access this order');
    }

    return true;
  }
}
