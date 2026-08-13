import { FoundationService } from './foundation.service';
import { Role } from '@prisma/client';
export declare class FoundationController {
    private readonly foundationService;
    constructor(foundationService: FoundationService);
    getCategories(orgId: string): Promise<{
        name: string;
        organizationId: string;
        id: string;
        description: string | null;
    }[]>;
    createCategory(orgId: string, body: {
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
    createBrand(orgId: string, body: {
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
    createUnit(orgId: string, body: {
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
    createBranch(orgId: string, body: {
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
    updateBranch(orgId: string, id: string, body: {
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
    createUser(orgId: string, req: any, body: {
        email: string;
        password: string;
        name?: string;
        role: Role;
        branchId?: string;
        organizationId?: string;
    }): Promise<any>;
    getUsers(orgId: string, req: any): Promise<{
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
    updateUserRole(orgId: string, id: string, body: {
        role: Role;
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateUserStatus(orgId: string, id: string, body: {
        status: 'ACTIVE' | 'INACTIVE';
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
