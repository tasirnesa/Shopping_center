import { ProductService } from './product.service';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(orgId: string, dto: {
        name: string;
        barcode?: string;
        categoryId?: string;
        brandId?: string;
        unitId?: string;
        price: number;
        cost: number;
    }): Promise<{
        category: {
            id: string;
            organizationId: string;
            name: string;
            description: string | null;
        } | null;
        brand: {
            id: string;
            organizationId: string;
            name: string;
        } | null;
        unit: {
            id: string;
            organizationId: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        barcode: string | null;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
        price: number;
        cost: number;
    }>;
    findAll(orgId: string): Promise<({
        category: {
            id: string;
            organizationId: string;
            name: string;
            description: string | null;
        } | null;
        brand: {
            id: string;
            organizationId: string;
            name: string;
        } | null;
        unit: {
            id: string;
            organizationId: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        barcode: string | null;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
        price: number;
        cost: number;
    })[]>;
    findByBarcode(orgId: string, barcode: string): Promise<({
        category: {
            id: string;
            organizationId: string;
            name: string;
            description: string | null;
        } | null;
        brand: {
            id: string;
            organizationId: string;
            name: string;
        } | null;
        unit: {
            id: string;
            organizationId: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        barcode: string | null;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
        price: number;
        cost: number;
    }) | null>;
    findOne(orgId: string, id: string): Promise<({
        category: {
            id: string;
            organizationId: string;
            name: string;
            description: string | null;
        } | null;
        brand: {
            id: string;
            organizationId: string;
            name: string;
        } | null;
        unit: {
            id: string;
            organizationId: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        barcode: string | null;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
        price: number;
        cost: number;
    }) | null>;
    update(orgId: string, id: string, dto: any): Promise<({
        category: {
            id: string;
            organizationId: string;
            name: string;
            description: string | null;
        } | null;
        brand: {
            id: string;
            organizationId: string;
            name: string;
        } | null;
        unit: {
            id: string;
            organizationId: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        barcode: string | null;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
        price: number;
        cost: number;
    }) | null>;
    remove(orgId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        barcode: string | null;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
        price: number;
        cost: number;
    } | null>;
}
