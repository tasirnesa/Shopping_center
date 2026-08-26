import { SalesService } from './sales.service';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(orgId: string, userBranchId: string, dto: {
        customerId?: string;
        discount?: number;
        paymentMethod?: string;
        details: {
            productId: string;
            quantity: number;
            price: number;
        }[];
        branchId?: string;
    }): Promise<{
        organization: {
            tin: string | null;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
            email: string | null;
            businessType: string | null;
            address: string | null;
            logo: string | null;
        };
        branch: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            name: string;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
        customer: {
            tin: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            name: string;
            phone: string | null;
            email: string | null;
            efdaLicensePath: string | null;
            efdaLicenseFileName: string | null;
            creditLimit: number;
            creditBalance: number;
        } | null;
        returns: ({
            details: {
                productId: string;
                quantity: number;
                id: string;
                price: number;
                returnId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            totalRefund: number;
            saleId: string;
        })[];
        details: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                organizationId: string;
                name: string;
                barcode: string | null;
                categoryId: string | null;
                brandId: string | null;
                unitId: string | null;
                price: number;
                cost: number;
            };
        } & {
            productId: string;
            quantity: number;
            id: string;
            price: number;
            saleId: string;
        })[];
    } & {
        discount: number;
        branchId: string;
        customerId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        subTotal: number;
        totalAmount: number;
    }>;
    findAll(orgId: string): Promise<({
        organization: {
            tin: string | null;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
            email: string | null;
            businessType: string | null;
            address: string | null;
            logo: string | null;
        };
        branch: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            name: string;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
        customer: {
            tin: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            name: string;
            phone: string | null;
            email: string | null;
            efdaLicensePath: string | null;
            efdaLicenseFileName: string | null;
            creditLimit: number;
            creditBalance: number;
        } | null;
        returns: ({
            details: {
                productId: string;
                quantity: number;
                id: string;
                price: number;
                returnId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            totalRefund: number;
            saleId: string;
        })[];
        details: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                organizationId: string;
                name: string;
                barcode: string | null;
                categoryId: string | null;
                brandId: string | null;
                unitId: string | null;
                price: number;
                cost: number;
            };
        } & {
            productId: string;
            quantity: number;
            id: string;
            price: number;
            saleId: string;
        })[];
    } & {
        discount: number;
        branchId: string;
        customerId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        subTotal: number;
        totalAmount: number;
    })[]>;
    findOne(orgId: string, id: string): Promise<({
        organization: {
            tin: string | null;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
            email: string | null;
            businessType: string | null;
            address: string | null;
            logo: string | null;
        };
        branch: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            name: string;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
        customer: {
            tin: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            name: string;
            phone: string | null;
            email: string | null;
            efdaLicensePath: string | null;
            efdaLicenseFileName: string | null;
            creditLimit: number;
            creditBalance: number;
        } | null;
        returns: ({
            details: {
                productId: string;
                quantity: number;
                id: string;
                price: number;
                returnId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            totalRefund: number;
            saleId: string;
        })[];
        details: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                organizationId: string;
                name: string;
                barcode: string | null;
                categoryId: string | null;
                brandId: string | null;
                unitId: string | null;
                price: number;
                cost: number;
            };
        } & {
            productId: string;
            quantity: number;
            id: string;
            price: number;
            saleId: string;
        })[];
    } & {
        discount: number;
        branchId: string;
        customerId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        subTotal: number;
        totalAmount: number;
    }) | null>;
    processReturn(orgId: string, userBranchId: string, dto: {
        saleId: string;
        branchId?: string;
        details: {
            productId: string;
            quantity: number;
            price: number;
        }[];
    }): Promise<{
        details: {
            productId: string;
            quantity: number;
            id: string;
            price: number;
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
