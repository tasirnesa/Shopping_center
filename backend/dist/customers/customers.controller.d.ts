import { CustomersService } from './customers.service';
import { FileUploadService } from '../orders/file-upload.service';
export declare class CustomersController {
    private readonly customersService;
    private readonly fileUploadService;
    constructor(customersService: CustomersService, fileUploadService: FileUploadService);
    findAll(orgId: string): Promise<{
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        tin: string | null;
        email: string | null;
        efdaLicensePath: string | null;
        efdaLicenseFileName: string | null;
        creditLimit: number;
        creditBalance: number;
    }[]>;
    findOne(orgId: string, id: string): Promise<{
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        tin: string | null;
        email: string | null;
        efdaLicensePath: string | null;
        efdaLicenseFileName: string | null;
        creditLimit: number;
        creditBalance: number;
    } | null>;
    create(orgId: string, dto: {
        name: string;
        phone?: string;
        email?: string;
        tin?: string;
        creditLimit?: number;
    }): Promise<{
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        tin: string | null;
        email: string | null;
        efdaLicensePath: string | null;
        efdaLicenseFileName: string | null;
        creditLimit: number;
        creditBalance: number;
    }>;
    update(orgId: string, id: string, dto: {
        name?: string;
        phone?: string;
        email?: string;
        tin?: string;
        creditLimit?: number;
    }): Promise<{
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        tin: string | null;
        email: string | null;
        efdaLicensePath: string | null;
        efdaLicenseFileName: string | null;
        creditLimit: number;
        creditBalance: number;
    } | null>;
    remove(orgId: string, id: string): Promise<{
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        tin: string | null;
        email: string | null;
        efdaLicensePath: string | null;
        efdaLicenseFileName: string | null;
        creditLimit: number;
        creditBalance: number;
    } | null>;
    uploadEfda(orgId: string, id: string, file: any): Promise<{
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        tin: string | null;
        email: string | null;
        efdaLicensePath: string | null;
        efdaLicenseFileName: string | null;
        creditLimit: number;
        creditBalance: number;
    }>;
}
