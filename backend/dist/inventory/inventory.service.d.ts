import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { TransferStockDto } from './dto/transfer-stock.dto';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getSuppliers(orgId: string): Promise<{
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string | null;
        contact: string | null;
    }[]>;
    createSupplier(orgId: string, dto: CreateSupplierDto): Promise<{
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string | null;
        contact: string | null;
    }>;
    getPurchases(orgId: string): Promise<({
        branch: {
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            phone: string | null;
            address: string | null;
        };
        details: ({
            product: {
                organizationId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                barcode: string | null;
                categoryId: string | null;
                brandId: string | null;
                unitId: string | null;
                price: number;
                cost: number;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            cost: number;
            purchaseId: string;
        })[];
        supplier: {
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string | null;
            contact: string | null;
        };
    } & {
        organizationId: string;
        id: string;
        branchId: string;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;
        supplierId: string;
    })[]>;
    createPurchase(orgId: string, dto: CreatePurchaseDto): Promise<{
        details: {
            id: string;
            productId: string;
            quantity: number;
            cost: number;
            purchaseId: string;
        }[];
    } & {
        organizationId: string;
        id: string;
        branchId: string;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;
        supplierId: string;
    }>;
    getStockBalance(orgId: string, branchId?: string): Promise<({
        branch: {
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            phone: string | null;
            address: string | null;
        };
        product: {
            category: {
                organizationId: string;
                id: string;
                name: string;
                description: string | null;
            } | null;
            unit: {
                organizationId: string;
                id: string;
                name: string;
            } | null;
        } & {
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            barcode: string | null;
            categoryId: string | null;
            brandId: string | null;
            unitId: string | null;
            price: number;
            cost: number;
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
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            phone: string | null;
            address: string | null;
        };
        product: {
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            barcode: string | null;
            categoryId: string | null;
            brandId: string | null;
            unitId: string | null;
            price: number;
            cost: number;
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
    private upsertStockBalance;
}
