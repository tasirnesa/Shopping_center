import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getSummary(orgId: string): Promise<{
        stats: {
            products: number;
            sales: number;
            lowStock: number;
            revenue: number;
        };
        salesByDay: {
            name: string;
            amount: number;
        }[];
        recentSales: ({
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
                price: number;
                productId: string;
                quantity: number;
                saleId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            branchId: string;
            subTotal: number;
            discount: number;
            totalAmount: number;
            customerId: string | null;
        })[];
        lowStockItems: {
            productId: string;
            productName: string;
            quantity: number;
        }[];
        topProducts: {
            name: string;
            revenue: number;
            qty: number;
        }[];
    }>;
}
