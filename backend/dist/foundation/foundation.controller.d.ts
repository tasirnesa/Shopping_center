import { FoundationService } from './foundation.service';
import { Role } from '@prisma/client';
export declare class FoundationController {
    private readonly foundationService;
    constructor(foundationService: FoundationService);
    getCategories(orgId: string): Promise<{
        organizationId: string;
        id: string;
        name: string;
        description: string | null;
    }[]>;
    createCategory(orgId: string, body: {
        name: string;
        description?: string;
    }): Promise<{
        organizationId: string;
        id: string;
        name: string;
        description: string | null;
    }>;
    deleteCategory(orgId: string, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getBrands(orgId: string): Promise<{
        organizationId: string;
        id: string;
        name: string;
    }[]>;
    createBrand(orgId: string, body: {
        name: string;
    }): Promise<{
        organizationId: string;
        id: string;
        name: string;
    }>;
    deleteBrand(orgId: string, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getUnits(orgId: string): Promise<{
        organizationId: string;
        id: string;
        name: string;
    }[]>;
    createUnit(orgId: string, body: {
        name: string;
    }): Promise<{
        organizationId: string;
        id: string;
        name: string;
    }>;
    deleteUnit(orgId: string, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getBranches(orgId: string): Promise<{
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string | null;
        phone: string | null;
        address: string | null;
    }[]>;
    createBranch(orgId: string, body: {
        name: string;
        code?: string;
        phone?: string;
        address?: string;
    }): Promise<{
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string | null;
        phone: string | null;
        address: string | null;
    }>;
    updateBranch(orgId: string, id: string, body: {
        name?: string;
        code?: string;
        phone?: string;
        address?: string;
    }): Promise<{
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string | null;
        phone: string | null;
        address: string | null;
    }>;
    deleteBranch(orgId: string, id: string): Promise<{
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string | null;
        phone: string | null;
        address: string | null;
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
        id: string;
        branchId: string | null;
        createdAt: Date;
        organization: {
            id: string;
            name: string;
        } | null;
        branch: {
            id: string;
            name: string;
        } | null;
        name: string | null;
        status: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
    updateUserRole(orgId: string, id: string, body: {
        role: Role;
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateUserStatus(orgId: string, id: string, body: {
        status: 'ACTIVE' | 'INACTIVE';
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateUserEmail(orgId: string, id: string, body: {
        email: string;
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getSettings(orgId: string): Promise<{
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taxRate: number;
        currency: string;
        receiptFooter: string | null;
        language: string;
        fiscalYear: string | null;
        timezone: string;
    } | {
        currency: string;
        taxRate: number;
        timezone: string;
        receiptFooter: null;
        language: string;
        fiscalYear: null;
    }>;
    updateSettings(orgId: string, body: {
        currency?: string;
        taxRate?: number;
        timezone?: string;
        receiptFooter?: string;
        language?: string;
        fiscalYear?: string;
    }): Promise<{
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taxRate: number;
        currency: string;
        receiptFooter: string | null;
        language: string;
        fiscalYear: string | null;
        timezone: string;
    }>;
}
