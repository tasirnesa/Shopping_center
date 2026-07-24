import { useEffect, useState, useMemo } from 'react';
import {
  Box, Button, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Autocomplete, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, CircularProgress, Alert, Typography, FormControl, InputLabel,
  Select, MenuItem, Divider, Grid,
} from '@mui/material';
import { Add, Delete, ShoppingCart, Visibility, Receipt } from '@mui/icons-material';
import api from '../api';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';

interface Product {
  id: string;
  name: string;
  price: number;
  barcode?: string | null;
}

interface SaleLine {
  productId: string;
  product: Product | null;
  quantity: number;
}

function formatCurrency(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [detailSale, setDetailSale] = useState<any | null>(null);
  const [error, setError] = useState('');

  const [shopId, setShopId] = useState('');
  const [lines, setLines] = useState<SaleLine[]>([{ productId: '', product: null, quantity: 1 }]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salesRes, productsRes, shopsRes] = await Promise.all([
        api.get('/sales'),
        api.get('/products'),
        api.get('/foundation/shops'),
      ]);
      setSales(salesRes.data);
      setProducts(productsRes.data);
      setShops(shopsRes.data);
      if (shopsRes.data.length > 0) {
        setShopId((prev) => prev || shopsRes.data[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const cartTotal = useMemo(
    () => lines.reduce((sum, l) => sum + (l.product?.price ?? 0) * l.quantity, 0),
    [lines],
  );

  const resetForm = () => {
    setLines([{ productId: '', product: null, quantity: 1 }]);
    setError('');
    if (shops.length > 0) setShopId(shops[0].id);
  };

  const handleOpen = () => {
    resetForm();
    setOpen(true);
  };

  const updateLine = (index: number, patch: Partial<SaleLine>) => {
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  };

  const handleCreateSale = async () => {
    setError('');
    const validLines = lines.filter((l) => l.product);
    if (validLines.length === 0) {
      setError('Add at least one product.');
      return;
    }
    if (!shopId) {
      setError('Create a shop in Admin first, then try again.');
      return;
    }
    try {
      await api.post('/sales', {
        shopId,
        totalAmount: cartTotal,
        details: {
          create: validLines.map((l) => ({
            productId: l.product!.id,
            quantity: l.quantity,
            price: l.product!.price,
          })),
        },
      });
      setOpen(false);
      fetchData();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create sale');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Sales"
        subtitle={`${sales.length} transactions recorded`}
        breadcrumb="Sales"
        action={
          <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
            New Sale
          </Button>
        }
      />

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
        ) : sales.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart />}
            title="No sales yet"
            description="Record your first sale to track revenue and inventory movement."
            action={{ label: 'New Sale', onClick: handleOpen }}
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sale</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Shop</TableCell>
                <TableCell align="center">Items</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} fontFamily="monospace">
                      #{shortId(sale.id)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </TableCell>
                  <TableCell>{sale.shop?.name || '—'}</TableCell>
                  <TableCell align="center">
                    <Chip label={sale.details?.length ?? 0} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={700}>{formatCurrency(sale.totalAmount)}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => setDetailSale(sale)} aria-label="View sale">
                      <Visibility fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* New sale */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle fontWeight={700}>New Sale</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {shops.length === 0 ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No shop configured. Go to Admin → Shops & Branches to create one before selling.
            </Alert>
          ) : (
            <FormControl fullWidth size="small" sx={{ mt: 1, mb: 2 }}>
              <InputLabel>Shop</InputLabel>
              <Select value={shopId} label="Shop" onChange={(e) => setShopId(e.target.value)}>
                {shops.map((s) => (
                  <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Typography variant="subtitle2" color="text.secondary" mb={1}>Line items</Typography>
          {lines.map((line, i) => (
            <Grid container spacing={1.5} key={i} alignItems="center" sx={{ mb: 1.5 }}>
              <Grid item xs={12} sm={7}>
                <Autocomplete
                  size="small"
                  options={products}
                  getOptionLabel={(o) => `${o.name} — ${formatCurrency(o.price)}`}
                  value={line.product}
                  onChange={(_, v) => updateLine(i, { product: v, productId: v?.id ?? '' })}
                  renderInput={(params) => <TextField {...params} label="Product" />}
                />
              </Grid>
              <Grid item xs={8} sm={3}>
                <TextField
                  label="Qty"
                  type="number"
                  size="small"
                  fullWidth
                  inputProps={{ min: 1 }}
                  value={line.quantity}
                  onChange={(e) => updateLine(i, { quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                />
              </Grid>
              <Grid item xs={4} sm={2}>
                <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                  <Typography variant="body2" fontWeight={600} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {line.product ? formatCurrency(line.product.price * line.quantity) : '—'}
                  </Typography>
                  {lines.length > 1 && (
                    <IconButton size="small" color="error" onClick={() => setLines(lines.filter((_, j) => j !== i))}>
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            </Grid>
          ))}
          <Button size="small" startIcon={<Add />} onClick={() => setLines([...lines, { productId: '', product: null, quantity: 1 }])}>
            Add line
          </Button>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">{lines.filter((l) => l.product).length} product(s)</Typography>
            <Typography variant="h6" fontWeight={800}>{formatCurrency(cartTotal)}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateSale} disabled={!shopId || cartTotal <= 0}>
            Confirm Sale
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sale detail */}
      <Dialog open={!!detailSale} onClose={() => setDetailSale(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
          <Receipt color="primary" />
          Sale #{detailSale ? shortId(detailSale.id) : ''}
        </DialogTitle>
        <DialogContent dividers>
          {detailSale && (
            <>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Date</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(detailSale.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="caption" color="text.secondary">Shop</Typography>
                  <Typography variant="body2" fontWeight={600}>{detailSale.shop?.name || '—'}</Typography>
                </Box>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(detailSale.details || []).map((d: any) => (
                    <TableRow key={d.id}>
                      <TableCell>{d.product?.name || d.productId}</TableCell>
                      <TableCell align="right">{d.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(d.price)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {formatCurrency(d.price * d.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Typography variant="h6" fontWeight={800}>
                  Total: {formatCurrency(detailSale.totalAmount)}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailSale(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
