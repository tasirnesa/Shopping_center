import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class FoundationService {
  constructor(private prisma: PrismaService) { }

  // ───── Categories ─────
  async getCategories(orgId: string) {
    return this.prisma.category.findMany({
      where: { organizationId: orgId },
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(
    orgId: string,
    data: { name: string; description?: string },
  ) {
    return this.prisma.category.create({
      data: { ...data, organizationId: orgId },
    });
  }

  async deleteCategory(orgId: string, id: string) {
    return this.prisma.category.deleteMany({
      where: { id, organizationId: orgId },
    });
  }

  // ───── Brands ─────
  async getBrands(orgId: string) {
    return this.prisma.brand.findMany({
      where: { organizationId: orgId },
      orderBy: { name: 'asc' },
    });
  }

  async createBrand(orgId: string, data: { name: string }) {
    return this.prisma.brand.create({
      data: { ...data, organizationId: orgId },
    });
  }

  async deleteBrand(orgId: string, id: string) {
    return this.prisma.brand.deleteMany({
      where: { id, organizationId: orgId },
    });
  }

  // ───── Units ─────
  async getUnits(orgId: string) {
    return this.prisma.unit.findMany({
      where: { organizationId: orgId },
      orderBy: { name: 'asc' },
    });
  }

  async createUnit(orgId: string, data: { name: string }) {
    return this.prisma.unit.create({
      data: { ...data, organizationId: orgId },
    });
  }

  async deleteUnit(orgId: string, id: string) {
    return this.prisma.unit.deleteMany({
      where: { id, organizationId: orgId },
    });
  }

  // ───── Branches ─────
  async getBranches(orgId: string) {
    return this.prisma.branch.findMany({
      where: { organizationId: orgId },
      orderBy: { name: 'asc' },
    });
  }

  async createBranch(
    orgId: string,
    data: { name: string; code?: string; phone?: string; address?: string },
  ) {
    return this.prisma.branch.create({
      data: { ...data, organizationId: orgId },
    });
  }

  async updateBranch(
    orgId: string,
    id: string,
    data: { name?: string; code?: string; phone?: string; address?: string },
  ) {
    const branch = await this.prisma.branch.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!branch) throw new NotFoundException('Branch not found');
    return this.prisma.branch.update({ where: { id }, data });
  }

  async deleteBranch(orgId: string, id: string) {
    const branch = await this.prisma.branch.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!branch) throw new NotFoundException('Branch not found');
    return this.prisma.branch.delete({ where: { id } });
  }

  // ───── Users (Org-scoped) ─────
  async createUser(data: { email: string; password: string; name?: string; role: any; organizationId: string; branchId?: string }) {
    const bcrypt = await import('bcrypt');
    const hashed = await bcrypt.hash(data.password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashed,
          name: data.name,
          role: data.role,
          organizationId: data.organizationId,
          branchId: data.branchId ?? null,
        },
      });
      const { password, ...result } = user as any;
      return result;
    } catch (e: any) {
      if (e.code === 'P2002') throw new BadRequestException('Email already registered');
      throw e;
    }
  }

  async getUsers(orgId?: string) {
    return this.prisma.user.findMany({
      where: orgId ? { organizationId: orgId } : undefined,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        branchId: true,
        branch: { select: { id: true, name: true } },
        organization: { select: { id: true, name: true } },
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUserRole(orgId: string, id: string, role: Role) {
    return this.prisma.user.updateMany({
      where: { id, organizationId: orgId },
      data: { role },
    });
  }

  async updateUserStatus(orgId: string, id: string, status: string) {
    return this.prisma.user.updateMany({
      where: { id, organizationId: orgId },
      data: { status },
    });
  }

  async updateUserEmail(orgId: string, id: string, email: string) {
    try {
      return await this.prisma.user.updateMany({
        where: { id, organizationId: orgId },
        data: { email },
      });
    } catch (e: any) {
      if (e.code === 'P2002') throw new BadRequestException('Email already registered');
      throw e;
    }
  }

  // ───── Org Settings ─────
  async getSettings(orgId: string) {
    const settings = await this.prisma.organizationSettings.findUnique({
      where: { organizationId: orgId },
    });
    // Return defaults if not yet configured
    return settings ?? {
      currency: 'ETB', taxRate: 15, timezone: 'Africa/Addis_Ababa',
      receiptFooter: null, language: 'en', fiscalYear: null,
    };
  }

  async updateSettings(orgId: string, data: {
    currency?: string; taxRate?: number; timezone?: string;
    receiptFooter?: string | null; language?: string; fiscalYear?: string | null;
  }) {
    return this.prisma.organizationSettings.upsert({
      where:  { organizationId: orgId },
      create: { organizationId: orgId, ...data },
      update: data,
    });
  }
}
