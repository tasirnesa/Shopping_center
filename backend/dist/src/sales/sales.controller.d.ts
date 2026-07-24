import { SalesService } from './sales.service';
import { Prisma } from '@prisma/client';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: Prisma.SaleCreateInput): Promise<{
        shop: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            ownerId: string;
        };
        customer: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
        } | null;
        details: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                barcode: string | null;
                price: number;
                cost: number;
                categoryId: string | null;
                brandId: string | null;
                unitId: string | null;
            };
        } & {
            id: string;
            price: number;
            saleId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        shopId: string;
        totalAmount: number;
        customerId: string | null;
    }>;
    findAll(): Promise<({
        shop: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            ownerId: string;
        };
        customer: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
        } | null;
        details: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                barcode: string | null;
                price: number;
                cost: number;
                categoryId: string | null;
                brandId: string | null;
                unitId: string | null;
            };
        } & {
            id: string;
            price: number;
            saleId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        shopId: string;
        totalAmount: number;
        customerId: string | null;
    })[]>;
    findOne(id: string): Promise<({
        shop: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            ownerId: string;
        };
        customer: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
        } | null;
        details: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                barcode: string | null;
                price: number;
                cost: number;
                categoryId: string | null;
                brandId: string | null;
                unitId: string | null;
            };
        } & {
            id: string;
            price: number;
            saleId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        shopId: string;
        totalAmount: number;
        customerId: string | null;
    }) | null>;
}
