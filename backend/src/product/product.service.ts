import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) { }

  async create(
    orgId: string,
    data: {
      name: string;
      barcode?: string;
      categoryId?: string;
      brandId?: string;
      unitId?: string;
      price: number;
      cost: number;
    },
  ) {
    return this.prisma.product.create({
      data: { ...data, organizationId: orgId },
      include: { category: true, brand: true, unit: true },
    });
  }

  async findAll(orgId: string) {
    return this.prisma.product.findMany({
      where: { organizationId: orgId },
      include: { category: true, brand: true, unit: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(orgId: string, id: string) {
    return this.prisma.product.findFirst({
      where: { id, organizationId: orgId },
      include: { category: true, brand: true, unit: true },
    });
  }

  async findByBarcode(orgId: string, barcode: string) {
    return this.prisma.product.findFirst({
      where: { barcode, organizationId: orgId },
      include: { category: true, brand: true, unit: true },
    });
  }

  async update(orgId: string, id: string, data: any) {
    // Ensure we only update products belonging to this org
    const product = await this.prisma.product.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!product) return null;

    // Log price change if price is being updated
    if (data.price !== undefined && data.price !== product.price) {
      await this.prisma.priceHistory.create({
        data: {
          productId: id,
          oldPrice: product.price,
          newPrice: data.price,
        },
      });
    }

    return this.prisma.product.update({
      where: { id },
      data,
      include: { category: true, brand: true, unit: true },
    });
  }

  async remove(orgId: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!product) return null;

    return this.prisma.product.delete({ where: { id } });
  }
}
