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
                price: number;
                productId: string;
                quantity: number;
                returnId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            totalRefund: number;
            saleId: string;
        })[];
        organization: {
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
        };
        branch: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
        customer: {
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            phone: string | null;
        } | null;
        details: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                organizationId: string;
                barcode: string | null;
                price: number;
                cost: number;
                categoryId: string | null;
                brandId: string | null;
                unitId: string | null;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            saleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        branchId: string;
        subTotal: number;
        discount: number;
        totalAmount: number;
        customerId: string | null;
    }>;
    findAll(orgId: string): Promise<({
        returns: ({
            details: {
                id: string;
                price: number;
                productId: string;
                quantity: number;
                returnId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            totalRefund: number;
            saleId: string;
        })[];
        organization: {
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
        };
        branch: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
        customer: {
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            phone: string | null;
        } | null;
        details: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                organizationId: string;
                barcode: string | null;
                price: number;
                cost: number;
                categoryId: string | null;
                brandId: string | null;
                unitId: string | null;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            saleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        branchId: string;
        subTotal: number;
        discount: number;
        totalAmount: number;
        customerId: string | null;
    })[]>;
    findOne(orgId: string, id: string): Promise<({
        returns: ({
            details: {
                id: string;
                price: number;
                productId: string;
                quantity: number;
                returnId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            totalRefund: number;
            saleId: string;
        })[];
        organization: {
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
        };
        branch: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
        customer: {
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            phone: string | null;
        } | null;
        details: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                organizationId: string;
                barcode: string | null;
                price: number;
                cost: number;
                categoryId: string | null;
                brandId: string | null;
                unitId: string | null;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            saleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        branchId: string;
        subTotal: number;
        discount: number;
        totalAmount: number;
        customerId: string | null;
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
            price: number;
            productId: string;
            quantity: number;
            returnId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalRefund: number;
        saleId: string;
    }>;
}
