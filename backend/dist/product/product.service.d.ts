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
    update(orgId: string, id: string, data: any): Promise<({
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
