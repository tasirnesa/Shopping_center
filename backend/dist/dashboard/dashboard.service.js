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
    async getTodayOrderStats(orgId, userId, role) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const isSalesRep = role === 'SALES_REP';
        const where = {
            organizationId: orgId,
            createdAt: { gte: today, lt: tomorrow },
            status: {
                notIn: [client_1.OrderStatus.CANCELLED, client_1.OrderStatus.REJECTED],
            },
            ...(isSalesRep ? { salesRepId: userId } : {}),
        };
        const orders = await this.prisma.salesOrder.findMany({
            where,
            select: {
                id: true,
                grandTotal: true,
                paymentMethod: true,
                status: true,
                customerName: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        const paymentBreakdown = {};
        for (const order of orders) {
            const method = order.paymentMethod || 'OTHER';
            if (!paymentBreakdown[method]) {
                paymentBreakdown[method] = { count: 0, total: 0 };
            }
            paymentBreakdown[method].count += 1;
            paymentBreakdown[method].total += order.grandTotal ?? 0;
        }
        const grandTotal = orders.reduce((sum, o) => sum + (o.grandTotal ?? 0), 0);
        return {
            date: today.toISOString(),
            totalOrders: orders.length,
            grandTotal,
            paymentBreakdown,
            orders,
        };
    }
    async getFulfillmentDashboard(orgId, role, userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const countByStatus = async (status) => this.prisma.salesOrder.count({ where: { organizationId: orgId, status } });
        const countDeliveryByStatus = async (status) => this.prisma.delivery.count({
            where: { salesOrder: { organizationId: orgId }, status: status },
        });
        const sections = {};
        const r = role;
        const showSales = ['SALES_REP', 'MANAGER', 'OWNER', 'SYSTEM_ADMIN'].includes(r);
        const showInvoice = ['INVOICE_MAKER', 'MANAGER', 'OWNER', 'SYSTEM_ADMIN'].includes(r);
        const showWarehouse = ['STORE_MAN', 'MANAGER', 'OWNER', 'SYSTEM_ADMIN'].includes(r);
        const showDelivery = ['DRIVER', 'MANAGER', 'OWNER', 'SYSTEM_ADMIN'].includes(r);
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
                    where: { organizationId: orgId, createdAt: { gte: today, lt: tomorrow } },
                }),
            ]);
            sections.invoice = { waitingApproval, invoicesToday };
        }
        if (showWarehouse) {
            const [waitingPicking, picking, readyForDelivery] = await Promise.all([
                countByStatus(client_1.OrderStatus.WAITING_FOR_WAREHOUSE),
                countByStatus(client_1.OrderStatus.PICKING),
                countByStatus(client_1.OrderStatus.READY_FOR_DELIVERY),
            ]);
            sections.warehouse = { waitingPicking, picking, readyForDelivery };
        }
        if (showDelivery) {
            const isDriver = role === 'DRIVER';
            const [outForDelivery, deliveredToday, pendingDelivery] = await Promise.all([
                this.prisma.delivery.count({
                    where: {
                        salesOrder: { organizationId: orgId },
                        status: 'OUT_FOR_DELIVERY',
                        ...(isDriver && userId ? { driverId: userId } : {}),
                    },
                }),
                this.prisma.delivery.count({
                    where: {
                        salesOrder: { organizationId: orgId },
                        status: 'DELIVERED',
                        confirmedAt: { gte: today, lt: tomorrow },
                        ...(isDriver && userId ? { driverId: userId } : {}),
                    },
                }),
                countDeliveryByStatus('PENDING'),
            ]);
            sections.delivery = { outForDelivery, deliveredToday, pendingDelivery };
        }
        return sections;
    }
    async getSalesPerformance(orgId) {
        const orders = await this.prisma.salesOrder.findMany({
            where: {
                organizationId: orgId,
                status: { notIn: [client_1.OrderStatus.CANCELLED, client_1.OrderStatus.REJECTED] },
            },
            select: {
                salesRepId: true,
                grandTotal: true,
                status: true,
                salesRep: { select: { name: true } },
            },
        });
        const repMap = {};
        for (const order of orders) {
            const id = order.salesRepId;
            if (!repMap[id]) {
                repMap[id] = {
                    salesRepId: id,
                    name: order.salesRep?.name || 'Unknown',
                    totalOrders: 0,
                    totalRevenue: 0,
                    submitted: 0,
                    approved: 0,
                    delivered: 0,
                };
            }
            repMap[id].totalOrders += 1;
            repMap[id].totalRevenue += order.grandTotal ?? 0;
            if (order.status === client_1.OrderStatus.SUBMITTED)
                repMap[id].submitted += 1;
            const approvedStatuses = ['INVOICE_APPROVED', 'WAITING_FOR_WAREHOUSE', 'PICKING', 'READY_FOR_DELIVERY'];
            if (approvedStatuses.includes(order.status))
                repMap[id].approved += 1;
            const deliveredStatuses = ['DELIVERED', 'COMPLETED'];
            if (deliveredStatuses.includes(order.status))
                repMap[id].delivered += 1;
        }
        return Object.values(repMap).sort((a, b) => b.totalRevenue - a.totalRevenue);
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map