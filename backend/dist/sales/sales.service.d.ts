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
        organization: {
            email: string | null;
            name: string;
            id: string;
            createdAt: Date;
            status: string;
            updatedAt: Date;
            businessType: string | null;
            tin: string | null;
            phone: string | null;
            address: string | null;
            logo: string | null;
        };
        branch: {
            organizationId: string;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
        customer: {
            organizationId: string;
            email: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tin: string | null;
            phone: string | null;
            efdaLicensePath: string | null;
            efdaLicenseFileName: string | null;
            creditLimit: number;
            creditBalance: number;
        } | null;
        details: ({
            product: {
                organizationId: string;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
    } & {
        organizationId: string;
        branchId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string | null;
        discount: number;
        subTotal: number;
        totalAmount: number;
    }>;
    findAll(orgId: string): Promise<({
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
        organization: {
            email: string | null;
            name: string;
            id: string;
            createdAt: Date;
            status: string;
            updatedAt: Date;
            businessType: string | null;
            tin: string | null;
            phone: string | null;
            address: string | null;
            logo: string | null;
        };
        branch: {
            organizationId: string;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
        customer: {
            organizationId: string;
            email: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tin: string | null;
            phone: string | null;
            efdaLicensePath: string | null;
            efdaLicenseFileName: string | null;
            creditLimit: number;
            creditBalance: number;
        } | null;
        details: ({
            product: {
                organizationId: string;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
    } & {
        organizationId: string;
        branchId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string | null;
        discount: number;
        subTotal: number;
        totalAmount: number;
    })[]>;
    findOne(orgId: string, id: string): Promise<({
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
        organization: {
            email: string | null;
            name: string;
            id: string;
            createdAt: Date;
            status: string;
            updatedAt: Date;
            businessType: string | null;
            tin: string | null;
            phone: string | null;
            address: string | null;
            logo: string | null;
        };
        branch: {
            organizationId: string;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
        customer: {
            organizationId: string;
            email: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tin: string | null;
            phone: string | null;
            efdaLicensePath: string | null;
            efdaLicenseFileName: string | null;
            creditLimit: number;
            creditBalance: number;
        } | null;
        details: ({
            product: {
                organizationId: string;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
    } & {
        organizationId: string;
        branchId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string | null;
        discount: number;
        subTotal: number;
        totalAmount: number;
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
