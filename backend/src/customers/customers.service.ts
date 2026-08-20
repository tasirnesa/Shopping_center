import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
    data: { name: string; phone?: string; email?: string; tin?: string; creditLimit?: number },
  ) {
    // Enforce TIN uniqueness within the org
    if (data.tin) {
      const existing = await this.prisma.customer.findFirst({
        where: { organizationId: orgId, tin: data.tin.trim() },
      });
      if (existing) {
        throw new ConflictException(`A customer with TIN "${data.tin}" already exists in your organization`);
      }
    }
    return this.prisma.customer.create({
      data: { ...data, organizationId: orgId },
    });
  }

  async update(
    orgId: string,
    id: string,
    data: { name?: string; phone?: string; email?: string; tin?: string; creditLimit?: number },
  ) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!customer) return null;

    // Enforce TIN uniqueness on update — exclude the current customer
    if (data.tin && data.tin.trim() !== customer.tin) {
      const existing = await this.prisma.customer.findFirst({
        where: { organizationId: orgId, tin: data.tin.trim(), NOT: { id } },
      });
      if (existing) {
        throw new ConflictException(`A customer with TIN "${data.tin}" already exists in your organization`);
      }
    }

    return this.prisma.customer.update({ where: { id }, data });
  }

  async remove(orgId: string, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!customer) return null;
    return this.prisma.customer.delete({ where: { id } });
  }

  /** Store the EFDA license path for a customer so future orders auto-attach it */
  async saveEfdaLicense(orgId: string, id: string, filePath: string, fileName: string) {
    const customer = await this.prisma.customer.findFirst({ where: { id, organizationId: orgId } });
    if (!customer) throw new NotFoundException('Customer not found');
    return this.prisma.customer.update({
      where: { id },
      data: { efdaLicensePath: filePath, efdaLicenseFileName: fileName },
    });
  }

  /** Get credit info for a customer */
  async getCredit(orgId: string, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, organizationId: orgId },
      select: { id: true, name: true, creditLimit: true, creditBalance: true },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  /** Increase credit balance (when order on credit is created) */
  async addCredit(orgId: string, customerId: string, amount: number) {
    const customer = await this.prisma.customer.findFirst({ where: { id: customerId, organizationId: orgId } });
    if (!customer) throw new NotFoundException('Customer not found');
    return this.prisma.customer.update({
      where: { id: customerId },
      data: { creditBalance: { increment: amount } },
    });
  }

  /** Reduce credit balance (when credit payment is received) */
  async settleCredit(orgId: string, customerId: string, amount: number) {
    const customer = await this.prisma.customer.findFirst({ where: { id: customerId, organizationId: orgId } });
    if (!customer) throw new NotFoundException('Customer not found');
    return this.prisma.customer.update({
      where: { id: customerId },
      data: { creditBalance: { decrement: amount } },
    });
  }
}
