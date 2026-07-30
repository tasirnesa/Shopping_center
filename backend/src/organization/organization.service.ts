import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.organization.findMany({
      include: {
        branches: true,
        settings: true,
        _count: { select: { users: true, products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        branches: true,
        settings: true,
        _count: { select: { users: true, products: true, sales: true } },
      },
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async create(data: {
    name: string;
    businessType?: string;
    tin?: string;
    phone?: string;
    email?: string;
    address?: string;
  }) {
    return this.prisma.organization.create({
      data: {
        ...data,
        settings: {
          create: {
            currency: 'ETB',
            taxRate: 15,
          },
        },
      },
      include: { settings: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.organization.update({
      where: { id },
      data,
      include: { settings: true },
    });
  }

  async updateSettings(
    orgId: string,
    data: {
      currency?: string;
      taxRate?: number;
      receiptFooter?: string;
      language?: string;
      fiscalYear?: string;
      timezone?: string;
    },
  ) {
    return this.prisma.organizationSettings.upsert({
      where: { organizationId: orgId },
      update: data,
      create: { organizationId: orgId, ...data },
    });
  }

  async getSettings(orgId: string) {
    return this.prisma.organizationSettings.findUnique({
      where: { organizationId: orgId },
    });
  }

  async remove(id: string) {
    return this.prisma.organization.delete({ where: { id } });
  }
}
