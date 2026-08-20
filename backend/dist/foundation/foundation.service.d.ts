import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class FoundationService {
    private prisma;
    constructor(prisma: PrismaService);
    getCategories(orgId: string): Promise<{
        id: string;
        organizationId: string;
        name: string;
        description: string | null;
    }[]>;
    createCategory(orgId: string, data: {
        name: string;
        description?: string;
    }): Promise<{
        id: string;
        organizationId: string;
        name: string;
        description: string | null;
    }>;
    deleteCategory(orgId: string, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getBrands(orgId: string): Promise<{
        id: string;
        organizationId: string;
        name: string;
    }[]>;
    createBrand(orgId: string, data: {
        name: string;
    }): Promise<{
        id: string;
        organizationId: string;
        name: string;
    }>;
    deleteBrand(orgId: string, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getUnits(orgId: string): Promise<{
        id: string;
        organizationId: string;
        name: string;
    }[]>;
    createUnit(orgId: string, data: {
        name: string;
    }): Promise<{
        id: string;
        organizationId: string;
        name: string;
    }>;
    deleteUnit(orgId: string, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getBranches(orgId: string): Promise<{
        id: string;
        organizationId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        code: string | null;
    }[]>;
    createBranch(orgId: string, data: {
        name: string;
        code?: string;
        phone?: string;
        address?: string;
    }): Promise<{
        id: string;
        organizationId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        code: string | null;
    }>;
    updateBranch(orgId: string, id: string, data: {
        name?: string;
        code?: string;
        phone?: string;
        address?: string;
    }): Promise<{
        id: string;
        organizationId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        code: string | null;
    }>;
    deleteBranch(orgId: string, id: string): Promise<{
        id: string;
        organizationId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        code: string | null;
    }>;
    createUser(data: {
        email: string;
        password: string;
        name?: string;
        role: any;
        organizationId: string;
        branchId?: string;
    }): Promise<any>;
    getUsers(orgId?: string): Promise<{
        id: string;
        branchId: string | null;
        email: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        status: string;
        createdAt: Date;
        organization: {
            id: string;
            name: string;
        } | null;
        branch: {
            id: string;
            name: string;
        } | null;
    }[]>;
    updateUserRole(orgId: string, id: string, role: Role): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateUserStatus(orgId: string, id: string, status: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
