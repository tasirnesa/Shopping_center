import { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Grid,
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts';
import api from '../api';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'];

const summaryCards = [
    { title: 'Total Products', key: 'products', color: '#6366f1', icon: '📦' },
    { title: 'Total Sales', key: 'sales', color: '#22c55e', icon: '💰' },
    { title: 'Low Stock', key: 'lowStock', color: '#f59e0b', icon: '⚠️' },
    { title: 'Revenue', key: 'revenue', color: '#ef4444', icon: '📊' },
];

export default function DashboardPage() {
    const [stats, setStats] = useState({ products: 0, sales: 0, lowStock: 0, revenue: 0 });
    const [salesData, setSalesData] = useState<{ name: string; amount: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, salesRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/sales'),
                ]);
                const products = productsRes.data;
                const sales = salesRes.data;
                const revenue = sales.reduce((sum: number, s: any) => sum + s.totalAmount, 0);
                setStats({
                    products: products.length,
                    sales: sales.length,
                    lowStock: 0,
                    revenue,
                });
                // Mock weekly sales data
                setSalesData([
                    { name: 'Mon', amount: Math.floor(Math.random() * 5000) },
                    { name: 'Tue', amount: Math.floor(Math.random() * 5000) },
                    { name: 'Wed', amount: Math.floor(Math.random() * 5000) },
                    { name: 'Thu', amount: Math.floor(Math.random() * 5000) },
                    { name: 'Fri', amount: Math.floor(Math.random() * 5000) },
                    { name: 'Sat', amount: Math.floor(Math.random() * 5000) },
                    { name: 'Sun', amount: Math.floor(Math.random() * 5000) },
                ]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const pieData = [
        { name: 'Products', value: stats.products || 1 },
        { name: 'Sales', value: stats.sales || 1 },
        { name: 'Low Stock', value: stats.lowStock || 1 },
    ];

    return (
        <Box>
            <Typography variant="h4" fontWeight={700} mb={3}>Dashboard</Typography>
            <Grid container spacing={3} mb={4}>
                {summaryCards.map((card) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.key}>
                        <Paper sx={{
                            p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2,
                            background: `linear-gradient(135deg, ${card.color}22, ${card.color}11)`,
                            border: `1px solid ${card.color}33`,
                        }}>
                            <Typography fontSize={36}>{card.icon}</Typography>
                            <Box>
                                <Typography variant="body2" color="text.secondary">{card.title}</Typography>
                                <Typography variant="h5" fontWeight={700}>
                                    {card.key === 'revenue' ? `$${stats[card.key].toLocaleString()}` : stats[card.key as keyof typeof stats]}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight={600} mb={2}>Weekly Sales</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight={600} mb={2}>Overview</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
