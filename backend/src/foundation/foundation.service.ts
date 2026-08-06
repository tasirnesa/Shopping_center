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
}
