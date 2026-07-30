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
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
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
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
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
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
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
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
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
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        barcode: string | null;
        price: number;
        cost: number;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }) | null>;
    remove(orgId: string, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        barcode: string | null;
        price: number;
        cost: number;
        categoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    } | null>;
}
