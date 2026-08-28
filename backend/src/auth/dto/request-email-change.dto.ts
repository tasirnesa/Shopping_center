import { IsEmail, IsString, MinLength } from 'class-validator';

export class RequestEmailChangeDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  newEmail: string;

  @IsString()
  @MinLength(5, { message: 'Please provide a clearer reason (min 5 characters)' })
  reason: string;
}
