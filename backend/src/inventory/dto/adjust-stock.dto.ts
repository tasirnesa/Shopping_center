import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class AdjustStockDto {
  @IsUUID()
  productId!: string;

  @IsUUID()
  branchId!: string;

  @IsNumber()
  @IsNotEmpty()
  quantityChange!: number; // positive = add, negative = subtract

  @IsString()
  @IsNotEmpty({ message: 'Reason is required for stock adjustments' })
  reason!: string;
}
