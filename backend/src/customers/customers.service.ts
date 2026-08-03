import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(orgId: string) {
    return this.prisma.customer.findMany({
      where: { organizationId: orgId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(orgId: string, id: string) {
    return this.prisma.customer.findFirst({
      where: { id, organizationId: orgId },
    });
  }

  async create(
    orgId: string,
    data: { name: string; phone?: string; email?: string },
  ) {
    return this.prisma.customer.create({
      data: { ...data, organizationId: orgId },
    });
  }

  async update(
    orgId: string,
    id: string,
    data: { name?: string; phone?: string; email?: string },
  ) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!customer) return null;

    return this.prisma.customer.update({ where: { id }, data });
  }

  async remove(orgId: string, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!customer) return null;

    return this.prisma.customer.delete({ where: { id } });
  }
}
