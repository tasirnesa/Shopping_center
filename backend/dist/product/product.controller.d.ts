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
            name: string;
            organizationId: string;
            id: string;
            description: string | null;
        } | null;
        brand: {
            name: string;
            organizationId: string;
            id: string;
        } | null;
        unit: {
            name: string;
            organizationId: string;
            id: string;
        } | null;
    } & {
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        price: number;
        cost: number;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }>;
    findAll(orgId: string): Promise<({
        category: {
            name: string;
            organizationId: string;
            id: string;
            description: string | null;
        } | null;
        brand: {
            name: string;
            organizationId: string;
            id: string;
        } | null;
        unit: {
            name: string;
            organizationId: string;
            id: string;
        } | null;
    } & {
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        price: number;
        cost: number;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    })[]>;
    findByBarcode(orgId: string, barcode: string): Promise<({
        category: {
            name: string;
            organizationId: string;
            id: string;
            description: string | null;
        } | null;
        brand: {
            name: string;
            organizationId: string;
            id: string;
        } | null;
        unit: {
            name: string;
            organizationId: string;
            id: string;
        } | null;
    } & {
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        price: number;
        cost: number;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }) | null>;
    findOne(orgId: string, id: string): Promise<({
        category: {
            name: string;
            organizationId: string;
            id: string;
            description: string | null;
        } | null;
        brand: {
            name: string;
            organizationId: string;
            id: string;
        } | null;
        unit: {
            name: string;
            organizationId: string;
            id: string;
        } | null;
    } & {
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        price: number;
        cost: number;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }) | null>;
    update(orgId: string, id: string, dto: any): Promise<({
        category: {
            name: string;
            organizationId: string;
            id: string;
            description: string | null;
        } | null;
        brand: {
            name: string;
            organizationId: string;
            id: string;
        } | null;
        unit: {
            name: string;
            organizationId: string;
            id: string;
        } | null;
    } & {
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        price: number;
        cost: number;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }) | null>;
    remove(orgId: string, id: string): Promise<{
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        price: number;
        cost: number;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    } | null>;
}
