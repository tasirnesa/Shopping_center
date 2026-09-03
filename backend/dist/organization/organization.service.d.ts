import { PrismaService } from '../prisma/prisma.service';
export declare class OrganizationService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            users: number;
            products: number;
        };
        branches: {
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            phone: string | null;
            address: string | null;
        }[];
        settings: {
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        address: string | null;
        tin: string | null;
        status: string;
        businessType: string | null;
        email: string | null;
        logo: string | null;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            users: number;
            sales: number;
            products: number;
        };
        branches: {
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            phone: string | null;
            address: string | null;
        }[];
        settings: {
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        address: string | null;
        tin: string | null;
        status: string;
        businessType: string | null;
        email: string | null;
        logo: string | null;
    }>;
    create(data: {
        name: string;
        businessType?: string;
        tin?: string;
        phone?: string;
        email?: string;
        address?: string;
    }): Promise<{
        settings: {
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        address: string | null;
        tin: string | null;
        status: string;
        businessType: string | null;
        email: string | null;
        logo: string | null;
    }>;
    update(id: string, data: any): Promise<{
        settings: {
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        address: string | null;
        tin: string | null;
        status: string;
        businessType: string | null;
        email: string | null;
        logo: string | null;
    }>;
    updateSettings(orgId: string, data: {
        currency?: string;
        taxRate?: number;
        receiptFooter?: string;
        language?: string;
        fiscalYear?: string;
        timezone?: string;
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
    } | null>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        address: string | null;
        tin: string | null;
        status: string;
        businessType: string | null;
        email: string | null;
        logo: string | null;
    }>;
}
