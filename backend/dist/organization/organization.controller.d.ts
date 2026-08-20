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
            organizationId: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            code: string | null;
        }[];
        settings: {
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
        } | null;
    } & {
        id: string;
        email: string | null;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        businessType: string | null;
        tin: string | null;
        phone: string | null;
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
            organizationId: string;
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
        id: string;
        email: string | null;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        businessType: string | null;
        tin: string | null;
        phone: string | null;
        address: string | null;
        logo: string | null;
    }>;
    findOne(id: string): Promise<{
        _count: {
            users: number;
            products: number;
            sales: number;
        };
        branches: {
            id: string;
            organizationId: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            code: string | null;
        }[];
        settings: {
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
        } | null;
    } & {
        id: string;
        email: string | null;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        businessType: string | null;
        tin: string | null;
        phone: string | null;
        address: string | null;
        logo: string | null;
    }>;
    update(id: string, dto: any): Promise<{
        settings: {
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
        } | null;
    } & {
        id: string;
        email: string | null;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        businessType: string | null;
        tin: string | null;
        phone: string | null;
        address: string | null;
        logo: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string | null;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        businessType: string | null;
        tin: string | null;
        phone: string | null;
        address: string | null;
        logo: string | null;
    }>;
    getMySettings(orgId: string): Promise<{
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
    } | null>;
    updateMySettings(orgId: string, dto: any): Promise<{
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
