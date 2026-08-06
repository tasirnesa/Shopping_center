import { IsOptional, IsString, MinLength } from 'class-validator';

/**
 * DTO for cancelling a Sales Order.
 *
 * - SALES_REP: reason is optional (cancelling own DRAFT/SUBMITTED order, no reason required).
 * - MANAGER: reason is required with a minimum length of 10 characters (Requirement 5.2).
 *   Enforcement is done at the service layer since the required/optional distinction depends on role.
 */
export class CancelOrderDto {
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Cancellation reason must be at least 10 characters' })
  reason?: string;
}
