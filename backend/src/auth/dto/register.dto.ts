import { Role } from '@prisma/client';

export class RegisterDto {
  email!: string;
  password!: string;
  name?: string;
  role!: Role;
  organizationId?: string;
  branchId?: string;
}
