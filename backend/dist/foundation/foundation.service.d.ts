import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class FoundationService {
    private prisma;
    constructor(prisma: PrismaService);
    getCategories(orgId: string): Promise<{
        name: string;
        organizationId: string;
        id: string;
        description: string | null;
    }[]>;
    createCategory(orgId: string, data: {
        name: string;
        description?: string;
    }): Promise<{
        name: string;
        organizationId: string;
        id: string;
        description: string | null;
    }>;
    deleteCategory(orgId: string, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getBrands(orgId: string): Promise<{
        name: string;
        organizationId: string;
        id: string;
    }[]>;
    createBrand(orgId: string, data: {
        name: string;
    }): Promise<{
        name: string;
        organizationId: string;
        id: string;
    }>;
    deleteBrand(orgId: string, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getUnits(orgId: string): Promise<{
        name: string;
        organizationId: string;
        id: string;
    }[]>;
    createUnit(orgId: string, data: {
        name: string;
    }): Promise<{
        name: string;
        organizationId: string;
        id: string;
    }>;
    deleteUnit(orgId: string, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getBranches(orgId: string): Promise<{
        name: string;
        organizationId: string;
        id: string;
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
        name: string;
        organizationId: string;
        id: string;
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
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        code: string | null;
    }>;
    deleteBranch(orgId: string, id: string): Promise<{
        name: string;
        organizationId: string;
        id: string;
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
        organization: {
            name: string;
            id: string;
        } | null;
        branch: {
            name: string;
            id: string;
        } | null;
        email: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        branchId: string | null;
        id: string;
        status: string;
        createdAt: Date;
    }[]>;
    updateUserRole(orgId: string, id: string, role: Role): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateUserStatus(orgId: string, id: string, status: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
