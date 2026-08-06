import { UseGuards, applyDecorators } from '@nestjs/common';
import { OrderOwnerGuard } from './order-owner.guard';

/**
 * Convenience decorator that applies the OrderOwnerGuard.
 *
 * Usage:
 *   @OrderOwner()
 *   @Patch(':id')
 *   update(...) { ... }
 *
 * The guard passes through for non-SALES_REP roles and enforces
 * salesRepId === request.user.id for SALES_REP roles on routes with an `:id` param.
 */
export function OrderOwner() {
  return applyDecorators(UseGuards(OrderOwnerGuard));
}
