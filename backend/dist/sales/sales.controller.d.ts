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
            organizationId: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
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
        customer: {
            id: string;
            organizationId: string;
            email: string | null;
            name: string;
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
                id: string;
                organizationId: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
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
        organizationId: string;
        branchId: string;
        createdAt: Date;
        updatedAt: Date;
        subTotal: number;
        discount: number;
        totalAmount: number;
        customerId: string | null;
    }>;
    findAll(orgId: string): Promise<({
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
            organizationId: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
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
        customer: {
            id: string;
            organizationId: string;
            email: string | null;
            name: string;
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
                id: string;
                organizationId: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
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
        organizationId: string;
        branchId: string;
        createdAt: Date;
        updatedAt: Date;
        subTotal: number;
        discount: number;
        totalAmount: number;
        customerId: string | null;
    })[]>;
    findOne(orgId: string, id: string): Promise<({
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
            organizationId: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
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
        customer: {
            id: string;
            organizationId: string;
            email: string | null;
            name: string;
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
                id: string;
                organizationId: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
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
        organizationId: string;
        branchId: string;
        createdAt: Date;
        updatedAt: Date;
        subTotal: number;
        discount: number;
        totalAmount: number;
        customerId: string | null;
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
