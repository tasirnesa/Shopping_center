import { PrismaService } from '../prisma/prisma.service';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
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
    create(orgId: string, data: {
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
    update(orgId: string, id: string, data: {
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
    saveEfdaLicense(orgId: string, id: string, filePath: string, fileName: string): Promise<{
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
    getCredit(orgId: string, id: string): Promise<{
        id: string;
        name: string;
        creditLimit: number;
        creditBalance: number;
    }>;
    addCredit(orgId: string, customerId: string, amount: number): Promise<{
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
    settleCredit(orgId: string, customerId: string, amount: number): Promise<{
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
