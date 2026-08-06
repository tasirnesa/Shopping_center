import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { TransferStockDto } from './dto/transfer-stock.dto';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getSuppliers(orgId: string): Promise<{
        email: string | null;
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        contact: string | null;
    }[]>;
    createSupplier(orgId: string, dto: CreateSupplierDto): Promise<{
        email: string | null;
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        contact: string | null;
    }>;
    getPurchases(orgId: string): Promise<({
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
        supplier: {
            email: string | null;
            name: string;
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            contact: string | null;
        };
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
            cost: number;
            productId: string;
            quantity: number;
            purchaseId: string;
        })[];
    } & {
        organizationId: string;
        branchId: string;
        id: string;
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
        organizationId: string;
        branchId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: number;
        supplierId: string;
    }>;
    getStockBalance(orgId: string, branchId?: string): Promise<({
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
        product: {
            category: {
                name: string;
                organizationId: string;
                id: string;
                description: string | null;
            } | null;
            unit: {
                name: string;
                organizationId: string;
                id: string;
            } | null;
        } & {
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
        branchId: string;
        id: string;
        updatedAt: Date;
        productId: string;
        quantity: number;
    })[]>;
    getTransactions(orgId: string, branchId?: string): Promise<({
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
        branchId: string;
        id: string;
        createdAt: Date;
        productId: string;
        quantity: number;
        type: string;
        reference: string | null;
    })[]>;
    adjustStock(orgId: string, dto: AdjustStockDto): Promise<{
        branchId: string;
        id: string;
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
    private upsertStockBalance;
}
