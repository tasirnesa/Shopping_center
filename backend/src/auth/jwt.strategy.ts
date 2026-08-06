import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      // Accept token from Bearer header OR ?token= query param (for file downloads)
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => req?.query?.token as string ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { organization: true, branch: true },
      });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      if (user.status === 'INACTIVE') {
        throw new UnauthorizedException('Account is inactive');
      }
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
        branchId: user.branchId,
        organization: user.organization,
        branch: user.branch,
      };
    } catch (error) {
      // Re-throw UnauthorizedException as-is, wrap anything else
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
