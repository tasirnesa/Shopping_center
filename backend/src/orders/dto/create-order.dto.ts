import {
    IsString,
    IsOptional,
    IsArray,
    ValidateNested,
    IsNumber,
    Min,
    IsNotEmpty,
    ArrayMinSize,
    IsDate,
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

    @IsString()
    @IsOptional()
    customerId?: string;

    @IsString()
    @IsNotEmpty()
    paymentMethod!: string; // CASH, CHEQUE, CREDIT, CARD, TRANSFER

    @IsString()
    @IsOptional()
    paymentTerm?: string;

    @IsString()
    @IsOptional()
    chequeNumber?: string;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    creditDueDate?: Date;

    @IsString()
    @IsOptional()
    note?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => CreateOrderLineDto)
    lines!: CreateOrderLineDto[];
}
