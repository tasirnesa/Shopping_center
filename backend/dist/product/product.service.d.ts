import { PrismaService } from '../prisma/prisma.service';
export declare class ProductService {
    private prisma;
    constructor(prisma: PrismaService);
    create(orgId: string, data: {
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
        organizationId: string;
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
        organizationId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        price: number;
        cost: number;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    })[]>;
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
        organizationId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        price: number;
        cost: number;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }) | null>;
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
        organizationId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        price: number;
        cost: number;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }) | null>;
    update(orgId: string, id: string, data: any): Promise<({
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
        organizationId: string;
        name: string;
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
        id: string;
        organizationId: string;
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
}
