import { useState, useEffect } from 'react';
import {
    Box, Typography, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Chip, Alert,
    CircularProgress, Grid, useTheme, useMediaQuery, Fade, Stack, Card, CardContent, alpha
} from '@mui/material';
import { Add, SwapHoriz, TuneRounded, ReceiptLong, Inventory2, Storefront, CategoryOutlined } from '@mui/icons-material';
import api from '../api';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';

// ─── Tab Panel ───
function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
    return (
        <Fade in={value === index} mountOnEnter unmountOnExit timeout={400}>
            <Box sx={{ py: { xs: 1, md: 2 } }}>{children}</Box>
        </Fade>
    );
}

// ─── Types ───
interface Product { id: string; name: string; barcode?: string; price: number; cost: number; category?: { name: string }; unit?: { name: string } }
interface Supplier { id: string; name: string; contact?: string; email?: string }
interface StockItem { id: string; quantity: number; product: Product; branch: { id: string; name: string } }
interface Transaction { id: string; type: string; quantity: number; reference?: string; createdAt: string; product: Product; branch: { name: string } }
interface Branch { id: string; name: string }

export default function InventoryPage() {
    const [tab, setTab] = useState(0);
    const theme = useTheme();

    return (
        <Box sx={{ pb: { xs: 8, md: 2 } }}>
            <PageHeader
                title="Inventory"
                subtitle="Stock levels, receipts, adjustments, and movement history"
                breadcrumb="Inventory"
            />
            <Paper sx={{
                mb: 2,
                borderRadius: 4,
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.7)})`,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
            }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto"
                    sx={{
                        '& .MuiTab-root': { py: 2, textTransform: 'none', fontWeight: 600 },
                        '& .Mui-selected': { color: theme.palette.primary.main }
                    }}>
                    <Tab icon={<Inventory2 sx={{ mb: '0 !important', mr: 1 }} />} iconPosition="start" label="Stock" />
                    <Tab icon={<ReceiptLong sx={{ mb: '0 !important', mr: 1 }} />} iconPosition="start" label="Receipt" />
                    <Tab icon={<TuneRounded sx={{ mb: '0 !important', mr: 1 }} />} iconPosition="start" label="Adjust" />
                    <Tab icon={<SwapHoriz sx={{ mb: '0 !important', mr: 1 }} />} iconPosition="start" label="Transfer" />
                    <Tab label="History" />
                </Tabs>
            </Paper>
            <TabPanel value={tab} index={0}><StockBalanceTab /></TabPanel>
            <TabPanel value={tab} index={1}><GoodsReceiptTab /></TabPanel>
            <TabPanel value={tab} index={2}><AdjustmentTab /></TabPanel>
            <TabPanel value={tab} index={3}><TransferTab /></TabPanel>
            <TabPanel value={tab} index={4}><MovementLogTab /></TabPanel>
        </Box>
    );
}

// ═══════════════════════════════════════════════
// TAB 1: Stock Balance
// ═══════════════════════════════════════════════
function StockBalanceTab() {
    const [data, setData] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        api.get('/inventory/stock-balance').then(r => { setData(r.data); setLoading(false); });
    }, []);

    const filtered = data.filter(s =>
        s.product.name.toLowerCase().includes(search.toLowerCase()) ||
        s.branch.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
        );
    }

    return (
        <Box>
            <Paper sx={{ p: 2, mb: 3, borderRadius: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    placeholder="Search products or branches…"
                    size="small"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
            </Paper>

            {filtered.length === 0 ? (
                <EmptyState
                    icon={<Inventory2 />}
                    title={search ? 'No matching stock records' : 'No stock on hand yet'}
                    description={search ? 'Try another search term.' : 'Receive goods or adjust stock to see balances here.'}
                />
            ) : isMobile ? (
                // Mobile Card View
                <Stack spacing={2}>
                    {filtered.map((s, idx) => (
                        <Fade in={true} style={{ transitionDelay: `${idx * 50}ms` }} key={s.id}>
                            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative', overflow: 'visible' }}>
                                <CardContent sx={{ p: '16px !important' }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                                        <Typography variant="subtitle1" fontWeight={700} sx={{ pr: 2 }}>{s.product.name}</Typography>
                                        <Box textAlign="right">
                                            <Typography variant="h5" color="primary" fontWeight={800}>{s.quantity}</Typography>
                                            <Typography variant="caption" color="text.secondary">{s.product.unit?.name || 'units'}</Typography>
                                        </Box>
                                    </Box>
                                    <Stack direction="row" spacing={1} mb={2}>
                                        <Chip icon={<Storefront fontSize="small" />} label={s.branch.name} size="small" variant="outlined" sx={{ borderRadius: 2 }} />
                                        <Chip icon={<CategoryOutlined fontSize="small" />} label={s.product.category?.name || 'Uncategorized'} size="small" variant="outlined" sx={{ borderRadius: 2 }} />
                                    </Stack>
                                    <Box>
                                        {s.quantity <= 0 ? <Chip label="Out of Stock" color="error" size="small" sx={{ fontWeight: 'bold' }} /> :
                                            s.quantity < 10 ? <Chip label="Low Stock" color="warning" size="small" sx={{ fontWeight: 'bold' }} /> :
                                                <Chip label="In Stock" color="success" size="small" sx={{ fontWeight: 'bold' }} />}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Fade>
                    ))}
                </Stack>
            ) : (
                // Desktop Table View
                <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Unit</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Branch</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Qty On Hand</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map((s) => (
                                <TableRow key={s.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                    <TableCell sx={{ fontWeight: 600 }}>{s.product.name}</TableCell>
                                    <TableCell>{s.product.category?.name || '—'}</TableCell>
                                    <TableCell>{s.product.unit?.name || '—'}</TableCell>
                                    <TableCell>{s.branch.name}</TableCell>
                                    <TableCell align="right"><Typography fontWeight={700} color="primary">{s.quantity}</Typography></TableCell>
                                    <TableCell>
                                        {s.quantity <= 0 ? <Chip label="Out of Stock" color="error" size="small" /> :
                                            s.quantity < 10 ? <Chip label="Low Stock" color="warning" size="small" /> :
                                                <Chip label="In Stock" color="success" size="small" />}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

// ═══════════════════════════════════════════════
// TAB 2: Goods Receipt (Create Purchase)
// ═══════════════════════════════════════════════
function GoodsReceiptTab() {
    const [purchases, setPurchases] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [open, setOpen] = useState(false);
    const [suppOpen, setSuppOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Form state
    const [supplierId, setSupplierId] = useState('');
    const [branchId, setBranchId] = useState('');
    const [lines, setLines] = useState([{ productId: '', quantity: 1, cost: 0 }]);

    // New supplier form
    const [newSupp, setNewSupp] = useState({ name: '', contact: '', email: '' });

    const load = async () => {
        const [p, s, pr, br] = await Promise.all([
            api.get('/inventory/purchases'),
            api.get('/suppliers'),
            api.get('/products'),
            api.get('/foundation/branches'),
        ]);
        setPurchases(p.data);
        setSuppliers(s.data);
        setProducts(pr.data);
        setBranches(br.data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleAddLine = () => setLines([...lines, { productId: '', quantity: 1, cost: 0 }]);

    const handleSubmit = async () => {
        setError('');
        try {
            await api.post('/inventory/purchases', { supplierId, branchId, details: lines });
            setOpen(false);
            setSupplierId(''); setBranchId(''); setLines([{ productId: '', quantity: 1, cost: 0 }]);
            load();
        } catch (e: any) { setError(e.response?.data?.message || 'Failed to create purchase'); }
    };

    const handleCreateSupplier = async () => {
        await api.post('/suppliers', newSupp);
        setNewSupp({ name: '', contact: '', email: '' });
        setSuppOpen(false);
        load();
    };

    if (loading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;

    return (
        <Box>
            <Paper sx={{ p: 2, mb: 3, borderRadius: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" sx={{ borderRadius: 3, px: 3, py: 1 }} startIcon={<Add />} onClick={() => setOpen(true)}>New Receipt</Button>
                <Button variant="outlined" sx={{ borderRadius: 3, px: 3, py: 1 }} onClick={() => setSuppOpen(true)}>+ Supplier</Button>
            </Paper>

            {isMobile ? (
                // Mobile Card View
                <Stack spacing={2}>
                    {purchases.map((p: any, idx) => (
                        <Fade in={true} style={{ transitionDelay: `${idx * 50}ms` }} key={p.id}>
                            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <CardContent sx={{ p: '16px !important' }}>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="subtitle2" color="text.secondary">{new Date(p.createdAt).toLocaleDateString()}</Typography>
                                        <Typography variant="subtitle1" fontWeight={800} color="primary">${p.totalAmount.toFixed(2)}</Typography>
                                    </Box>
                                    <Typography variant="h6" fontWeight={700} mb={1}>{p.supplier?.name}</Typography>
                                    <Chip label={`${p.details?.length} item(s)`} size="small" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 'bold' }} />
                                </CardContent>
                            </Card>
                        </Fade>
                    ))}
                </Stack>
            ) : (
                // Desktop Table View
                <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                <TableCell><b>Date</b></TableCell>
                                <TableCell><b>Supplier</b></TableCell>
                                <TableCell><b>Items</b></TableCell>
                                <TableCell align="right"><b>Total Amount</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {purchases.map((p: any) => (
                                <TableRow key={p.id} hover>
                                    <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell fontWeight={600}>{p.supplier?.name}</TableCell>
                                    <TableCell>
                                        <Chip label={`${p.details?.length} item(s)`} size="small" />
                                    </TableCell>
                                    <TableCell align="right"><Typography fontWeight={700} color="primary">${p.totalAmount.toFixed(2)}</Typography></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* New Purchase Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Goods Receipt</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid xs={12} sm={6} item>
                            <FormControl fullWidth size="small">
                                <InputLabel>Supplier</InputLabel>
                                <Select value={supplierId} label="Supplier" onChange={e => setSupplierId(e.target.value)} sx={{ borderRadius: 2 }}>
                                    {suppliers.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} item>
                            <FormControl fullWidth size="small">
                                <InputLabel>Receiving Branch</InputLabel>
                                <Select value={branchId} label="Receiving Branch" onChange={e => setBranchId(e.target.value)} sx={{ borderRadius: 2 }}>
                                    {branches.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 3, mb: 2 }}>Line Items</Typography>
                    {lines.map((line, i) => (
                        <Grid container spacing={2} key={i} sx={{ mb: 2 }} alignItems="center">
                            <Grid xs={12} sm={5} item>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Product</InputLabel>
                                    <Select value={line.productId} label="Product" sx={{ borderRadius: 2 }}
                                        onChange={e => { const n = [...lines]; n[i].productId = e.target.value; setLines(n); }}>
                                        {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={5} sm={3} item>
                                <TextField label="Qty" type="number" size="small" fullWidth value={line.quantity} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    onChange={e => { const n = [...lines]; n[i].quantity = +e.target.value; setLines(n); }} />
                            </Grid>
                            <Grid xs={5} sm={3} item>
                                <TextField label="Unit Cost" type="number" size="small" fullWidth value={line.cost} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    onChange={e => { const n = [...lines]; n[i].cost = +e.target.value; setLines(n); }} />
                            </Grid>
                            <Grid xs={2} sm={1} item textAlign="center">
                                {lines.length > 1 && <IconButton color="error" size="small" onClick={() => setLines(lines.filter((_, j) => j !== i))}>×</IconButton>}
                            </Grid>
                        </Grid>
                    ))}
                    <Button size="small" onClick={handleAddLine} sx={{ borderRadius: 2, fontWeight: 700 }} variant="outlined">+ Add Line Item</Button>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpen(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit} sx={{ borderRadius: 2, px: 4 }}>Receive</Button>
                </DialogActions>
            </Dialog>

            {/* New Supplier Dialog */}
            <Dialog open={suppOpen} onClose={() => setSuppOpen(false)} PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Add Supplier</DialogTitle>
                <DialogContent>
                    <TextField label="Name" fullWidth sx={{ mt: 1, mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} value={newSupp.name} onChange={e => setNewSupp({ ...newSupp, name: e.target.value })} />
                    <TextField label="Contact" fullWidth sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} value={newSupp.contact} onChange={e => setNewSupp({ ...newSupp, contact: e.target.value })} />
                    <TextField label="Email" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} value={newSupp.email} onChange={e => setNewSupp({ ...newSupp, email: e.target.value })} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setSuppOpen(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateSupplier} sx={{ borderRadius: 2, px: 4 }}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

// ═══════════════════════════════════════════════
// TAB 3: Stock Adjustments
// ═══════════════════════════════════════════════
function AdjustmentTab() {
    const [products, setProducts] = useState<Product[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({ productId: '', branchId: '', quantityChange: 0, reason: '' });
    const theme = useTheme();

    useEffect(() => {
        Promise.all([api.get('/products'), api.get('/foundation/branches')]).then(([p, b]) => {
            setProducts(p.data);
            setBranches(b.data);
        });
    }, []);

    const handleSubmit = async () => {
        setError(''); setSuccess('');
        try {
            await api.post('/inventory/adjustments', form);
            setSuccess('Stock adjusted successfully!');
            setForm({ productId: '', branchId: '', quantityChange: 0, reason: '' });
            setOpen(false);
        } catch (e: any) { setError(e.response?.data?.message || 'Adjustment failed'); }
    };

    return (
        <Box>
            <Paper sx={{ p: 2, mb: 3, borderRadius: 4, display: 'flex', gap: 2 }}>
                <Button variant="contained" size="large" sx={{ borderRadius: 3, px: 3, py: 1 }} startIcon={<TuneRounded />} onClick={() => setOpen(true)}>New Stock Adjustment</Button>
            </Paper>

            {success && (
                <Fade in={true}>
                    <Alert severity="success" sx={{ mb: 2, borderRadius: 3, bgcolor: alpha(theme.palette.success.main, 0.1) }}>{success}</Alert>
                </Fade>
            )}

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Stock Adjustment</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
                    <FormControl fullWidth size="small" sx={{ mt: 1, mb: 2 }}>
                        <InputLabel>Product</InputLabel>
                        <Select value={form.productId} label="Product" sx={{ borderRadius: 2 }}
                            onChange={e => setForm({ ...form, productId: e.target.value })}>
                            {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>Branch</InputLabel>
                        <Select value={form.branchId} label="Branch" sx={{ borderRadius: 2 }}
                            onChange={e => setForm({ ...form, branchId: e.target.value })}>
                            {branches.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField label="Quantity Change" fullWidth size="small" type="number" sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        value={form.quantityChange} onChange={e => setForm({ ...form, quantityChange: +e.target.value })}
                        helperText="Use positive for adding stock, negative for removing." />
                    <TextField label="Reason" fullWidth size="small" multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                        placeholder="e.g. Expired items, Physical count correction" />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpen(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit} sx={{ borderRadius: 2, px: 4 }}>Apply</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

// ═══════════════════════════════════════════════
// TAB 4: Stock Transfers
// ═══════════════════════════════════════════════
function TransferTab() {
    const [products, setProducts] = useState<Product[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({ fromBranchId: '', toBranchId: '', productId: '', quantity: 1 });
    const theme = useTheme();

    useEffect(() => {
        Promise.all([api.get('/products'), api.get('/foundation/branches')]).then(([p, b]) => {
            setProducts(p.data);
            setBranches(b.data);
        });
    }, []);

    const handleSubmit = async () => {
        setError(''); setSuccess('');
        try {
            await api.post('/inventory/transfers', form);
            setSuccess('Stock transferred successfully!');
            setForm({ fromBranchId: '', toBranchId: '', productId: '', quantity: 1 });
            setOpen(false);
        } catch (e: any) { setError(e.response?.data?.message || 'Transfer failed'); }
    };

    return (
        <Box>
            <Paper sx={{ p: 2, mb: 3, borderRadius: 4, display: 'flex', gap: 2 }}>
                <Button variant="contained" size="large" sx={{ borderRadius: 3, px: 3, py: 1 }} startIcon={<SwapHoriz />} onClick={() => setOpen(true)}>New Inter-Branch Transfer</Button>
            </Paper>
            {success && (
                <Fade in={true}>
                    <Alert severity="success" sx={{ mt: 2, borderRadius: 3 }}>{success}</Alert>
                </Fade>
            )}

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Transfer Stock</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
                    <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Source Branch</InputLabel>
                                <Select value={form.fromBranchId} label="Source Branch" sx={{ borderRadius: 2 }}
                                    onChange={e => setForm({ ...form, fromBranchId: e.target.value })}>
                                    {branches.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Destination Branch</InputLabel>
                                <Select value={form.toBranchId} label="Destination Branch" sx={{ borderRadius: 2 }}
                                    onChange={e => setForm({ ...form, toBranchId: e.target.value })}>
                                    {branches.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>Product</InputLabel>
                        <Select value={form.productId} label="Product" sx={{ borderRadius: 2 }}
                            onChange={e => setForm({ ...form, productId: e.target.value })}>
                            {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField label="Quantity" fullWidth size="small" type="number" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        value={form.quantity} onChange={e => setForm({ ...form, quantity: +e.target.value })} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpen(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit} sx={{ borderRadius: 2, px: 4 }}>Transfer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

// ═══════════════════════════════════════════════
// TAB 5: Movement Log (Audit Trail)
// ═══════════════════════════════════════════════
function MovementLogTab() {
    const [data, setData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        api.get('/inventory/transactions').then(r => { setData(r.data); setLoading(false); });
    }, []);

    if (loading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;

    return (
        <Box>
            {isMobile ? (
                // Mobile Card View
                <Stack spacing={2}>
                    {data.map((t, idx) => (
                        <Fade in={true} style={{ transitionDelay: `${idx * 30}ms` }} key={t.id}>
                            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <CardContent sx={{ p: '16px !important' }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="body2" color="text.secondary">{new Date(t.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</Typography>
                                        <Chip label={t.type} color={t.type === 'IN' ? 'success' : t.type === 'OUT' ? 'error' : 'default'} size="small" sx={{ fontWeight: 'bold' }} />
                                    </Box>
                                    <Typography variant="h6" fontWeight={700}>{t.product.name}</Typography>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-end" mt={1}>
                                        <Typography variant="body2" color="text.secondary">Branch: {t.branch.name}</Typography>
                                        <Typography variant="h6" fontWeight={800} color={t.type === 'IN' ? 'success.main' : 'error.main'}>
                                            {t.type === 'IN' ? '+' : '-'}{t.quantity}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Fade>
                    ))}
                    {data.length === 0 && (
                        <Typography p={4} textAlign="center" color="text.secondary">No transactions recorded yet.</Typography>
                    )}
                </Stack>
            ) : (
                // Desktop Table View
                <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                <TableCell><b>Date & Time</b></TableCell>
                                <TableCell><b>Product</b></TableCell>
                                <TableCell><b>Branch</b></TableCell>
                                <TableCell><b>Type</b></TableCell>
                                <TableCell align="right"><b>Qty</b></TableCell>
                                <TableCell><b>Reference</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map(t => (
                                <TableRow key={t.id} hover>
                                    <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
                                    <TableCell fontWeight={600}>{t.product.name}</TableCell>
                                    <TableCell>{t.branch.name}</TableCell>
                                    <TableCell>
                                        <Chip label={t.type} color={t.type === 'IN' ? 'success' : t.type === 'OUT' ? 'error' : 'default'} size="small" sx={{ fontWeight: 'bold' }} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography fontWeight={700} color={t.type === 'IN' ? 'success.main' : 'error.main'}>
                                            {t.type === 'IN' ? '+' : '-'}{t.quantity}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>{t.reference || '—'}</TableCell>
                                </TableRow>
                            ))}
                            {data.length === 0 && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}>No transactions recorded yet.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
