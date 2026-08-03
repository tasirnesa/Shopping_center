import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async findAll(orgId: string, branchId?: string) {
    return this.prisma.expense.findMany({
      where: {
        organizationId: orgId,
        ...(branchId ? { branchId } : {}),
      },
      include: { branch: true },
      orderBy: { date: 'desc' },
    });
  }

  async create(
    orgId: string,
    data: { branchId: string; description: string; amount: number; date?: string },
  ) {
    return this.prisma.expense.create({
      data: {
        organizationId: orgId,
        branchId: data.branchId,
        description: data.description,
        amount: data.amount,
        date: data.date ? new Date(data.date) : new Date(),
      },
      include: { branch: true },
    });
  }

  async remove(orgId: string, id: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!expense) throw new NotFoundException('Expense not found');
    return this.prisma.expense.delete({ where: { id } });
  }

  async summary(orgId: string) {
    const expenses = await this.prisma.expense.findMany({
      where: { organizationId: orgId },
    });
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const thisMonth = expenses
      .filter((e) => {
        const now = new Date();
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, e) => sum + e.amount, 0);
    return { total, thisMonth, count: expenses.length };
  }
}
