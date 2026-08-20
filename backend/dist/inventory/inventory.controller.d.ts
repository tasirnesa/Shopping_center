import { InventoryService } from './inventory.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { TransferStockDto } from './dto/transfer-stock.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getSuppliers(orgId: string): Promise<{
        id: string;
        organizationId: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        contact: string | null;
    }[]>;
    createSupplier(orgId: string, dto: CreateSupplierDto): Promise<{
        id: string;
        organizationId: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        contact: string | null;
    }>;
    getPurchases(orgId: string): Promise<({
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
        supplier: {
            id: string;
            organizationId: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            contact: string | null;
        };
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
            cost: number;
            productId: string;
            quantity: number;
            purchaseId: string;
        })[];
    } & {
        id: string;
        organizationId: string;
        branchId: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: number;
        supplierId: string;
    })[]>;
    createPurchase(orgId: string, dto: CreatePurchaseDto): Promise<{
        details: {
            id: string;
            cost: number;
            productId: string;
            quantity: number;
            purchaseId: string;
        }[];
    } & {
        id: string;
        organizationId: string;
        branchId: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: number;
        supplierId: string;
    }>;
    getStockBalance(orgId: string, branchId?: string): Promise<({
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
        product: {
            category: {
                id: string;
                organizationId: string;
                name: string;
                description: string | null;
            } | null;
            unit: {
                id: string;
                organizationId: string;
                name: string;
            } | null;
        } & {
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
        branchId: string;
        updatedAt: Date;
        productId: string;
        quantity: number;
    })[]>;
    getTransactions(orgId: string, branchId?: string): Promise<({
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
        branchId: string;
        createdAt: Date;
        productId: string;
        quantity: number;
        type: string;
        reference: string | null;
    })[]>;
    adjustStock(orgId: string, dto: AdjustStockDto): Promise<{
        id: string;
        branchId: string;
        createdAt: Date;
        productId: string;
        quantity: number;
        type: string;
        reference: string | null;
    }>;
    transferStock(orgId: string, dto: TransferStockDto): Promise<{
        message: string;
        quantity: number;
    }>;
}
