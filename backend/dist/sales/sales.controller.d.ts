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
            email: string | null;
            name: string;
            id: string;
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
            name: string;
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
        customer: {
            email: string | null;
            name: string;
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
        } | null;
        details: ({
            product: {
                name: string;
                organizationId: string;
                id: string;
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
        organizationId: string;
        branchId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
            email: string | null;
            name: string;
            id: string;
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
            name: string;
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
        customer: {
            email: string | null;
            name: string;
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
        } | null;
        details: ({
            product: {
                name: string;
                organizationId: string;
                id: string;
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
        organizationId: string;
        branchId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
            email: string | null;
            name: string;
            id: string;
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
            name: string;
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
        customer: {
            email: string | null;
            name: string;
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
        } | null;
        details: ({
            product: {
                name: string;
                organizationId: string;
                id: string;
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
        organizationId: string;
        branchId: string;
        id: string;
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
