import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseDetailDto {
  @IsUUID()
  productId!: string;

  @IsNumber()
  @IsPositive({ message: 'Quantity must be a positive number' })
  quantity!: number;

  @IsNumber()
  @IsPositive({ message: 'Cost must be a positive number' })
  cost!: number;
}

export class CreatePurchaseDto {
  @IsUUID()
  supplierId!: string;

  @IsUUID()
  branchId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseDetailDto)
  details!: CreatePurchaseDetailDto[];
}
