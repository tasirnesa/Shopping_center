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
                price: number;
                saleId: string;
            })[];
        } & {
            organizationId: string;
            id: string;
            branchId: string;
            customerId: string | null;
            subTotal: number;
            discount: number;
            totalAmount: number;
            createdAt: Date;
            updatedAt: Date;
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
            createdAt: Date;
            customerName: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            grandTotal: number;
            paymentMethod: string;
        }[];
    }>;
    getFulfillment(orgId: string, req: any): {};
    getAdminDashboard(orgId: string): Promise<{
        todayRevenue: number;
        todaySalesCount: number;
        monthRevenue: number;
        monthSalesCount: number;
        revenueGrowth: number | null;
        ordersToday: number;
        ordersMonthCount: number;
        ordersMonthValue: number;
        pipeline: {
            submitted: number;
            invoiced: number;
            inWarehouse: number;
            outForDelivery: number;
            deliveredToday: number;
        };
        inventory: {
            stockItems: number;
            lowStock: number;
            outOfStock: number;
        };
        totalCustomers: number;
        totalSuppliers: number;
        activeUsers: number;
        todayExpenses: number;
        monthExpenses: number;
        salesByDay: {
            name: string;
            amount: number;
            isToday: boolean;
        }[];
        topProducts: {
            name: string;
            revenue: number;
            qty: number;
        }[];
    }>;
    getSalesPerformance(orgId: string): Promise<{
        salesRepId: string;
        name: string;
        totalOrders: number;
        totalRevenue: number;
        submitted: number;
        approved: number;
        delivered: number;
    }[]>;
    getSystemDashboard(): Promise<{
        stats: {
            totalOrgs: number;
            newOrgsThisWeek: number;
            totalUsers: number;
            activeUsers: number;
            totalBranches: number;
        };
        orgSignupsByDay: {
            name: string;
            signups: number;
            isToday: boolean;
        }[];
    }>;
}
