import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class FoundationService {
    private prisma;
    constructor(prisma: PrismaService);
    getCategories(orgId: string): Promise<{
        organizationId: string;
        id: string;
        name: string;
        description: string | null;
    }[]>;
    createCategory(orgId: string, data: {
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
    createBrand(orgId: string, data: {
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
    createUnit(orgId: string, data: {
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
    createBranch(orgId: string, data: {
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
    updateBranch(orgId: string, id: string, data: {
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
    updateUserRole(orgId: string, id: string, role: Role): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateUserStatus(orgId: string, id: string, status: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateUserEmail(orgId: string, id: string, email: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
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
    updateSettings(orgId: string, data: {
        currency?: string;
        taxRate?: number;
        timezone?: string;
        receiptFooter?: string | null;
        language?: string;
        fiscalYear?: string | null;
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
