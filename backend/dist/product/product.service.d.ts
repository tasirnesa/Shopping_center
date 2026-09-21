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
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
        price: number;
        cost: number;
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
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
        price: number;
        cost: number;
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
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
        price: number;
        cost: number;
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
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
        price: number;
        cost: number;
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
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
        price: number;
        cost: number;
    }) | null>;
    remove(orgId: string, id: string): Promise<{
        organizationId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
        price: number;
        cost: number;
    } | null>;
}
