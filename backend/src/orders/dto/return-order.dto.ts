import { IsOptional, IsString, MinLength } from 'class-validator';

export class ReturnOrderDto {
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Return reason must be at least 10 characters' })
  reason?: string;
}
