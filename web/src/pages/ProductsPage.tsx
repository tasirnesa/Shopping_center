import { useEffect, useState } from 'react';
import {
  Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Select, MenuItem, InputLabel, FormControl, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, InputAdornment,
  CircularProgress, Alert, Typography,
} from '@mui/material';
import { Add, Edit, Delete, Search, Inventory } from '@mui/icons-material';
import api from '../api';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';

interface Product {
  id: string;
  name: string;
  barcode: string | null;
  price: number;
  cost: number;
  categoryId?: string;
  brandId?: string;
  unitId?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', barcode: '', price: '', cost: '', categoryId: '', brandId: '', unitId: '' });
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  const lookup = (list: any[], id?: string) => list.find((x) => x.id === id)?.name || '—';

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [pRes, cRes, bRes, uRes] = await Promise.all([
        api.get('/products'),
        api.get('/foundation/categories'),
        api.get('/foundation/brands'),
        api.get('/foundation/units'),
      ]);
      setProducts(pRes.data);
      setCategories(cRes.data);
      setBrands(bRes.data);
      setUnits(uRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleOpen = (product?: Product) => {
    setError('');
    if (product) {
      setEditProduct(product);
      setForm({
        name: product.name,
        barcode: product.barcode || '',
        price: String(product.price),
        cost: String(product.cost),
        categoryId: product.categoryId || '',
        brandId: product.brandId || '',
        unitId: product.unitId || '',
      });
    } else {
      setEditProduct(null);
      setForm({ name: '', barcode: '', price: '', cost: '', categoryId: '', brandId: '', unitId: '' });
    }
    setOpen(true);
  };

  const handleSave = async () => {
    setError('');
    try {
      const data = {
        name: form.name,
        barcode: form.barcode || null,
        price: parseFloat(form.price),
        cost: parseFloat(form.cost),
        categoryId: form.categoryId || null,
        brandId: form.brandId || null,
        unitId: form.unitId || null,
      };
      if (editProduct) {
        await api.patch(`/products/${editProduct.id}`, data);
      } else {
        await api.post('/products', data);
      }
      setOpen(false);
      fetchProducts();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.barcode && p.barcode.includes(search)),
  );

  return (
    <Box>
      <PageHeader
        title="Products"
        subtitle={`${products.length} products in catalog`}
        breadcrumb="Products"
        action={
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
            Add Product
          </Button>
        }
      />

      <TextField
        placeholder="Search by name or barcode…"
        fullWidth
        size="small"
        sx={{ mb: 2.5, maxWidth: 400 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start"><Search fontSize="small" color="action" /></InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Inventory />}
            title={search ? 'No products match your search' : 'No products yet'}
            description={search ? 'Try a different search term.' : 'Add your first product to get started.'}
            action={!search ? { label: 'Add Product', onClick: () => handleOpen() } : undefined}
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Barcode</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell align="right">Cost</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Margin</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((p) => {
                const margin = p.price > 0 ? ((p.price - p.cost) / p.price * 100).toFixed(0) : '0';
                return (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Box fontWeight={600}>{p.name}</Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                        {p.barcode || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>{lookup(categories, p.categoryId)}</TableCell>
                    <TableCell>{lookup(brands, p.brandId)}</TableCell>
                    <TableCell>{lookup(units, p.unitId)}</TableCell>
                    <TableCell align="right">${p.cost.toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>${p.price.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Chip label={`${margin}%`} size="small" color={Number(margin) > 20 ? 'success' : 'default'} variant="outlined" />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => handleOpen(p)}><Edit fontSize="small" /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(p.id)}><Delete fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{editProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField label="Name" fullWidth margin="normal" size="small" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Barcode" fullWidth margin="normal" size="small" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
          <Box display="flex" gap={2}>
            <TextField label="Cost" type="number" fullWidth margin="normal" size="small" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
            <TextField label="Price" type="number" fullWidth margin="normal" size="small" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </Box>
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Category</InputLabel>
            <Select value={form.categoryId} label="Category" onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <MenuItem value=""><em>None</em></MenuItem>
              {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Brand</InputLabel>
            <Select value={form.brandId} label="Brand" onChange={(e) => setForm({ ...form, brandId: e.target.value })}>
              <MenuItem value=""><em>None</em></MenuItem>
              {brands.map((b) => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Unit</InputLabel>
            <Select value={form.unitId} label="Unit" onChange={(e) => setForm({ ...form, unitId: e.target.value })}>
              <MenuItem value=""><em>None</em></MenuItem>
              {units.map((u) => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.name || !form.price}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}