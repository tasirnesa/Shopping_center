"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const LOW_STOCK_THRESHOLD = 10;
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSummary(orgId) {
        const [products, sales, stockBalances, recentSales] = await Promise.all([
            this.prisma.product.count({ where: { organizationId: orgId } }),
            this.prisma.sale.findMany({
                where: { organizationId: orgId },
                select: { totalAmount: true, createdAt: true },
            }),
            this.prisma.stockBalance.findMany({
                where: { product: { organizationId: orgId } },
                include: { product: true },
            }),
            this.prisma.sale.findMany({
                where: { organizationId: orgId },
                include: {
                    details: { include: { product: true } },
                    branch: true,
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
        ]);
        const revenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
        const lowStockItems = stockBalances.filter((s) => s.quantity > 0 && s.quantity < LOW_STOCK_THRESHOLD);
        const outOfStock = stockBalances.filter((s) => s.quantity <= 0);
        const now = new Date();
        const salesByDay = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dayStart = new Date(d.setHours(0, 0, 0, 0));
            const dayEnd = new Date(d.setHours(23, 59, 59, 999));
            const amount = sales
                .filter((s) => {
                const created = new Date(s.createdAt);
                return created >= dayStart && created <= dayEnd;
            })
                .reduce((sum, s) => sum + s.totalAmount, 0);
            salesByDay.push({
                name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(dayStart).getDay()],
                amount,
            });
        }
        const productSales = {};
        const allSalesWithDetails = await this.prisma.sale.findMany({
            where: { organizationId: orgId },
            include: { details: { include: { product: true } } },
        });
        for (const sale of allSalesWithDetails) {
            for (const d of sale.details) {
                const name = d.product?.name || 'Unknown';
                if (!productSales[name])
                    productSales[name] = { name, revenue: 0, qty: 0 };
                productSales[name].revenue += d.price * d.quantity;
                productSales[name].qty += d.quantity;
            }
        }
        const topProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
        return {
            stats: {
                products,
                sales: sales.length,
                lowStock: lowStockItems.length + outOfStock.length,
                revenue,
            },
            salesByDay,
            recentSales,
            lowStockItems: [...outOfStock, ...lowStockItems]
                .slice(0, 10)
                .map((s) => ({
                productId: s.productId,
                productName: s.product?.name,
                quantity: s.quantity,
            })),
            topProducts,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
async;
getFulfillmentDashboard(orgId, string, role, string);
{
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const countByStatus = async (status) => this.prisma.salesOrder.count({ where: { organizationId: orgId, status } });
    const countDeliveryByStatus = async (status) => this.prisma.delivery.count({
        where: { salesOrder: { organizationId: orgId }, status: status },
    });
    const sections = {};
    const showSales = [client_1.Role.SALES_REP, client_1.Role.MANAGER, client_1.Role.OWNER, client_1.Role.SYSTEM_ADMIN].includes(role);
    const showInvoice = [client_1.Role.INVOICE_MAKER, client_1.Role.MANAGER, client_1.Role.OWNER, client_1.Role.SYSTEM_ADMIN].includes(role);
    const showWarehouse = [client_1.Role.STORE_MAN, client_1.Role.MANAGER, client_1.Role.OWNER, client_1.Role.SYSTEM_ADMIN].includes(role);
    const showDelivery = [client_1.Role.DRIVER, client_1.Role.MANAGER, client_1.Role.OWNER, client_1.Role.SYSTEM_ADMIN].includes(role);
    if (showSales) {
        const [createdToday, pendingApproval, waitingInvoice] = await Promise.all([
            this.prisma.salesOrder.count({
                where: { organizationId: orgId, createdAt: { gte: today, lt: tomorrow } },
            }),
            countByStatus(client_1.OrderStatus.SUBMITTED),
            countByStatus(client_1.OrderStatus.WAITING_FOR_INVOICE),
        ]);
        sections.sales = { createdToday, pendingApproval, waitingInvoice };
    }
    if (showInvoice) {
        const [waitingApproval, invoicesToday] = await Promise.all([
            countByStatus(client_1.OrderStatus.SUBMITTED),
            this.prisma.invoice.count({
                where: {
                    organizationId: orgId,
                    createdAt: { gte: today, lt: tomorrow },
                },
            }),
        ]);
        sections.invoice = { waitingApproval, invoicesToday };
    }
    if (showWarehouse) {
        const [waitingPicking, readyForDelivery, picking] = await Promise.all([
            countByStatus(client_1.OrderStatus.WAITING_FOR_WAREHOUSE),
            countByStatus(client_1.OrderStatus.READY_FOR_DELIVERY),
            countByStatus(client_1.OrderStatus.PICKING),
        ]);
        sections.warehouse = { waitingPicking, picking, readyForDelivery };
    }
    if (showDelivery) {
        const [outForDelivery, deliveredToday] = await Promise.all([
            countDeliveryByStatus('OUT_FOR_DELIVERY'),
            this.prisma.delivery.count({
                where: {
                    salesOrder: { organizationId: orgId },
                    status: 'DELIVERED',
                    confirmedAt: { gte: today, lt: tomorrow },
                },
            }),
        ]);
        sections.delivery = { outForDelivery, deliveredToday };
    }
    return sections;
}
//# sourceMappingURL=dashboard.service.js.map