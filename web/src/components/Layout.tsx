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
  Chip,
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
} from "@mui/icons-material";
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
  { text: "Dashboard", icon: <Dashboard />, path: "/", roles: null },
  { text: "Products", icon: <Inventory />, path: "/products", roles: null },
  { text: "Sales", icon: <ShoppingCart />, path: "/sales", roles: null },
  {
    text: "Orders",
    icon: <LocalShipping />,
    path: "/orders",
    roles: ["SALES_REP", "INVOICE_MAKER", "STORE_MAN", "DRIVER", "MANAGER", "OWNER", "SYSTEM_ADMIN"],
  },
  { text: "Inventory", icon: <Inventory2 />, path: "/inventory", roles: null },
  { text: "Reports", icon: <BarChart />, path: "/reports", roles: null },
  {
    text: "Admin",
    icon: <AdminPanelSettings />,
    path: "/admin",
    roles: ["SYSTEM_ADMIN", "OWNER", "MANAGER"],
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

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const menuItems = allMenuItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role),
  );

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

          <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 2, p: 0.5, border: '2px solid transparent', transition: '0.2s', '&:hover': { borderColor: 'primary.main' } }}>
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
