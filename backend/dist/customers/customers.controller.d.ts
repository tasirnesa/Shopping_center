import { CustomersService } from './customers.service';
import { FileUploadService } from '../orders/file-upload.service';
export declare class CustomersController {
    private readonly customersService;
    private readonly fileUploadService;
    constructor(customersService: CustomersService, fileUploadService: FileUploadService);
    findAll(orgId: string): Promise<{
        id: string;
        organizationId: string;
        name: string;
        phone: string | null;
        email: string | null;
        tin: string | null;
        efdaLicensePath: string | null;
        efdaLicenseFileName: string | null;
        creditLimit: number;
        creditBalance: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(orgId: string, id: string): Promise<{
        id: string;
        organizationId: string;
        name: string;
        phone: string | null;
        email: string | null;
        tin: string | null;
        efdaLicensePath: string | null;
        efdaLicenseFileName: string | null;
        creditLimit: number;
        creditBalance: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(orgId: string, dto: {
        name: string;
        phone?: string;
        email?: string;
        tin?: string;
        creditLimit?: number;
    }): Promise<{
        id: string;
        organizationId: string;
        name: string;
        phone: string | null;
        email: string | null;
        tin: string | null;
        efdaLicensePath: string | null;
        efdaLicenseFileName: string | null;
        creditLimit: number;
        creditBalance: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(orgId: string, id: string, dto: {
        name?: string;
        phone?: string;
        email?: string;
        tin?: string;
        creditLimit?: number;
    }): Promise<{
        id: string;
        organizationId: string;
        name: string;
        phone: string | null;
        email: string | null;
        tin: string | null;
        efdaLicensePath: string | null;
        efdaLicenseFileName: string | null;
        creditLimit: number;
        creditBalance: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    remove(orgId: string, id: string): Promise<{
        id: string;
        organizationId: string;
        name: string;
        phone: string | null;
        email: string | null;
        tin: string | null;
        efdaLicensePath: string | null;
        efdaLicenseFileName: string | null;
        creditLimit: number;
        creditBalance: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    uploadEfda(orgId: string, id: string, file: any): Promise<{
        id: string;
        organizationId: string;
        name: string;
        phone: string | null;
        email: string | null;
        tin: string | null;
        efdaLicensePath: string | null;
        efdaLicenseFileName: string | null;
        creditLimit: number;
        creditBalance: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
