import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class SalesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.SaleCreateInput): Promise<{
        details: {
            id: string;
            price: number;
            saleId: string;
            productId: string;
            quantity: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        shopId: string;
        totalAmount: number;
        customerId: string | null;
    }>;
    findAll(): Promise<({
        details: {
            id: string;
            price: number;
            saleId: string;
            productId: string;
            quantity: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        shopId: string;
        totalAmount: number;
        customerId: string | null;
    })[]>;
    findOne(id: string): Promise<({
        details: {
            id: string;
            price: number;
            saleId: string;
            productId: string;
            quantity: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        shopId: string;
        totalAmount: number;
        customerId: string | null;
    }) | null>;
}
