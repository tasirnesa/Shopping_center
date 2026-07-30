import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Warehouse,
  AttachMoney,
  AddShoppingCart,
  LocalOffer,
  ShoppingBasket,
} from "@mui/icons-material";
import api from "../api";
import PageHeader from "../components/PageHeader";

function formatCurrency(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function MiniBar({
  label,
  value,
  maxValue,
  color,
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}) {
  const width = maxValue > 0 ? Math.max((value / maxValue) * 100, 5) : 5;
  return (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ fontWeight: 700 }}
        >
          {label.includes("$") ||
          label.includes("cost") ||
          label.includes("rev")
            ? `${value.toFixed(2)}`
            : value}
        </Typography>
      </Box>
      <Box
        sx={{
          height: 10,
          bgcolor: "grey.200",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: `${Math.min(width, 100)}%`,
            bgcolor: color,
            borderRadius: 5,
          }}
        />
      </Box>
    </Box>
  );
}

function StatCard({ icon, bgColor, title, value, subtitle }: any) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 2.5,
        height: "100%",
        bgcolor: bgColor,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color="text.primary" sx={{ fontWeight: 800 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, display: "block" }}
        >
          {subtitle}
        </Typography>
      )}
    </Card>
  );
}

function SalesReportView() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/sales").then((res) => {
      setSales(res.data);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalDiscount = sales.reduce((sum, s) => sum + (s.discount || 0), 0);
    const totalItems = sales.reduce(
      (sum, s) =>
        sum + s.details.reduce((ds: number, d: any) => ds + d.quantity, 0),
      0,
    );
    const avgOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0;

    const dailySales: { [key: string]: number } = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      dailySales[key] = 0;
    }
    sales.forEach((s) => {
      const key = new Date(s.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      if (dailySales[key] !== undefined) dailySales[key] += s.totalAmount;
    });

    const productMap: {
      [key: string]: { name: string; revenue: number; qty: number };
    } = {};
    sales.forEach((s) => {
      s.details.forEach((d: any) => {
        const name = d.product?.name || "Unknown";
        if (!productMap[name]) productMap[name] = { name, revenue: 0, qty: 0 };
        productMap[name].revenue += d.price * d.quantity;
        productMap[name].qty += d.quantity;
      });
    });
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    return {
      totalRevenue,
      totalDiscount,
      totalItems,
      avgOrderValue,
      dailySales,
      topProducts,
    };
  }, [sales]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  const maxDaily = Math.max(...Object.values(stats.dailySales), 1);
  const maxProduct =
    stats.topProducts.length > 0 ? stats.topProducts[0].revenue : 1;

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid xs={12} sm={6} md={3}>
          <Box sx={{ p: 1, height: "100%" }}>
            <StatCard
              icon={<AttachMoney sx={{ color: "#059669" }} />}
              bgColor="#f0fdf4"
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Box sx={{ p: 1, height: "100%" }}>
            <StatCard
              icon={<ShoppingBasket sx={{ color: "#7c3aed" }} />}
              bgColor="#faf5ff"
              title="Transactions"
              value={sales.length.toString()}
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Box sx={{ p: 1, height: "100%" }}>
            <StatCard
              icon={<LocalOffer sx={{ color: "#ea580c" }} />}
              bgColor="#fff7ed"
              title="Discounts Given"
              value={formatCurrency(stats.totalDiscount)}
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Box sx={{ p: 1, height: "100%" }}>
            <StatCard
              icon={<AddShoppingCart sx={{ color: "#0284c7" }} />}
              bgColor="#f0f9ff"
              title="Avg. Order"
              value={formatCurrency(stats.avgOrderValue)}
              subtitle={`${stats.totalItems} items sold`}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Box sx={{ p: 1.5, height: "100%" }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Daily Sales (Last 7 Days)
              </Typography>
              {Object.entries(stats.dailySales).map(([day, val]) => (
                <MiniBar
                  key={day}
                  label={day}
                  value={val}
                  maxValue={maxDaily}
                  color="#6366f1"
                />
              ))}
            </Paper>
          </Box>
        </Grid>
        <Grid xs={12} md={6}>
          <Box sx={{ p: 1.5, height: "100%" }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Top Products by Revenue
              </Typography>
              {stats.topProducts.length === 0 && (
                <Typography color="text.secondary">
                  No sales data yet.
                </Typography>
              )}
              {stats.topProducts.map((p, idx) => (
                <Box
                  key={p.name}
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        idx === 0
                          ? "#f59e0b"
                          : idx === 1
                            ? "#94a3b8"
                            : "#d97706",
                      color: "#fff",
                      mr: 2,
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      {idx + 1}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <MiniBar
                      label={`${p.name} (${p.qty} sold)`}
                      value={p.revenue}
                      maxValue={maxProduct}
                      color="#10b981"
                    />
                  </Box>
                </Box>
              ))}
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function InventoryReportView() {
  const [stockData, setStockData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/inventory/stock-balance"),
      api.get("/inventory/transactions"),
    ]).then(([stockRes, txRes]) => {
      setStockData(stockRes.data);
      setTransactions(txRes.data);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const totalProducts = new Set(stockData.map((s) => s.productId)).size;
    const totalUnits = stockData.reduce((sum, s) => sum + s.quantity, 0);
    const outOfStock = stockData.filter((s) => s.quantity <= 0).length;
    const lowStock = stockData.filter(
      (s) => s.quantity > 0 && s.quantity < 10,
    ).length;
    const totalValue = stockData.reduce(
      (sum, s) => sum + s.quantity * (s.product?.price || 0),
      0,
    );

    const totalIn = transactions
      .filter((t) => t.type === "IN")
      .reduce((sum, t) => sum + t.quantity, 0);
    const totalOut = transactions
      .filter((t) => t.type === "OUT")
      .reduce((sum, t) => sum + t.quantity, 0);

    const categoryMap: { [key: string]: number } = {};
    stockData.forEach((s) => {
      const catName = s.product?.category?.name || "Uncategorized";
      categoryMap[catName] = (categoryMap[catName] || 0) + s.quantity;
    });

    return {
      totalProducts,
      totalUnits,
      outOfStock,
      lowStock,
      totalValue,
      totalIn,
      totalOut,
      categoryMap,
    };
  }, [stockData, transactions]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  const maxCategory = Math.max(...Object.values(stats.categoryMap), 1);

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid xs={12} sm={6} md={3}>
          <Box sx={{ p: 1, height: "100%" }}>
            <StatCard
              icon={<Warehouse sx={{ color: "#059669" }} />}
              bgColor="#f0fdf4"
              title="Products"
              value={stats.totalProducts.toString()}
              subtitle={`${stats.totalUnits} total units`}
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Box sx={{ p: 1, height: "100%" }}>
            <StatCard
              icon={<AttachMoney sx={{ color: "#7c3aed" }} />}
              bgColor="#faf5ff"
              title="Stock Value"
              value={formatCurrency(stats.totalValue)}
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Box sx={{ p: 1, height: "100%" }}>
            <StatCard
              icon={<TrendingDown sx={{ color: "#ef4444" }} />}
              bgColor="#fef2f2"
              title="Out of Stock"
              value={stats.outOfStock.toString()}
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Box sx={{ p: 1, height: "100%" }}>
            <StatCard
              icon={<LocalOffer sx={{ color: "#f59e0b" }} />}
              bgColor="#fffbeb"
              title="Low Stock"
              value={stats.lowStock.toString()}
              subtitle="< 10 units"
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid xs={12} md={5}>
          <Box sx={{ p: 1.5, height: "100%" }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Stock Movement
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Box>
                  <TrendingUp sx={{ fontSize: 48, color: "#10b981" }} />
                  <Typography
                    variant="h4"
                    color="#10b981"
                    sx={{ fontWeight: 900, mt: 1 }}
                  >
                    {stats.totalIn}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Units IN
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <TrendingDown sx={{ fontSize: 48, color: "#ef4444" }} />
                  <Typography
                    variant="h4"
                    color="#ef4444"
                    sx={{ fontWeight: 900, mt: 1 }}
                  >
                    {stats.totalOut}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Units OUT
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
        <Grid xs={12} md={7}>
          <Box sx={{ p: 1.5, height: "100%" }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Stock by Category
              </Typography>
              {Object.entries(stats.categoryMap).length === 0 && (
                <Typography color="text.secondary">No stock data.</Typography>
              )}
              {Object.entries(stats.categoryMap)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, qty]) => (
                  <MiniBar
                    key={cat}
                    label={`${cat} (${qty} units)`}
                    value={qty as number}
                    maxValue={maxCategory}
                    color="#8b5cf6"
                  />
                ))}
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function ProfitReportView() {
  const [sales, setSales] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/sales"),
      api.get("/inventory/purchases"),
      api.get("/products"),
    ]).then(([salesRes, pRes, prodRes]) => {
      setSales(salesRes.data);
      setPurchases(pRes.data);
      setProducts(prodRes.data);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalDiscount = sales.reduce((sum, s) => sum + (s.discount || 0), 0);
    const totalCOGS = sales.reduce(
      (sum, s) =>
        sum +
        s.details.reduce((ds: number, d: any) => {
          const p = products.find((x) => x.id === d.productId);
          return ds + (p?.cost || 0) * d.quantity;
        }, 0),
      0,
    );
    const totalPurchases = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const grossProfit = totalRevenue - totalCOGS;
    const grossMargin =
      totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    const productProfitMap: {
      [key: string]: {
        name: string;
        revenue: number;
        cost: number;
        profit: number;
      };
    } = {};
    sales.forEach((s) => {
      s.details.forEach((d: any) => {
        const p = products.find((x) => x.id === d.productId);
        const cost = (p?.cost || 0) * d.quantity;
        const revenue = d.price * d.quantity;
        const name = d.product?.name || "Unknown";
        if (!productProfitMap[name])
          productProfitMap[name] = { name, revenue: 0, cost: 0, profit: 0 };
        productProfitMap[name].revenue += revenue;
        productProfitMap[name].cost += cost;
        productProfitMap[name].profit += revenue - cost;
      });
    });
    const topProfitable = Object.values(productProfitMap)
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5);

    return {
      totalRevenue,
      totalDiscount,
      totalCOGS,
      totalPurchases,
      grossProfit,
      grossMargin,
      topProfitable,
    };
  }, [sales, purchases, products]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  const maxProfit =
    stats.topProfitable.length > 0
      ? Math.max(stats.topProfitable[0].profit, 1)
      : 1;

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          mb: 3,
          textAlign: "center",
          bgcolor: stats.grossProfit >= 0 ? "#f0fdf4" : "#fef2f2",
        }}
      >
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ fontWeight: 700 }}
        >
          Gross Profit
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            color: stats.grossProfit >= 0 ? "#059669" : "#ef4444",
            my: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {formatCurrency(stats.grossProfit)}
        </Typography>
        <Chip
          label={`${stats.grossMargin.toFixed(1)}% margin`}
          sx={{
            bgcolor: stats.grossMargin >= 20 ? "#dcfce7" : "#fef3c7",
            color: stats.grossMargin >= 20 ? "#15803d" : "#b45309",
            fontWeight: "bold",
          }}
        />
      </Paper>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid xs={12} sm={6} md={3}>
          <Box sx={{ p: 1, height: "100%" }}>
            <StatCard
              icon={<AttachMoney sx={{ color: "#059669" }} />}
              bgColor="#f0fdf4"
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Box sx={{ p: 1, height: "100%" }}>
            <StatCard
              icon={<TrendingDown sx={{ color: "#ef4444" }} />}
              bgColor="#fef2f2"
              title="COGS"
              value={formatCurrency(stats.totalCOGS)}
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Box sx={{ p: 1, height: "100%" }}>
            <StatCard
              icon={<Warehouse sx={{ color: "#0284c7" }} />}
              bgColor="#f0f9ff"
              title="Total Purchases"
              value={formatCurrency(stats.totalPurchases)}
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Box sx={{ p: 1, height: "100%" }}>
            <StatCard
              icon={<LocalOffer sx={{ color: "#f59e0b" }} />}
              bgColor="#fffbeb"
              title="Total Discounts"
              value={formatCurrency(stats.totalDiscount)}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Box sx={{ p: 1.5, height: "100%" }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Profit Breakdown
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1.5,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography color="text.secondary">Revenue</Typography>
                <Typography sx={{ fontWeight: 700, color: "#10b981" }}>
                  +{formatCurrency(stats.totalRevenue)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1.5,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography color="text.secondary">
                  Cost of Goods Sold
                </Typography>
                <Typography sx={{ fontWeight: 700, color: "#ef4444" }}>
                  -{formatCurrency(stats.totalCOGS)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1.5,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography color="text.secondary">Discounts</Typography>
                <Typography sx={{ fontWeight: 700, color: "#f59e0b" }}>
                  -{formatCurrency(stats.totalDiscount)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 2,
                  mt: 1,
                  px: 2,
                  borderRadius: 2,
                  bgcolor: stats.grossProfit >= 0 ? "#f0fdf4" : "#fef2f2",
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>Gross Profit</Typography>
                <Typography
                  sx={{
                    fontWeight: 900,
                    color: stats.grossProfit >= 0 ? "#059669" : "#ef4444",
                  }}
                >
                  {formatCurrency(stats.grossProfit)}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>
        <Grid xs={12} md={6}>
          <Box sx={{ p: 1.5, height: "100%" }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Most Profitable Products
              </Typography>
              {stats.topProfitable.length === 0 && (
                <Typography color="text.secondary">
                  No sales data yet.
                </Typography>
              )}
              {stats.topProfitable.map((p, idx) => (
                <Box
                  key={p.name}
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        idx === 0
                          ? "#f59e0b"
                          : idx === 1
                            ? "#94a3b8"
                            : "#d97706",
                      color: "#fff",
                      mr: 2,
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      {idx + 1}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <MiniBar
                      label={`${p.name} ($${p.revenue.toFixed(0)} rev - $${p.cost.toFixed(0)} cost)`}
                      value={p.profit}
                      maxValue={maxProfit}
                      color="#059669"
                    />
                  </Box>
                </Box>
              ))}
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function ReportsPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <PageHeader
        title="Reports"
        subtitle="Analyze your business performance and inventory"
        breadcrumb="Reports"
      />
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          aria-label="report tabs"
        >
          <Tab label="Sales" />
          <Tab label="Inventory" />
          <Tab label="Profit" />
        </Tabs>
      </Box>
      {tab === 0 && <SalesReportView />}
      {tab === 1 && <InventoryReportView />}
      {tab === 2 && <ProfitReportView />}
    </Box>
  );
}
