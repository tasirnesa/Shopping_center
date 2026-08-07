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
                    barcode: string | null;
                    price: number;
                    cost: number;
                    createdAt: Date;
                    updatedAt: Date;
                    organizationId: string;
                    categoryId: string | null;
                    brandId: string | null;
                    unitId: string | null;
                };
            } & {
                id: string;
                price: number;
                quantity: number;
                productId: string;
                saleId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            subTotal: number;
            discount: number;
            totalAmount: number;
            branchId: string;
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
    getFulfillment(orgId: string, req: any): Promise<any>;
}
