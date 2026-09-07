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
            organizationId: string;
            name: string;
            id: string;
            description: string | null;
        } | null;
        brand: {
            organizationId: string;
            name: string;
            id: string;
        } | null;
        unit: {
            organizationId: string;
            name: string;
            id: string;
        } | null;
    } & {
        organizationId: string;
        name: string;
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
            organizationId: string;
            name: string;
            id: string;
            description: string | null;
        } | null;
        brand: {
            organizationId: string;
            name: string;
            id: string;
        } | null;
        unit: {
            organizationId: string;
            name: string;
            id: string;
        } | null;
    } & {
        organizationId: string;
        name: string;
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
    findOne(orgId: string, id: string): Promise<({
        category: {
            organizationId: string;
            name: string;
            id: string;
            description: string | null;
        } | null;
        brand: {
            organizationId: string;
            name: string;
            id: string;
        } | null;
        unit: {
            organizationId: string;
            name: string;
            id: string;
        } | null;
    } & {
        organizationId: string;
        name: string;
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
    findByBarcode(orgId: string, barcode: string): Promise<({
        category: {
            organizationId: string;
            name: string;
            id: string;
            description: string | null;
        } | null;
        brand: {
            organizationId: string;
            name: string;
            id: string;
        } | null;
        unit: {
            organizationId: string;
            name: string;
            id: string;
        } | null;
    } & {
        organizationId: string;
        name: string;
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
    update(orgId: string, id: string, data: any): Promise<({
        category: {
            organizationId: string;
            name: string;
            id: string;
            description: string | null;
        } | null;
        brand: {
            organizationId: string;
            name: string;
            id: string;
        } | null;
        unit: {
            organizationId: string;
            name: string;
            id: string;
        } | null;
    } & {
        organizationId: string;
        name: string;
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
        organizationId: string;
        name: string;
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
