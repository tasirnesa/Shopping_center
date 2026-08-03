import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateExpenseDto {
  @IsUUID()
  branchId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description!: string;

  @IsNumber()
  @IsPositive({ message: 'Amount must be a positive number' })
  amount!: number;

  @IsDateString()
  @IsOptional()
  date?: string;
}
