import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty({ message: 'Supplier name is required' })
  name!: string;

  @IsString()
  @IsOptional()
  contact?: string;

  @IsEmail({}, { message: 'Invalid email address' })
  @IsOptional()
  email?: string;
}
