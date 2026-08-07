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
            name: string;
            organizationId: string;
            description: string | null;
        } | null;
        brand: {
            id: string;
            name: string;
            organizationId: string;
        } | null;
        unit: {
            id: string;
            name: string;
            organizationId: string;
        } | null;
    } & {
        id: string;
        name: string;
        barcode: string | null;
        price: number;
        cost: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }>;
    findAll(orgId: string): Promise<({
        category: {
            id: string;
            name: string;
            organizationId: string;
            description: string | null;
        } | null;
        brand: {
            id: string;
            name: string;
            organizationId: string;
        } | null;
        unit: {
            id: string;
            name: string;
            organizationId: string;
        } | null;
    } & {
        id: string;
        name: string;
        barcode: string | null;
        price: number;
        cost: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    })[]>;
    findByBarcode(orgId: string, barcode: string): Promise<({
        category: {
            id: string;
            name: string;
            organizationId: string;
            description: string | null;
        } | null;
        brand: {
            id: string;
            name: string;
            organizationId: string;
        } | null;
        unit: {
            id: string;
            name: string;
            organizationId: string;
        } | null;
    } & {
        id: string;
        name: string;
        barcode: string | null;
        price: number;
        cost: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }) | null>;
    findOne(orgId: string, id: string): Promise<({
        category: {
            id: string;
            name: string;
            organizationId: string;
            description: string | null;
        } | null;
        brand: {
            id: string;
            name: string;
            organizationId: string;
        } | null;
        unit: {
            id: string;
            name: string;
            organizationId: string;
        } | null;
    } & {
        id: string;
        name: string;
        barcode: string | null;
        price: number;
        cost: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }) | null>;
    update(orgId: string, id: string, dto: any): Promise<({
        category: {
            id: string;
            name: string;
            organizationId: string;
            description: string | null;
        } | null;
        brand: {
            id: string;
            name: string;
            organizationId: string;
        } | null;
        unit: {
            id: string;
            name: string;
            organizationId: string;
        } | null;
    } & {
        id: string;
        name: string;
        barcode: string | null;
        price: number;
        cost: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }) | null>;
    remove(orgId: string, id: string): Promise<{
        id: string;
        name: string;
        barcode: string | null;
        price: number;
        cost: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    } | null>;
}
