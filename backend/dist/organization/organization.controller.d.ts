import { OrganizationService } from './organization.service';
export declare class OrganizationController {
    private readonly organizationService;
    constructor(organizationService: OrganizationService);
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
    update(id: string, dto: any): Promise<{
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
    getMySettings(orgId: string): Promise<{
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
    updateMySettings(orgId: string, dto: any): Promise<{
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
