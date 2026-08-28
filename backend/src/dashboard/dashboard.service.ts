import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, Role } from '@prisma/client';

const LOW_STOCK_THRESHOLD = 10;

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) { }

  async getSummary(orgId: string) {
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
    const lowStockItems = stockBalances.filter(
      (s) => s.quantity > 0 && s.quantity < LOW_STOCK_THRESHOLD,
    );
    const outOfStock = stockBalances.filter((s) => s.quantity <= 0);

    const now = new Date();
    const salesByDay: { name: string; amount: number }[] = [];
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
        name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
          new Date(dayStart).getDay()
        ],
        amount,
      });
    }

    const productSales: Record<
      string,
      { name: string; revenue: number; qty: number }
    > = {};
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

  // Today's sales orders breakdown by payment method (for Sales Rep dashboard)
  async getTodayOrderStats(orgId: string, userId: string, role: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // SALES_REP sees only their own orders; managers/owners see all org
    const isSalesRep = role === 'SALES_REP';
    const where: any = {
      organizationId: orgId,
      createdAt: { gte: today, lt: tomorrow },
      // Only count orders that are not cancelled/rejected
      status: {
        notIn: [OrderStatus.CANCELLED, OrderStatus.REJECTED],
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

    // Group totals by payment method
    const paymentBreakdown: Record<string, { count: number; total: number }> = {};
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
  async getFulfillmentDashboard(orgId: string, role: string, userId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const countByStatus = async (status: OrderStatus) =>
      this.prisma.salesOrder.count({ where: { organizationId: orgId, status } });

    const countDeliveryByStatus = async (status: string) =>
      this.prisma.delivery.count({
        where: { salesOrder: { organizationId: orgId }, status: status as any },
      });

    const sections: any = {};

    const r = role as string;
    const showSales = ['SALES_REP', 'MANAGER', 'OWNER', 'SYSTEM_ADMIN'].includes(r);
    const showInvoice = ['INVOICE_MAKER', 'MANAGER', 'OWNER', 'SYSTEM_ADMIN'].includes(r);
    const showWarehouse = ['STORE_MAN', 'MANAGER', 'OWNER', 'SYSTEM_ADMIN'].includes(r);
    const showDelivery = ['DRIVER', 'MANAGER', 'OWNER', 'SYSTEM_ADMIN'].includes(r);

    if (showSales) {
      const [createdToday, pendingApproval, waitingInvoice] = await Promise.all([
        this.prisma.salesOrder.count({
          where: { organizationId: orgId, createdAt: { gte: today, lt: tomorrow } },
        }),
        countByStatus(OrderStatus.SUBMITTED),
        countByStatus(OrderStatus.WAITING_FOR_INVOICE),
      ]);
      sections.sales = { createdToday, pendingApproval, waitingInvoice };
    }

    if (showInvoice) {
      const [waitingApproval, invoicesToday] = await Promise.all([
        countByStatus(OrderStatus.SUBMITTED),
        this.prisma.invoice.count({
          where: { organizationId: orgId, createdAt: { gte: today, lt: tomorrow } },
        }),
      ]);
      sections.invoice = { waitingApproval, invoicesToday };
    }

    if (showWarehouse) {
      const [waitingPicking, picking, readyForDelivery] = await Promise.all([
        countByStatus(OrderStatus.WAITING_FOR_WAREHOUSE),
        countByStatus(OrderStatus.PICKING),
        countByStatus(OrderStatus.READY_FOR_DELIVERY),
      ]);
      sections.warehouse = { waitingPicking, picking, readyForDelivery };
    }

    if (showDelivery) {
      const isDriver = role === 'DRIVER';
      const [outForDelivery, deliveredToday, pendingDelivery] = await Promise.all([
        // Active deliveries: driver sees only their own, managers see all org
        this.prisma.delivery.count({
          where: {
            salesOrder: { organizationId: orgId },
            status: 'OUT_FOR_DELIVERY' as any,
            ...(isDriver && userId ? { driverId: userId } : {}),
          },
        }),
        // Delivered today: driver sees only their own, managers see all org
        this.prisma.delivery.count({
          where: {
            salesOrder: { organizationId: orgId },
            status: 'DELIVERED' as any,
            confirmedAt: { gte: today, lt: tomorrow },
            ...(isDriver && userId ? { driverId: userId } : {}),
          },
        }),
        // Pending (unassigned) deliveries: always org-wide — any driver can pick these up
        countDeliveryByStatus('PENDING'),
      ]);
      sections.delivery = { outForDelivery, deliveredToday, pendingDelivery };
    }

    return sections;
  }

  async getAdminDashboard(orgId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd   = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);

    const [
      // POS Sales
      totalSalesCount, todaySales, monthSales, lastMonthSales,
      // Orders
      ordersToday, ordersMonth,
      // Fulfillment pipeline
      submitted, invoiced, inWarehouse, outForDelivery, deliveredToday,
      // Inventory
      stockItems, lowStock, outOfStock,
      // Customers & Suppliers
      totalCustomers, totalSuppliers,
      // Expenses
      monthExpenses, todayExpenses,
      // Users
      activeUsers,
      // Top products (from POS sales)
      posWithDetails,
    ] = await Promise.all([
      // POS Sales counts
      this.prisma.sale.count({ where: { organizationId: orgId } }),
      this.prisma.sale.aggregate({
        where: { organizationId: orgId, createdAt: { gte: today, lt: tomorrow } },
        _sum: { totalAmount: true }, _count: true,
      }),
      this.prisma.sale.aggregate({
        where: { organizationId: orgId, createdAt: { gte: monthStart } },
        _sum: { totalAmount: true }, _count: true,
      }),
      this.prisma.sale.aggregate({
        where: { organizationId: orgId, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
        _sum: { totalAmount: true }, _count: true,
      }),
      // Orders (fulfillment)
      this.prisma.salesOrder.count({
        where: { organizationId: orgId, createdAt: { gte: today, lt: tomorrow },
          status: { notIn: [OrderStatus.CANCELLED, OrderStatus.REJECTED] } },
      }),
      this.prisma.salesOrder.aggregate({
        where: { organizationId: orgId, createdAt: { gte: monthStart },
          status: { notIn: [OrderStatus.CANCELLED, OrderStatus.REJECTED] } },
        _sum: { grandTotal: true }, _count: true,
      }),
      // Pipeline
      this.prisma.salesOrder.count({ where: { organizationId: orgId, status: OrderStatus.SUBMITTED } }),
      this.prisma.invoice.count({ where: { organizationId: orgId, createdAt: { gte: today, lt: tomorrow } } }),
      this.prisma.salesOrder.count({ where: { organizationId: orgId, status: { in: [OrderStatus.WAITING_FOR_WAREHOUSE, OrderStatus.PICKING, OrderStatus.PACKED] } } }),
      this.prisma.delivery.count({ where: { salesOrder: { organizationId: orgId }, status: 'OUT_FOR_DELIVERY' as any } }),
      this.prisma.delivery.count({ where: { salesOrder: { organizationId: orgId }, status: 'DELIVERED' as any, confirmedAt: { gte: today, lt: tomorrow } } }),
      // Inventory
      this.prisma.stockBalance.count({ where: { product: { organizationId: orgId } } }),
      this.prisma.stockBalance.count({ where: { product: { organizationId: orgId }, quantity: { gt: 0, lt: LOW_STOCK_THRESHOLD } } }),
      this.prisma.stockBalance.count({ where: { product: { organizationId: orgId }, quantity: { lte: 0 } } }),
      // Customers & Suppliers
      this.prisma.customer.count({ where: { organizationId: orgId } }),
      this.prisma.supplier.count({ where: { organizationId: orgId } }),
      // Expenses
      this.prisma.expense.aggregate({
        where: { organizationId: orgId, date: { gte: monthStart } },
        _sum: { amount: true },
      }),
      this.prisma.expense.aggregate({
        where: { organizationId: orgId, date: { gte: today, lt: tomorrow } },
        _sum: { amount: true },
      }),
      // Users
      this.prisma.user.count({ where: { organizationId: orgId, status: 'ACTIVE' } }),
      // Top 5 products by POS revenue this month
      this.prisma.sale.findMany({
        where: { organizationId: orgId, createdAt: { gte: monthStart } },
        include: { details: { include: { product: { select: { name: true } } } } },
      }),
    ]);

    // 7-day POS sales chart
    const allSalesThisWeek = await this.prisma.sale.findMany({
      where: { organizationId: orgId, createdAt: { gte: new Date(Date.now() - 6 * 86400000) } },
      select: { totalAmount: true, createdAt: true },
    });
    const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const salesByDay = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today); d.setDate(d.getDate() - (6 - i));
      const dayStart = new Date(d); dayStart.setHours(0,0,0,0);
      const dayEnd   = new Date(d); dayEnd.setHours(23,59,59,999);
      const amount = allSalesThisWeek
        .filter(s => new Date(s.createdAt) >= dayStart && new Date(s.createdAt) <= dayEnd)
        .reduce((sum, s) => sum + s.totalAmount, 0);
      return { name: DAYS[dayStart.getDay()], amount, isToday: i === 6 };
    });

    // Top products from POS this month
    const prodMap: Record<string, { name: string; revenue: number; qty: number }> = {};
    for (const sale of posWithDetails) {
      for (const d of sale.details) {
        const name = d.product?.name || 'Unknown';
        if (!prodMap[name]) prodMap[name] = { name, revenue: 0, qty: 0 };
        prodMap[name].revenue += d.price * d.quantity;
        prodMap[name].qty += d.quantity;
      }
    }
    const topProducts = Object.values(prodMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // Month-over-month POS sales change %
    const thisMonthRev  = monthSales._sum.totalAmount ?? 0;
    const lastMonthRev  = lastMonthSales._sum.totalAmount ?? 0;
    const revenueGrowth = lastMonthRev > 0 ? ((thisMonthRev - lastMonthRev) / lastMonthRev) * 100 : null;

    return {
      // Revenue
      todayRevenue:      todaySales._sum.totalAmount  ?? 0,
      todaySalesCount:   todaySales._count            ?? 0,
      monthRevenue:      thisMonthRev,
      monthSalesCount:   monthSales._count            ?? 0,
      revenueGrowth,
      // Orders
      ordersToday,
      ordersMonthCount:  ordersMonth._count           ?? 0,
      ordersMonthValue:  ordersMonth._sum.grandTotal  ?? 0,
      // Pipeline
      pipeline: { submitted, invoiced, inWarehouse, outForDelivery, deliveredToday },
      // Inventory
      inventory: { stockItems, lowStock, outOfStock },
      // Business health
      totalCustomers, totalSuppliers,
      activeUsers,
      // Expenses
      todayExpenses:  todayExpenses._sum.amount  ?? 0,
      monthExpenses:  monthExpenses._sum.amount  ?? 0,
      // Charts
      salesByDay,
      topProducts,
    };
  }

  async getSalesPerformance(orgId: string) {
    const orders = await this.prisma.salesOrder.findMany({
      where: {
        organizationId: orgId,
        status: { notIn: [OrderStatus.CANCELLED, OrderStatus.REJECTED] },
      },
      select: {
        salesRepId: true,
        grandTotal: true,
        status: true,
        salesRep: { select: { name: true } },
      },
    });

    const repMap: Record<string, {
      salesRepId: string;
      name: string;
      totalOrders: number;
      totalRevenue: number;
      submitted: number;
      approved: number;
      delivered: number;
    }> = {};

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
      if (order.status === OrderStatus.SUBMITTED) repMap[id].submitted += 1;
      const approvedStatuses: string[] = ['INVOICE_APPROVED', 'WAITING_FOR_WAREHOUSE', 'PICKING', 'READY_FOR_DELIVERY'];
      if (approvedStatuses.includes(order.status)) repMap[id].approved += 1;
      const deliveredStatuses: string[] = ['DELIVERED', 'COMPLETED'];
      if (deliveredStatuses.includes(order.status)) repMap[id].delivered += 1;
    }

    return Object.values(repMap).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  async getSystemDashboard() {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 6);
    lastWeek.setHours(0, 0, 0, 0);

    const [
      totalOrgs, newOrgsThisWeek,
      totalUsers, activeUsers,
      totalBranches
    ] = await Promise.all([
      this.prisma.organization.count(),
      this.prisma.organization.count({ where: { createdAt: { gte: lastWeek } } }),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: 'ACTIVE' } }),
      this.prisma.branch.count()
    ]);

    const recentOrgs = await this.prisma.organization.findMany({
      where: { createdAt: { gte: lastWeek } },
      select: { createdAt: true }
    });
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const orgSignupsByDay = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dayStart = new Date(d); dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d); dayEnd.setHours(23, 59, 59, 999);
      const count = recentOrgs.filter(o => {
        const c = new Date(o.createdAt);
        return c >= dayStart && c <= dayEnd;
      }).length;
      return { name: DAYS[dayStart.getDay()], signups: count, isToday: i === 6 };
    });

    return {
      stats: {
        totalOrgs, newOrgsThisWeek,
        totalUsers, activeUsers,
        totalBranches
      },
      orgSignupsByDay
    };
  }
}