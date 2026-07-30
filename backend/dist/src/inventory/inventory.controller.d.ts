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
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        contact: string | null;
    }[]>;
    createSupplier(orgId: string, dto: CreateSupplierDto): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        contact: string | null;
    }>;
    getPurchases(orgId: string): Promise<({
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
        supplier: {
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            contact: string | null;
        };
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
            cost: number;
            quantity: number;
            productId: string;
            purchaseId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        branchId: string;
        totalAmount: number;
        supplierId: string;
    })[]>;
    createPurchase(orgId: string, dto: CreatePurchaseDto): Promise<{
        details: {
            id: string;
            cost: number;
            quantity: number;
            productId: string;
            purchaseId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        branchId: string;
        totalAmount: number;
        supplierId: string;
    }>;
    getStockBalance(orgId: string, branchId?: string): Promise<({
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
        product: {
            category: {
                id: string;
                name: string;
                organizationId: string;
                description: string | null;
            } | null;
            unit: {
                id: string;
                name: string;
                organizationId: string;
            } | null;
        } & {
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
        updatedAt: Date;
        branchId: string;
        quantity: number;
        productId: string;
    })[]>;
    getTransactions(orgId: string, branchId?: string): Promise<({
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
        createdAt: Date;
        branchId: string;
        quantity: number;
        productId: string;
        type: string;
        reference: string | null;
    })[]>;
    adjustStock(orgId: string, dto: AdjustStockDto): Promise<{
        id: string;
        createdAt: Date;
        branchId: string;
        quantity: number;
        productId: string;
        type: string;
        reference: string | null;
    }>;
    transferStock(orgId: string, dto: TransferStockDto): Promise<{
        message: string;
        quantity: number;
    }>;
}
