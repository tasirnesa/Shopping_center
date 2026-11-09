import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Tooltip,
  alpha,
  Select,
  MenuItem,
  FormControl,
  Menu,
  Divider,
} from "@mui/material";
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  Logout,
  Inventory2,
  AdminPanelSettings,
  Storefront,
  BarChart,
  LocalShipping,
  Domain,
  Group,
  PeopleAlt,
  AccountBalance,
  Notifications,
  NotificationsNone,
  Chat,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { useDarkMode } from "../App";
import { sidebarGradient } from "../theme";
import api from "../api";

const drawerWidth = 260;

function getUser() {
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return {};
}

const allMenuItems = [
  // Dashboard — all roles
  { text: "Dashboard",   icon: <Dashboard />,           path: "/",              roles: ["OWNER", "MANAGER", "CASHIER", "STORE_KEEPER", "SALES_REP", "INVOICE_MAKER", "STORE_MAN", "DRIVER"] },
  // Products — inventory managers only
  { text: "Products",    icon: <Inventory />,            path: "/products",      roles: ["OWNER", "MANAGER", "STORE_KEEPER"] },
  // Sales / POS — cashier and above
  { text: "Sales",       icon: <ShoppingCart />,         path: "/sales",         roles: ["OWNER", "MANAGER", "CASHIER", "SALES_REP"] },
  // Orders — fulfillment pipeline roles
  {
    text: "Orders",      icon: <LocalShipping />,         path: "/orders",
    roles: ["SALES_REP", "INVOICE_MAKER", "STORE_MAN", "DRIVER", "MANAGER", "OWNER"],
  },
  // Customers — sales + management
  {
    text: "Customers",   icon: <PeopleAlt />,             path: "/customers",
    roles: ["OWNER", "MANAGER", "INVOICE_MAKER", "SALES_REP"],
  },
  // Inventory — warehouse roles
  { text: "Inventory",   icon: <Inventory2 />,           path: "/inventory",     roles: ["OWNER", "MANAGER", "STORE_KEEPER", "STORE_MAN"] },
  // Expenses — management only
  {
    text: "Expenses",    icon: <AccountBalance />,        path: "/expenses",
    roles: ["OWNER", "MANAGER"],
  },
  // Chat — all org users (not SYSTEM_ADMIN)
  {
    text: "Chat",        icon: <Chat />,                  path: "/chat",
    roles: ["OWNER", "MANAGER", "SALES_REP", "INVOICE_MAKER", "STORE_MAN", "DRIVER", "CASHIER", "STORE_KEEPER"],
  },
  // Reports — management only
  { text: "Reports",     icon: <BarChart />,              path: "/reports",       roles: ["OWNER", "MANAGER"] },
  // System Admin only
  {
    text: "Organizations", icon: <Domain />,              path: "/organizations", roles: ["SYSTEM_ADMIN"],
  },
  {
    text: "Users",       icon: <Group />,                 path: "/users",         roles: ["SYSTEM_ADMIN"],
  },
  {
    text: "Admin",       icon: <AdminPanelSettings />,    path: "/admin",
    roles: ["OWNER", "MANAGER"],
  },
];

