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
} from "@mui/icons-material";
import { sidebarGradient } from "../theme";

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
  { text: "Inventory", icon: <Inventory2 />, path: "/inventory", roles: null },
  { text: "Reports", icon: <BarChart />, path: "/reports", roles: null },
  {
    text: "Admin",
    icon: <AdminPanelSettings />,
    path: "/admin",
    roles: ["OWNER", "MANAGER"],
  },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const menuItems = allMenuItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role),
  );

  const handleLogout = () => {
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
            sx={{ fontWeight: 800 }}
            sx={{ flexGrow: 1, letterSpacing: "-0.02em" }}
          >
            {user?.organization?.name || "Shop Center"}
          </Typography>
          <Box display="flex" alignItems="center" gap={1.5}>
            {user?.role && (
              <Chip
                label={user.role.replace("_", " ")}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600, display: { xs: "none", sm: "flex" } }}
              />
            )}
            <Tooltip title={user?.email || "User"}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "primary.main",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {(user?.name || user?.email)?.[0]?.toUpperCase() || "U"}
              </Avatar>
            </Tooltip>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500 }}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              {user?.name || user?.email}
            </Typography>
            <Tooltip title="Sign out">
              <IconButton
                onClick={handleLogout}
                size="small"
                sx={{
                  color: "text.secondary",
                  mt: 1.5,
                  transition: "0.2s",
                  "&:hover": { color: "error.main", transform: "scale(1.1)" },
                }}
              >
                <Logout fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
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
