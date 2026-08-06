import { PrismaService } from '../prisma/prisma.service';
export declare class OrganizationService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        branches: {
            name: string;
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            code: string | null;
        }[];
        settings: {
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
        } | null;
        _count: {
            users: number;
            products: number;
        };
    } & {
        email: string | null;
        name: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        businessType: string | null;
        tin: string | null;
        phone: string | null;
        address: string | null;
        logo: string | null;
    })[]>;
    findOne(id: string): Promise<{
        branches: {
            name: string;
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            code: string | null;
        }[];
        settings: {
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
        } | null;
        _count: {
            users: number;
            products: number;
            sales: number;
        };
    } & {
        email: string | null;
        name: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        businessType: string | null;
        tin: string | null;
        phone: string | null;
        address: string | null;
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
            currency: string;
            taxRate: number;
            receiptFooter: string | null;
            language: string;
            fiscalYear: string | null;
            timezone: string;
        } | null;
    } & {
        email: string | null;
        name: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        businessType: string | null;
        tin: string | null;
        phone: string | null;
        address: string | null;
        logo: string | null;
    }>;
    update(id: string, data: any): Promise<{
        settings: {
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
        } | null;
    } & {
        email: string | null;
        name: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        businessType: string | null;
        tin: string | null;
        phone: string | null;
        address: string | null;
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
        currency: string;
        taxRate: number;
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
        currency: string;
        taxRate: number;
        receiptFooter: string | null;
        language: string;
        fiscalYear: string | null;
        timezone: string;
    } | null>;
    remove(id: string): Promise<{
        email: string | null;
        name: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        businessType: string | null;
        tin: string | null;
        phone: string | null;
        address: string | null;
        logo: string | null;
    }>;
}
