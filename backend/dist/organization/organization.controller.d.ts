import { OrganizationService } from './organization.service';
export declare class OrganizationController {
    private readonly organizationService;
    constructor(organizationService: OrganizationService);
    findAll(): Promise<({
        _count: {
            users: number;
            products: number;
        };
        branches: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            name: string;
            phone: string | null;
            address: string | null;
            code: string | null;
        }[];
        settings: {
            id: string;
            taxRate: number;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            currency: string;
            receiptFooter: string | null;
            language: string;
            fiscalYear: string | null;
            timezone: string;
        } | null;
    } & {
        tin: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        email: string | null;
        businessType: string | null;
        address: string | null;
        logo: string | null;
    })[]>;
    create(dto: {
        name: string;
        businessType?: string;
        tin?: string;
        phone?: string;
        email?: string;
        address?: string;
    }): Promise<{
        settings: {
            id: string;
            taxRate: number;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            currency: string;
            receiptFooter: string | null;
            language: string;
            fiscalYear: string | null;
            timezone: string;
        } | null;
    } & {
        tin: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        email: string | null;
        businessType: string | null;
        address: string | null;
        logo: string | null;
    }>;
    findOne(id: string): Promise<{
        _count: {
            sales: number;
            users: number;
            products: number;
        };
        branches: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            name: string;
            phone: string | null;
            address: string | null;
            code: string | null;
        }[];
        settings: {
            id: string;
            taxRate: number;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            currency: string;
            receiptFooter: string | null;
            language: string;
            fiscalYear: string | null;
            timezone: string;
        } | null;
    } & {
        tin: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        email: string | null;
        businessType: string | null;
        address: string | null;
        logo: string | null;
    }>;
    update(id: string, dto: any): Promise<{
        settings: {
            id: string;
            taxRate: number;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            currency: string;
            receiptFooter: string | null;
            language: string;
            fiscalYear: string | null;
            timezone: string;
        } | null;
    } & {
        tin: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        email: string | null;
        businessType: string | null;
        address: string | null;
        logo: string | null;
    }>;
    remove(id: string): Promise<{
        tin: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        email: string | null;
        businessType: string | null;
        address: string | null;
        logo: string | null;
    }>;
    getMySettings(orgId: string): Promise<{
        id: string;
        taxRate: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        currency: string;
        receiptFooter: string | null;
        language: string;
        fiscalYear: string | null;
        timezone: string;
    } | null>;
    updateMySettings(orgId: string, dto: any): Promise<{
        id: string;
        taxRate: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        currency: string;
        receiptFooter: string | null;
        language: string;
        fiscalYear: string | null;
        timezone: string;
    }>;
}
