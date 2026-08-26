import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { organization: true, branch: true },
    });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      organizationId: user.organizationId,
      branchId: user.branchId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
        branchId: user.branchId,
        organization: user.organization
          ? {
              id: user.organization.id,
              name: user.organization.name,
              businessType: user.organization.businessType,
            }
          : null,
        branch: user.branch
          ? {
              id: user.branch.id,
              name: user.branch.name,
            }
          : null,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    try {
      // Validate organization exists (unless SYSTEM_ADMIN)
      if (registerDto.organizationId) {
        const org = await this.prisma.organization.findUnique({
          where: { id: registerDto.organizationId },
        });
        if (!org) {
          throw new BadRequestException('Invalid Organization ID.');
        }
      }

      // Validate branch exists and belongs to org
      if (registerDto.branchId) {
        const branch = await this.prisma.branch.findUnique({
          where: { id: registerDto.branchId },
        });
        if (!branch) {
          throw new BadRequestException('Invalid Branch ID.');
        }
        if (
          registerDto.organizationId &&
          branch.organizationId !== registerDto.organizationId
        ) {
          throw new BadRequestException(
            'Branch does not belong to the specified organization.',
          );
        }
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          name: registerDto.name,
          role: registerDto.role,
          organizationId: registerDto.organizationId,
          branchId: registerDto.branchId?.trim(),
        },
      });

      const { password, ...result } = user;
      return result;
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      if (error.code === 'P2002') {
        throw new BadRequestException('Email is already registered!');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid Organization or Branch ID.');
      }
      throw new InternalServerErrorException('Server Error: ' + error.message);
    }
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const passwordMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!passwordMatch) throw new BadRequestException('Current password is incorrect');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return { message: 'Password changed successfully' };
  }
}
