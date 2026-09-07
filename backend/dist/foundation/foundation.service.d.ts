import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class FoundationService {
    private prisma;
    constructor(prisma: PrismaService);
    getCategories(orgId: string): Promise<{
        organizationId: string;
        name: string;
        id: string;
        description: string | null;
    }[]>;
    createCategory(orgId: string, data: {
        name: string;
        description?: string;
    }): Promise<{
        organizationId: string;
        name: string;
        id: string;
        description: string | null;
    }>;
    deleteCategory(orgId: string, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getBrands(orgId: string): Promise<{
        organizationId: string;
        name: string;
        id: string;
    }[]>;
    createBrand(orgId: string, data: {
        name: string;
    }): Promise<{
        organizationId: string;
        name: string;
        id: string;
    }>;
    deleteBrand(orgId: string, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getUnits(orgId: string): Promise<{
        organizationId: string;
        name: string;
        id: string;
    }[]>;
    createUnit(orgId: string, data: {
        name: string;
    }): Promise<{
        organizationId: string;
        name: string;
        id: string;
    }>;
    deleteUnit(orgId: string, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getBranches(orgId: string): Promise<{
        organizationId: string;
        name: string;
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
        organizationId: string;
        name: string;
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
        organizationId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        code: string | null;
    }>;
    deleteBranch(orgId: string, id: string): Promise<{
        organizationId: string;
        name: string;
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
        createdAt: Date;
        status: string;
    }[]>;
    updateUserRole(orgId: string, id: string, role: Role): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateUserStatus(orgId: string, id: string, status: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateUserEmail(orgId: string, id: string, email: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getSettings(orgId: string): Promise<{
        organizationId: string;
        id: string;
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
        organizationId: string;
        id: string;
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
