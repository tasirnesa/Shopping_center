import { SalesService } from './sales.service';
import { Prisma } from '@prisma/client';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: Prisma.SaleCreateInput): Promise<{
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
