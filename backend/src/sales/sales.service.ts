import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SalesService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.SaleCreateInput) {
        return this.prisma.sale.create({ data, include: { details: true } });
    }

    async findAll() {
        return this.prisma.sale.findMany({ include: { details: true } });
    }

    async findOne(id: string) {
        return this.prisma.sale.findUnique({ where: { id }, include: { details: true } });
    }
}
