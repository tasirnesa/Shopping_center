import { ProductService } from './product.service';
import { Prisma } from '@prisma/client';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: Prisma.ProductCreateInput): Promise<{
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
    update(id: string, updateProductDto: Prisma.ProductUpdateInput): Promise<{
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
