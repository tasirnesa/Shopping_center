import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    AppBar, Toolbar, Typography, IconButton, Avatar,
} from '@mui/material';
import { Dashboard, Inventory, ShoppingCart, Logout } from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Products', icon: <Inventory />, path: '/products' },
    { text: 'Sales', icon: <ShoppingCart />, path: '/sales' },
];

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
            }}>
                <Toolbar>
                    <Typography variant="h6" noWrap fontWeight={700} sx={{ flexGrow: 1 }}>
                        🏪 Shop Center
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#fff', color: '#1e3c72', fontSize: 14, fontWeight: 700 }}>
                            {user?.email?.[0]?.toUpperCase() || 'U'}
                        </Avatar>
                        <Typography variant="body2">{user?.email}</Typography>
                        <IconButton color="inherit" onClick={handleLogout}><Logout /></IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" sx={{
                width: drawerWidth,
                '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
            }}>
                <Toolbar />
                <List>
                    {menuItems.map((item) => (
                        <ListItemButton
                            key={item.text}
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                            sx={{ borderRadius: 2, mx: 1, mb: 0.5 }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
