import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Chip,
  Skeleton,
  Fade,
  useTheme,
  alpha,
} from "@mui/material";
import { Domain, Group } from "@mui/icons-material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Inventory2,
  ShoppingCart,
  WarningAmber,
  AttachMoney,
  TrendingUp,
  ShowChart,
  AdminPanelSettings,
} from "@mui/icons-material";
import api from "../api";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatCurrency(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getUser() {
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return {};
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = getUser();
  const isSystemAdmin = user?.role === "SYSTEM_ADMIN";

  if (isSystemAdmin) return <SystemAdminDashboard user={user} />;
  return <ShopDashboard user={user} navigate={navigate} />;
}

function ShopDashboard({ user, navigate }: { user: any, navigate: any }) {

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    sales: 0,
    lowStock: 0,
    revenue: 0,
  });
  const [salesData, setSalesData] = useState<
    { name: string; amount: number }[]
  >([]);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, salesRes, stockRes] = await Promise.all([
          api.get("/products"),
          api.get("/sales"),
          api.get("/inventory/stock-balance"),
        ]);
        const products = productsRes.data;
        const sales = salesRes.data;
        const stock = stockRes.data;

        const revenue = sales.reduce(
          (sum: number, s: any) => sum + s.totalAmount,
          0,
        );
        const lowItems = stock.filter((s: any) => s.quantity < 10);

        // Group sales by day of week (last 7 days)
        const dayMap: Record<string, number> = {};
        DAYS.forEach((d) => {
          dayMap[d] = 0;
        });
        sales.forEach((s: any) => {
          const day = DAYS[new Date(s.createdAt).getDay()];
          dayMap[day] = (dayMap[day] || 0) + s.totalAmount;
        });
        const chartData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
          (name) => ({
            name,
            amount: Math.round(dayMap[name] || 0),
          }),
        );

        setStats({
          products: products.length,
          sales: sales.length,
          lowStock: lowItems.length,
          revenue,
        });
        setSalesData(chartData);
        setRecentSales(sales.slice(-5).reverse());
        setLowStockItems(lowItems.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={48} />
        <Grid container spacing={3} mt={1}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton
                variant="rounded"
                height={100}
                sx={{ borderRadius: 3 }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  const userName = user?.email ? user.email.split("@")[0] : "Admin";
  const friendlyName = userName.charAt(0).toUpperCase() + userName.slice(1);

  const glassStyle = {
    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.75)})`,
    backdropFilter: "blur(12px)",
    border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
    borderRadius: "16px",
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.05)}`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: `0 16px 40px 0 ${alpha(theme.palette.common.black, 0.1)}`,
      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  };

  return (
    <Box
      sx={{ pb: { xs: 8, md: 2 }, mt: { xs: 3, sm: 4, md: 5 }, px: { md: 1 } }}
    >
      <Fade in={true} timeout={700}>
        <Box>
          <Box mb={2}>
            <PageHeader
              title={`Welcome back, ${friendlyName}! 👋`}
              subtitle="Here's a quick overview of your shop's performance today."
            />
          </Box>

          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Products"
                value={stats.products}
                icon={<Inventory2 />}
                color="#6366f1"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Sales"
                value={stats.sales}
                icon={<ShoppingCart />}
                color="#10b981"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Low Stock Items"
                value={stats.lowStock}
                icon={<WarningAmber />}
                color="#f59e0b"
                trend={stats.lowStock > 0 ? "Needs attention" : "All good"}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Revenue"
                value={formatCurrency(stats.revenue)}
                icon={<AttachMoney />}
                color="#ef4444"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper
                sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, ...glassStyle }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }}
                  >
                    <ShowChart color="primary" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Sales Overview
                  </Typography>
                </Box>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={salesData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="salesGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={alpha(theme.palette.divider, 0.5)}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: theme.palette.text.secondary,
                      }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: theme.palette.text.secondary,
                      }}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "none",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      }}
                      formatter={(v: number) => [formatCurrency(v), "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fill="url(#salesGrad)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              {(user?.role === "SYSTEM_ADMIN" || user?.role === "OWNER" || user?.role === "MANAGER") && (
                <Paper
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: 4,
                    mb: 3,
                    cursor: "pointer",
                    ...glassStyle,
                  }}
                  onClick={() => navigate("/admin")}
                >
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                      }}
                    >
                      <AdminPanelSettings color="info" />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        Administration
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Manage {user?.role === "SYSTEM_ADMIN" ? "Organizations" : "Users & Settings"}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}

              <Paper
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 4,
                  mb: 3,
                  ...glassStyle,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                    }}
                  >
                    <WarningAmber color="warning" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Low Stock Alert
                  </Typography>
                </Box>
                {lowStockItems.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    p={2}
                    textAlign="center"
                  >
                    All items are well stocked.
                  </Typography>
                ) : (
                  <Box display="flex" flexDirection="column" gap={1.5}>
                    {lowStockItems.map((item: any) => (
                      <Box
                        key={item.id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p={1.5}
                        sx={{
                          bgcolor: alpha(theme.palette.background.default, 0.5),
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ fontWeight: 600, maxWidth: "65%" }}
                        >
                          {item.product.name}
                        </Typography>
                        <Chip
                          label={`${item.quantity} left`}
                          size="small"
                          color={item.quantity <= 0 ? "error" : "warning"}
                          sx={{ fontWeight: "bold" }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>

              <Paper
                sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, ...glassStyle }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                    }}
                  >
                    <TrendingUp color="success" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Recent Transactions
                  </Typography>
                </Box>
                {recentSales.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    p={2}
                    textAlign="center"
                  >
                    No sales recorded yet.
                  </Typography>
                ) : (
                  <Box display="flex" flexDirection="column" gap={1.5}>
                    {recentSales.map((sale: any) => (
                      <Box
                        key={sale.id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p={1.5}
                        sx={{
                          bgcolor: alpha(theme.palette.background.default, 0.5),
                          borderRadius: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700 }}
                            color="primary.main"
                          >
                            {formatCurrency(sale.totalAmount)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(sale.createdAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${sale.details?.length || 0} ${sale.details?.length === 1 ? "item" : "items"}`}
                          size="small"
                          sx={{
                            bgcolor: "background.paper",
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Box>
  );
}

function SystemAdminDashboard({ user }: { user: any }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const theme = useTheme();

  useEffect(() => {
    api.get("/dashboard/system").then((res) => {
      setData(res.data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={48} />
        <Grid container spacing={3} mt={1}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Skeleton variant="rounded" height={100} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  const glassStyle = {
    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.75)})`,
    backdropFilter: "blur(12px)",
    border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
    borderRadius: "16px",
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.05)}`,
  };

  const stats = data?.stats || { totalOrgs: 0, newOrgsThisWeek: 0, totalUsers: 0, activeUsers: 0, totalBranches: 0 };
  const chartData = data?.orgSignupsByDay || [];

  const userName = user?.email ? user.email.split("@")[0] : "Admin";
  const friendlyName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <Box sx={{ pb: { xs: 8, md: 2 }, mt: { xs: 3, sm: 4, md: 5 }, px: { md: 1 } }}>
      <Fade in={true} timeout={700}>
        <Box>
          <Box mb={2}>
            <PageHeader
              title={`Welcome back, ${friendlyName}! 👋`}
              subtitle="Here's a quick overview of system-wide performance."
            />
          </Box>

          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Total Organizations"
                value={stats.totalOrgs}
                icon={<Domain />}
                color="#6366f1"
                trend={`${stats.newOrgsThisWeek} new this week`}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Active Users"
                value={stats.activeUsers}
                icon={<Group />}
                color="#10b981"
                trend={`${stats.totalUsers} total registered`}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Total Branches"
                value={stats.totalBranches}
                icon={<Storefront />}
                color="#f59e0b"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, ...glassStyle }}>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                    <ShowChart color="primary" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Organization Signups (Last 7 Days)
                  </Typography>
                </Box>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="orgGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme.palette.text.secondary }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} formatter={(v: number) => [v, "New Orgs"]} />
                    <Area type="monotone" dataKey="signups" stroke="#6366f1" strokeWidth={3} fill="url(#orgGrad)" animationDuration={1500} />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Box>
  );
}
