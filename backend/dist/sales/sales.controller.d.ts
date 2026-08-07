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
            name: string;
            createdAt: Date;
            updatedAt: Date;
            businessType: string | null;
            tin: string | null;
            phone: string | null;
            email: string | null;
            address: string | null;
            logo: string | null;
            status: string;
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
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            phone: string | null;
            email: string | null;
        } | null;
        details: ({
            product: {
                id: string;
                name: string;
                barcode: string | null;
                price: number;
                cost: number;
                createdAt: Date;
                updatedAt: Date;
                organizationId: string;
                categoryId: string | null;
                brandId: string | null;
                unitId: string | null;
            };
        } & {
            id: string;
            price: number;
            quantity: number;
            productId: string;
            saleId: string;
        })[];
        returns: ({
            details: {
                id: string;
                price: number;
                quantity: number;
                productId: string;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        subTotal: number;
        discount: number;
        totalAmount: number;
        branchId: string;
        customerId: string | null;
    }>;
    findAll(orgId: string): Promise<({
        organization: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            businessType: string | null;
            tin: string | null;
            phone: string | null;
            email: string | null;
            address: string | null;
            logo: string | null;
            status: string;
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
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            phone: string | null;
            email: string | null;
        } | null;
        details: ({
            product: {
                id: string;
                name: string;
                barcode: string | null;
                price: number;
                cost: number;
                createdAt: Date;
                updatedAt: Date;
                organizationId: string;
                categoryId: string | null;
                brandId: string | null;
                unitId: string | null;
            };
        } & {
            id: string;
            price: number;
            quantity: number;
            productId: string;
            saleId: string;
        })[];
        returns: ({
            details: {
                id: string;
                price: number;
                quantity: number;
                productId: string;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        subTotal: number;
        discount: number;
        totalAmount: number;
        branchId: string;
        customerId: string | null;
    })[]>;
    findOne(orgId: string, id: string): Promise<({
        organization: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            businessType: string | null;
            tin: string | null;
            phone: string | null;
            email: string | null;
            address: string | null;
            logo: string | null;
            status: string;
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
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            phone: string | null;
            email: string | null;
        } | null;
        details: ({
            product: {
                id: string;
                name: string;
                barcode: string | null;
                price: number;
                cost: number;
                createdAt: Date;
                updatedAt: Date;
                organizationId: string;
                categoryId: string | null;
                brandId: string | null;
                unitId: string | null;
            };
        } & {
            id: string;
            price: number;
            quantity: number;
            productId: string;
            saleId: string;
        })[];
        returns: ({
            details: {
                id: string;
                price: number;
                quantity: number;
                productId: string;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        subTotal: number;
        discount: number;
        totalAmount: number;
        branchId: string;
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
            quantity: number;
            productId: string;
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