function AdminOrgSwitcher() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [selected, setSelected] = useState(
    localStorage.getItem("admin_active_org") || "",
  );

  useEffect(() => {
    api
      .get("/organizations")
      .then((res) => {
        setOrgs(res.data);
      })
      .catch((err) => console.error("Could not fetch orgs", err));
  }, []);

  const handleChange = (e: any) => {
    const val = e.target.value;
    setSelected(val);
    if (val) {
      localStorage.setItem("admin_active_org", val);
    } else {
      localStorage.removeItem("admin_active_org");
    }
    window.location.reload(); // Global strict reload on context switch
  };

  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <Select
        value={selected}
        onChange={handleChange}
        displayEmpty
        sx={{
          height: 36,
          fontSize: "0.875rem",
          fontWeight: 600,
          bgcolor: "action.hover",
          borderRadius: 2,
        }}
      >
        <MenuItem value="">
          <em>-- All Platform --</em>
        </MenuItem>
        {orgs.map((o) => (
          <MenuItem key={o.id} value={o.id}>
            {o.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const fetchNotifs = () => {
      api.get("/notifications").then((r) => setNotifications(r.data)).catch(() => {});
    };
    fetchNotifs();
    const id = setInterval(fetchNotifs, 30000);
    return () => clearInterval(id);
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch {}
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const menuItems = allMenuItems.filter((item) => {
    if (user?.role === "SYSTEM_ADMIN") {
      return ["Dashboard", "Organizations", "Users"].includes(item.text);
    }
    return item.roles.includes(user?.role);
  });

  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Storefront sx={{ color: "primary.main", fontSize: 28 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, flexGrow: 1, letterSpacing: "-0.02em" }}
          >
            {user?.organization?.name || "Shop Center"}
          </Typography>

          {/* Dark mode toggle */}
          <Tooltip title={isDark ? "Light mode" : "Dark mode"}>
            <IconButton size="small" onClick={toggleDark}>
              {isDark ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* Notifications Bell */}
          <Tooltip title="Notifications">
            <IconButton
              size="small"
              onClick={(e) => setNotifAnchor(e.currentTarget)}
              sx={{ position: "relative" }}
            >
              {unreadCount > 0 ? (
                <Notifications sx={{ color: "warning.main" }} />
              ) : (
                <NotificationsNone />
              )}
              {unreadCount > 0 && (
                <Box sx={{
                  position: "absolute", top: 4, right: 4,
                  width: 16, height: 16, borderRadius: "50%",
                  bgcolor: "error.main", color: "#fff",
                  fontSize: 10, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Box>
              )}
            </IconButton>
          </Tooltip>

          {/* Notifications dropdown */}
          <Menu
            anchorEl={notifAnchor}
            open={Boolean(notifAnchor)}
            onClose={() => setNotifAnchor(null)}
            slotProps={{ paper: { sx: { width: 340, maxHeight: 480, mt: 1.5, borderRadius: 2 } } }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ px: 2.5, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
              <Typography fontWeight={700}>Notifications</Typography>
            </Box>
            {notifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <NotificationsNone sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
                <Typography variant="body2" color="text.secondary">No notifications</Typography>
              </Box>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <MenuItem
                  key={n.id}
                  onClick={() => { markRead(n.id); setNotifAnchor(null); }}
                  sx={{
                    whiteSpace: "normal",
                    bgcolor: n.read ? "transparent" : "primary.50",
                    borderLeft: n.read ? "none" : "3px solid",
                    borderColor: "primary.main",
                    py: 1.5, px: 2.5,
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight={n.read ? 400 : 700}>
                      {n.payload?.customerName
                        ? `Order from ${n.payload.customerName}`
                        : n.type?.replace(/_/g, " ") || "Notification"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(n.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
          </Menu>

          <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 1, p: 0.5, border: '2px solid transparent', transition: '0.2s', '&:hover': { borderColor: 'primary.main' } }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", fontSize: 14, fontWeight: 700 }}>
              {(user?.name || user?.email)?.[0]?.toUpperCase() || "U"}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            slotProps={{ paper: { sx: { width: 260, mt: 1.5, borderRadius: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', overflow: 'visible', '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0 } } } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2.5, py: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }} noWrap>{user?.name || user?.email}</Typography>
              {user?.role && <Typography variant="caption" sx={{ color: "text.secondary", textTransform: 'capitalize', fontWeight: 500 }}>{user.role.replace("_", " ").toLowerCase()} Account</Typography>}
            </Box>

            {user?.role === "SYSTEM_ADMIN" && (
              <Box>
                <Divider />
                <Box sx={{ px: 2.5, py: 2, bgcolor: 'action.hover' }}>
                  <Typography variant="overline" sx={{ display: 'block', mb: 1, color: "text.secondary", fontWeight: 700, letterSpacing: '0.05em' }}>Switch Organization</Typography>
                  <AdminOrgSwitcher />
                </Box>
              </Box>
            )}

            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1.5, px: 2.5 }}>
              <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
              <ListItemText primary="Sign out" primaryTypographyProps={{ fontWeight: 600 }} />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "none",
            background: sidebarGradient,
            color: "#fff",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ px: 2, py: 2 }}>
          <Typography
            variant="overline"
            sx={{ opacity: 0.6, letterSpacing: "0.1em", fontSize: "0.65rem" }}
          >
            Navigation
          </Typography>
        </Box>
        <List sx={{ px: 1.5 }}>
          {menuItems.map((item) => {
            const selected = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.text}
                selected={selected}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2.5,
                  mb: 0.5,
                  py: 1.25,
                  color: "#fff",
                  "&.Mui-selected": {
                    bgcolor: alpha("#fff", 0.18),
                    "&:hover": { bgcolor: alpha("#fff", 0.22) },
                  },
                  "&:hover": { bgcolor: alpha("#fff", 0.1) },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: selected ? 700 : 500,
                    fontSize: "0.9375rem",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
        <Box sx={{ mt: "auto", p: 2, opacity: 0.5 }}>
          <Typography variant="caption">{user?.organization?.businessType || "Retail"} Management System</Typography>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
