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
}