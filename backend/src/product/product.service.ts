import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.ProductCreateInput) {
        return this.prisma.product.create({ data });
    }

    async findAll() {
        return this.prisma.product.findMany();
    }

    async findOne(id: string) {
        return this.prisma.product.findUnique({ where: { id } });
    }

    async findByBarcode(barcode: string) {
        return this.prisma.product.findUnique({ where: { barcode } });
    }

    async update(id: string, data: Prisma.ProductUpdateInput) {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.product.delete({ where: { id } });
    }
}
