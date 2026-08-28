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
        code: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
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
        code: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
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
        code: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteBranch(orgId: string, id: string): Promise<{
        id: string;
        organizationId: string;
        name: string;
        code: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
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
        name: string | null;
        organization: {
            id: string;
            name: string;
        } | null;
        branch: {
            id: string;
            name: string;
        } | null;
        createdAt: Date;
        branchId: string | null;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        status: string;
    }[]>;
    updateUserRole(orgId: string, id: string, role: Role): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateUserStatus(orgId: string, id: string, status: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateUserEmail(orgId: string, id: string, email: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getSettings(orgId: string): Promise<{
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        taxRate: number;
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
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        taxRate: number;
        receiptFooter: string | null;
        language: string;
        fiscalYear: string | null;
        timezone: string;
    }>;
}
