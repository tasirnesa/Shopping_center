import { OrganizationService } from './organization.service';
export declare class OrganizationController {
    private readonly organizationService;
    constructor(organizationService: OrganizationService);
    findAll(): Promise<({
        branches: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            phone: string | null;
            address: string | null;
            code: string | null;
        }[];
        settings: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
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
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
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
        branches: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            phone: string | null;
            address: string | null;
            code: string | null;
        }[];
        settings: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
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
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
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
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        currency: string;
        taxRate: number;
        receiptFooter: string | null;
        language: string;
        fiscalYear: string | null;
        timezone: string;
    } | null>;
    updateMySettings(orgId: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        currency: string;
        taxRate: number;
        receiptFooter: string | null;
        language: string;
        fiscalYear: string | null;
        timezone: string;
    }>;
}
