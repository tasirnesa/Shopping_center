import { CustomersService } from './customers.service';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    findAll(orgId: string): Promise<{
        email: string | null;
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tin: string | null;
        phone: string | null;
        efdaLicensePath: string | null;
        efdaLicenseFileName: string | null;
        creditLimit: number;
        creditBalance: number;
    }[]>;
    findOne(orgId: string, id: string): Promise<{
        email: string | null;
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tin: string | null;
        phone: string | null;
        efdaLicensePath: string | null;
        efdaLicenseFileName: string | null;
        creditLimit: number;
        creditBalance: number;
    } | null>;
    create(orgId: string, dto: {
        name: string;
        phone?: string;
        email?: string;
    }): Promise<{
        email: string | null;
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tin: string | null;
        phone: string | null;
        efdaLicensePath: string | null;
        efdaLicenseFileName: string | null;
        creditLimit: number;
        creditBalance: number;
    }>;
    update(orgId: string, id: string, dto: {
        name?: string;
        phone?: string;
        email?: string;
    }): Promise<{
        email: string | null;
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tin: string | null;
        phone: string | null;
        efdaLicensePath: string | null;
        efdaLicenseFileName: string | null;
        creditLimit: number;
        creditBalance: number;
    } | null>;
    remove(orgId: string, id: string): Promise<{
        email: string | null;
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tin: string | null;
        phone: string | null;
        efdaLicensePath: string | null;
        efdaLicenseFileName: string | null;
        creditLimit: number;
        creditBalance: number;
    } | null>;
}
