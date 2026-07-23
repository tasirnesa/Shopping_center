import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { TransferStockDto } from './dto/transfer-stock.dto';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getSuppliers(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        contact: string | null;
    }[]>;
    createSupplier(dto: CreateSupplierDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        contact: string | null;
    }>;
    getPurchases(): Promise<({
        supplier: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            contact: string | null;
        };
        details: ({
            product: {
                id: string;
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
        createdAt: Date;
        updatedAt: Date;
        totalAmount: number;
        supplierId: string;
    })[]>;
    createPurchase(dto: CreatePurchaseDto): Promise<{
        details: {
            id: string;
            cost: number;
            productId: string;
            quantity: number;
            purchaseId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: number;
        supplierId: string;
    }>;
    getStockBalance(branchId?: string): Promise<({
        branch: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            shopId: string;
        };
        product: {
            category: {
                id: string;
                name: string;
                description: string | null;
            } | null;
            unit: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
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
        updatedAt: Date;
        branchId: string;
        productId: string;
        quantity: number;
    })[]>;
    getTransactions(branchId?: string): Promise<({
        branch: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            shopId: string;
        };
        product: {
            id: string;
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
        createdAt: Date;
        branchId: string;
        productId: string;
        quantity: number;
        type: string;
        reference: string | null;
    })[]>;
    adjustStock(dto: AdjustStockDto): Promise<{
        id: string;
        createdAt: Date;
        branchId: string;
        productId: string;
        quantity: number;
        type: string;
        reference: string | null;
    }>;
    transferStock(dto: TransferStockDto): Promise<{
        message: string;
        quantity: number;
    }>;
    private upsertStockBalance;
}
