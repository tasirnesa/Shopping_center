import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) { }

  private saleInclude = {
    details: { include: { product: true } },
    organization: true,
    branch: true,
    customer: true,
    returns: { include: { details: true } },
  } as const;

  async create(
    orgId: string,
    data: {
      customerId?: string;
      discount?: number;
      paymentMethod?: string;
      details: { productId: string; quantity: number; price: number }[];
      branchId: string;
    },
  ) {
    if (!data.details || data.details.length === 0) {
      throw new BadRequestException('Cannot create empty sale');
    }

    return this.prisma.$transaction(async (tx) => {
      let subTotal = 0;

      for (const item of data.details) {
        const product = await tx.product.findFirst({
          where: { id: item.productId, organizationId: orgId },
        });
        if (!product)
          throw new BadRequestException(`Product ${item.productId} not found`);

        const stock = await tx.stockBalance.findFirst({
          where: { branchId: data.branchId, productId: item.productId },
        });

        if (!stock || stock.quantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.name}`,
          );
        }

        subTotal += item.price * item.quantity;
      }

      const discount = data.discount || 0;
      const totalAmount = subTotal - discount;

      const sale = await tx.sale.create({
        data: {
          organizationId: orgId,
          branchId: data.branchId,
          customerId: data.customerId,
          subTotal,
          discount,
          totalAmount,
          details: {
            create: data.details.map((d) => ({
              productId: d.productId,
              quantity: d.quantity,
              price: d.price,
            })),
          },
        },
        include: this.saleInclude,
      });

      // Record payment
      await tx.payment.create({
        data: {
          referenceId: sale.id,
          referenceType: 'SALE',
          amount: totalAmount,
          method: data.paymentMethod || 'CASH',
        },
      });

      for (const item of data.details) {
        await tx.stockBalance.updateMany({
          where: { branchId: data.branchId, productId: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });

        await tx.inventoryTransaction.create({
          data: {
            productId: item.productId,
            branchId: data.branchId,
            type: 'OUT',
            quantity: item.quantity,
            reference: `SALE_${sale.id}`,
          },
        });
      }

      return sale;
    });
  }

  async findAll(orgId: string) {
    return this.prisma.sale.findMany({
      where: { organizationId: orgId },
      include: this.saleInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(orgId: string, id: string) {
    return this.prisma.sale.findFirst({
      where: { id, organizationId: orgId },
      include: this.saleInclude,
    });
  }

  async processReturn(
    orgId: string,
    data: {
      saleId: string;
      branchId: string;
      details: { productId: string; quantity: number; price: number }[];
    },
  ) {
    if (!data.details || data.details.length === 0) {
      throw new BadRequestException('Cannot process empty return');
    }

    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findFirst({
        where: { id: data.saleId, organizationId: orgId },
        include: { details: true },
      });

      if (!sale) throw new BadRequestException('Sale not found');

      let totalRefund = 0;

      for (const item of data.details) {
        totalRefund += item.price * item.quantity;
      }

      const ret = await tx.return.create({
        data: {
          saleId: data.saleId,
          totalRefund,
          details: {
            create: data.details.map((d) => ({
              productId: d.productId,
              quantity: d.quantity,
              price: d.price,
            })),
          },
        },
        include: { details: true },
      });

      for (const item of data.details) {
        const stock = await tx.stockBalance.findFirst({
          where: { branchId: data.branchId, productId: item.productId },
        });

        if (stock) {
          await tx.stockBalance.update({
            where: { id: stock.id },
            data: { quantity: { increment: item.quantity } },
          });
        } else {
          await tx.stockBalance.create({
            data: {
              branchId: data.branchId,
              productId: item.productId,
              quantity: item.quantity,
            },
          });
        }

        await tx.inventoryTransaction.create({
          data: {
            productId: item.productId,
            branchId: data.branchId,
            type: 'IN',
            quantity: item.quantity,
            reference: `RETURN_${ret.id}`,
          },
        });
      }

      return ret;
    });
  }
}
