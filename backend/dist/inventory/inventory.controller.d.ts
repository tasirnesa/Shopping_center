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
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        email: string | null;
        contact: string | null;
    }[]>;
    createSupplier(orgId: string, dto: CreateSupplierDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        name: string;
        email: string | null;
        contact: string | null;
    }>;
    getPurchases(orgId: string): Promise<({
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
        supplier: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            name: string;
            email: string | null;
            contact: string | null;
        };
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
            cost: number;
            purchaseId: string;
        })[];
    } & {
        branchId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        totalAmount: number;
        supplierId: string;
    })[]>;
    createPurchase(orgId: string, dto: CreatePurchaseDto): Promise<{
        details: {
            productId: string;
            quantity: number;
            id: string;
            cost: number;
            purchaseId: string;
        }[];
    } & {
        branchId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        totalAmount: number;
        supplierId: string;
    }>;
    getStockBalance(orgId: string, branchId?: string): Promise<({
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
        branchId: string;
        id: string;
        updatedAt: Date;
    })[]>;
    getTransactions(orgId: string, branchId?: string): Promise<({
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
        branchId: string;
        id: string;
        createdAt: Date;
        type: string;
        reference: string | null;
    })[]>;
    adjustStock(orgId: string, dto: AdjustStockDto): Promise<{
        productId: string;
        quantity: number;
        branchId: string;
        id: string;
        createdAt: Date;
        type: string;
        reference: string | null;
    }>;
    transferStock(orgId: string, dto: TransferStockDto): Promise<{
        message: string;
        quantity: number;
    }>;
}
