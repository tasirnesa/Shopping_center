import { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Paper, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions, IconButton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../api';

interface Product {
    id: string;
    name: string;
    barcode: string | null;
    price: number;
    cost: number;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [open, setOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [form, setForm] = useState({ name: '', barcode: '', price: '', cost: '' });
    const [search, setSearch] = useState('');

    const fetchProducts = async () => {
        const res = await api.get('/products');
        setProducts(res.data);
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleOpen = (product?: Product) => {
        if (product) {
            setEditProduct(product);
            setForm({
                name: product.name,
                barcode: product.barcode || '',
                price: String(product.price),
                cost: String(product.cost),
            });
        } else {
            setEditProduct(null);
            setForm({ name: '', barcode: '', price: '', cost: '' });
        }
        setOpen(true);
    };

    const handleSave = async () => {
        const data = {
            name: form.name,
            barcode: form.barcode || null,
            price: parseFloat(form.price),
            cost: parseFloat(form.cost),
        };
        if (editProduct) {
            await api.patch(`/products/${editProduct.id}`, data);
        } else {
            await api.post('/products', data);
        }
        setOpen(false);
        fetchProducts();
    };

    const handleDelete = async (id: string) => {
        await api.delete(`/products/${id}`);
        fetchProducts();
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.barcode && p.barcode.includes(search))
    );

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight={700}>Products</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Add Product
                </Button>
            </Box>

            <TextField
                placeholder="Search by name or barcode..."
                fullWidth
                size="small"
                sx={{ mb: 3 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                    <Box component="thead" sx={{ bgcolor: '#f5f5f5' }}>
                        <Box component="tr">
                            <Box component="th" sx={{ p: 2, textAlign: 'left' }}>Name</Box>
                            <Box component="th" sx={{ p: 2, textAlign: 'left' }}>Barcode</Box>
                            <Box component="th" sx={{ p: 2, textAlign: 'right' }}>Cost</Box>
                            <Box component="th" sx={{ p: 2, textAlign: 'right' }}>Price</Box>
                            <Box component="th" sx={{ p: 2, textAlign: 'center' }}>Actions</Box>
                        </Box>
                    </Box>
                    <Box component="tbody">
                        {filtered.map((p) => (
                            <Box component="tr" key={p.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                                <Box component="td" sx={{ p: 2 }}>{p.name}</Box>
                                <Box component="td" sx={{ p: 2 }}>{p.barcode || '—'}</Box>
                                <Box component="td" sx={{ p: 2, textAlign: 'right' }}>${p.cost.toFixed(2)}</Box>
                                <Box component="td" sx={{ p: 2, textAlign: 'right' }}>${p.price.toFixed(2)}</Box>
                                <Box component="td" sx={{ p: 2, textAlign: 'center' }}>
                                    <IconButton size="small" onClick={() => handleOpen(p)}><Edit fontSize="small" /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(p.id)}><Delete fontSize="small" /></IconButton>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
                <DialogContent>
                    <TextField label="Name" fullWidth margin="normal" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <TextField label="Barcode" fullWidth margin="normal" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
                    <TextField label="Cost" type="number" fullWidth margin="normal" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
                    <TextField label="Price" type="number" fullWidth margin="normal" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
