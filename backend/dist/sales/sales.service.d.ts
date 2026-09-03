import { PrismaService } from '../prisma/prisma.service';
export declare class SalesService {
    private prisma;
    constructor(prisma: PrismaService);
    private saleInclude;
    create(orgId: string, data: {
        customerId?: string;
        discount?: number;
        paymentMethod?: string;
        details: {
            productId: string;
            quantity: number;
            price: number;
        }[];
        branchId: string;
    }): Promise<{
        organization: {
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
        };
        branch: {
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            phone: string | null;
            address: string | null;
        };
        customer: {
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
        } | null;
        details: ({
            product: {
                organizationId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                barcode: string | null;
                categoryId: string | null;
                brandId: string | null;
                unitId: string | null;
                price: number;
                cost: number;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            price: number;
            saleId: string;
        })[];
        returns: ({
            details: {
                id: string;
                productId: string;
                quantity: number;
                price: number;
                returnId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            saleId: string;
            totalRefund: number;
        })[];
    } & {
        organizationId: string;
        id: string;
        branchId: string;
        customerId: string | null;
        subTotal: number;
        discount: number;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(orgId: string): Promise<({
        organization: {
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
        };
        branch: {
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            phone: string | null;
            address: string | null;
        };
        customer: {
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
        } | null;
        details: ({
            product: {
                organizationId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                barcode: string | null;
                categoryId: string | null;
                brandId: string | null;
                unitId: string | null;
                price: number;
                cost: number;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            price: number;
            saleId: string;
        })[];
        returns: ({
            details: {
                id: string;
                productId: string;
                quantity: number;
                price: number;
                returnId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            saleId: string;
            totalRefund: number;
        })[];
    } & {
        organizationId: string;
        id: string;
        branchId: string;
        customerId: string | null;
        subTotal: number;
        discount: number;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(orgId: string, id: string): Promise<({
        organization: {
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
        };
        branch: {
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            phone: string | null;
            address: string | null;
        };
        customer: {
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
        } | null;
        details: ({
            product: {
                organizationId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                barcode: string | null;
                categoryId: string | null;
                brandId: string | null;
                unitId: string | null;
                price: number;
                cost: number;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            price: number;
            saleId: string;
        })[];
        returns: ({
            details: {
                id: string;
                productId: string;
                quantity: number;
                price: number;
                returnId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            saleId: string;
            totalRefund: number;
        })[];
    } & {
        organizationId: string;
        id: string;
        branchId: string;
        customerId: string | null;
        subTotal: number;
        discount: number;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    processReturn(orgId: string, data: {
        saleId: string;
        branchId: string;
        details: {
            productId: string;
            quantity: number;
            price: number;
        }[];
    }): Promise<{
        details: {
            id: string;
            productId: string;
            quantity: number;
            price: number;
            returnId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        saleId: string;
        totalRefund: number;
    }>;
}
