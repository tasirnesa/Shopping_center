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
    getFulfillment(orgId: string, req: any): {};
}
