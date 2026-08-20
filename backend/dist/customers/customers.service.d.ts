import { PrismaService } from '../prisma/prisma.service';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
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
    create(orgId: string, data: {
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
    update(orgId: string, id: string, data: {
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
    saveEfdaLicense(orgId: string, id: string, filePath: string, fileName: string): Promise<{
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
    getCredit(orgId: string, id: string): Promise<{
        id: string;
        name: string;
        creditLimit: number;
        creditBalance: number;
    }>;
    addCredit(orgId: string, customerId: string, amount: number): Promise<{
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
    settleCredit(orgId: string, customerId: string, amount: number): Promise<{
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
