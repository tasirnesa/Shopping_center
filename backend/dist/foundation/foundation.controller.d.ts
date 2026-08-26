import { FoundationService } from './foundation.service';
import { Role } from '@prisma/client';
export declare class FoundationController {
    private readonly foundationService;
    constructor(foundationService: FoundationService);
    getCategories(orgId: string): Promise<{
        id: string;
        organizationId: string;
        name: string;
        description: string | null;
    }[]>;
    createCategory(orgId: string, body: {
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
    createBrand(orgId: string, body: {
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
    createUnit(orgId: string, body: {
        name: string;
    }): Promise<{
        id: string;
        organizationId: string;
        name: string;
    }>;
    deleteUnit(orgId: string, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getBranches(orgId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        phone: string | null;
        address: string | null;
        code: string | null;
    }[]>;
    createBranch(orgId: string, body: {
        name: string;
        code?: string;
        phone?: string;
        address?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        phone: string | null;
        address: string | null;
        code: string | null;
    }>;
    updateBranch(orgId: string, id: string, body: {
        name?: string;
        code?: string;
        phone?: string;
        address?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        phone: string | null;
        address: string | null;
        code: string | null;
    }>;
    deleteBranch(orgId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        phone: string | null;
        address: string | null;
        code: string | null;
    }>;
    createUser(orgId: string, req: any, body: {
        email: string;
        password: string;
        name?: string;
        role: Role;
        branchId?: string;
        organizationId?: string;
    }): Promise<any>;
    getUsers(orgId: string, req: any): Promise<{
        branchId: string | null;
        organization: {
            id: string;
            name: string;
        } | null;
        branch: {
            id: string;
            name: string;
        } | null;
        id: string;
        status: string;
        createdAt: Date;
        name: string | null;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
    updateUserRole(orgId: string, id: string, body: {
        role: Role;
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateUserStatus(orgId: string, id: string, body: {
        status: 'ACTIVE' | 'INACTIVE';
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
