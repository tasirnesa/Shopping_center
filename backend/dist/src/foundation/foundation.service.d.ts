import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class FoundationService {
    private prisma;
    constructor(prisma: PrismaService);
    getCategories(): Promise<{
        id: string;
        name: string;
        description: string | null;
    }[]>;
    createCategory(data: {
        name: string;
        description?: string;
    }): Promise<{
        id: string;
        name: string;
        description: string | null;
    }>;
    deleteCategory(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
    }>;
    getBrands(): Promise<{
        id: string;
        name: string;
    }[]>;
    createBrand(data: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
    }>;
    deleteBrand(id: string): Promise<{
        id: string;
        name: string;
    }>;
    getUnits(): Promise<{
        id: string;
        name: string;
    }[]>;
    createUnit(data: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
    }>;
    deleteUnit(id: string): Promise<{
        id: string;
        name: string;
    }>;
    getShops(): Promise<({
        branches: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            shopId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        ownerId: string;
    })[]>;
    createShop(data: {
        name: string;
        ownerId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        ownerId: string;
    }>;
    getBranches(): Promise<({
        shop: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            ownerId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        shopId: string;
    })[]>;
    createBranch(data: {
        name: string;
        shopId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        shopId: string;
    }>;
    getUsers(): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        branchId: string;
        branch: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            shopId: string;
        };
    }[]>;
    updateUserRole(id: string, role: Role): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
