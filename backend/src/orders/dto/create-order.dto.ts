import {
    IsString,
    IsOptional,
    IsArray,
    ValidateNested,
    IsNumber,
    Min,
    IsNotEmpty,
    ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderLineDto {
    @IsString()
    @IsNotEmpty()
    productId!: string;

    @IsNumber()
    @Min(1)
    quantity!: number;

    @IsNumber()
    @Min(0)
    unitPrice!: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    discount?: number;
}

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    customerName!: string;

    @IsString()
    @IsNotEmpty()
    tin!: string;

    @IsString()
    @IsNotEmpty()
    deliveryAddress!: string;

    @IsString()
    @IsOptional()
    customerPhone?: string;

    @IsString()
    @IsNotEmpty()
    branchId!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => CreateOrderLineDto)
    lines!: CreateOrderLineDto[];
}
