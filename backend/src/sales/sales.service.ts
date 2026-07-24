import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SalesService {
    constructor(private prisma: PrismaService) { }

    private saleInclude = {
        details: { include: { product: true } },
        shop: true,
        customer: true,
    } as const;

    async create(data: Prisma.SaleCreateInput) {
        return this.prisma.sale.create({ data, include: this.saleInclude });
    }

    async findAll() {
        return this.prisma.sale.findMany({
            include: this.saleInclude,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.sale.findUnique({ where: { id }, include: this.saleInclude });
    }
}
