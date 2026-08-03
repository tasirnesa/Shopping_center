import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const LOW_STOCK_THRESHOLD = 10;

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

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
}
