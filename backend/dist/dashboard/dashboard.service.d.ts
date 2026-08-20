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
                organizationId: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                phone: string | null;
                address: string | null;
                code: string | null;
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
    getTodayOrderStats(orgId: string, userId: string, role: string): Promise<{
        date: string;
        totalOrders: number;
        grandTotal: number;
        paymentBreakdown: Record<string, {
            count: number;
            total: number;
        }>;
        orders: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            customerName: string;
            grandTotal: number;
            paymentMethod: string;
        }[];
    }>;
    getFulfillmentDashboard(orgId: string, role: string, userId?: string): Promise<any>;
}
