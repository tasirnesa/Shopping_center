import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class TransferStockDto {
  @IsUUID()
  fromBranchId!: string;

  @IsUUID()
  toBranchId!: string;

  @IsUUID()
  productId!: string;

  @IsNumber()
  @IsPositive({ message: 'Transfer quantity must be a positive number' })
  quantity!: number;
}
