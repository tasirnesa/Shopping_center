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
    create(dto: {
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
    update(id: string, dto: any): Promise<{
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
    getMySettings(orgId: string): Promise<{
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
    updateMySettings(orgId: string, dto: any): Promise<{
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
