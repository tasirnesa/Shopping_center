import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
                createdAt: Date;
                updatedAt: Date;
                organizationId: string;
                name: string;
                phone: string | null;
                code: string | null;
                address: string | null;
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
                id: string;
                quantity: number;
                productId: string;
                price: number;
                saleId: string;
            })[];
        } & {
            customerId: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            branchId: string;
            discount: number;
            subTotal: number;
            totalAmount: number;
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
    getTodayOrders(orgId: string, req: any): Promise<{
        date: string;
        totalOrders: number;
        grandTotal: number;
        paymentBreakdown: Record<string, {
            count: number;
            total: number;
        }>;
        orders: {
            id: string;
            customerName: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            grandTotal: number;
            paymentMethod: string;
            createdAt: Date;
        }[];
    }>;
    getFulfillment(orgId: string, req: any): {};
    getSalesPerformance(orgId: string): Promise<{
        salesRepId: string;
        name: string;
        totalOrders: number;
        totalRevenue: number;
        submitted: number;
        approved: number;
        delivered: number;
    }[]>;
}
