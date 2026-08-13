import {
    IsString,
    IsOptional,
    IsArray,
    ValidateNested,
    IsNumber,
    Min,
    ArrayMinSize,
    IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderLineDto } from './create-order.dto';

/**
 * All fields are optional — only DRAFT orders may be updated.
 * Mirrors CreateOrderDto with every field marked @IsOptional().
 */
export class UpdateOrderDto {
    @IsOptional()
    @IsString()
    customerName?: string;

    @IsOptional()
    @IsString()
    tin?: string;

    @IsOptional()
    @IsString()
    deliveryAddress?: string;

    @IsOptional()
    @IsString()
    customerPhone?: string;

    @IsOptional()
    @IsString()
    branchId?: string;

    @IsOptional()
    @IsString()
    customerId?: string;

    @IsOptional()
    @IsString()
    paymentMethod?: string;

    @IsOptional()
    @IsString()
    paymentTerm?: string;

    @IsOptional()
    @IsString()
    chequeNumber?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    creditDueDate?: Date;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => CreateOrderLineDto)
    lines?: CreateOrderLineDto[];
}
