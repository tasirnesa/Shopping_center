import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class ProductService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ProductCreateInput): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        price: number;
        cost: number;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        price: number;
        cost: number;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        price: number;
        cost: number;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    } | null>;
    findByBarcode(barcode: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        price: number;
        cost: number;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    } | null>;
    update(id: string, data: Prisma.ProductUpdateInput): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        price: number;
        cost: number;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        price: number;
        cost: number;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }>;
}
