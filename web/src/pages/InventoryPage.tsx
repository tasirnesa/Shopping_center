import { useState, useEffect } from 'react';
import {
    Box, Typography, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Chip, Alert,
    CircularProgress, Grid,
} from '@mui/material';
import { Add, SwapHoriz, TuneRounded, ReceiptLong, Inventory2 } from '@mui/icons-material';
import api from '../api';

// ─── Tab Panel ───
function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
    return value === index ? <Box sx={{ py: 2 }}>{children}</Box> : null;
}

// ─── Types ───
interface Product { id: string; name: string; barcode?: string; price: number; cost: number; category?: { name: string }; unit?: { name: string } }
interface Supplier { id: string; name: string; contact?: string; email?: string }
interface StockItem { id: string; quantity: number; product: Product; branch: { id: string; name: string } }
interface Transaction { id: string; type: string; quantity: number; reference?: string; createdAt: string; product: Product; branch: { name: string } }
interface Branch { id: string; name: string }

export default function InventoryPage() {
    const [tab, setTab] = useState(0);

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>Inventory Management</Typography>
            <Paper sx={{ mb: 2 }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
                    <Tab icon={<Inventory2 />} iconPosition="start" label="Stock Balance" />
                    <Tab icon={<ReceiptLong />} iconPosition="start" label="Goods Receipt" />
                    <Tab icon={<TuneRounded />} iconPosition="start" label="Adjustments" />
                    <Tab icon={<SwapHoriz />} iconPosition="start" label="Transfers" />
                    <Tab label="Movement Log" />
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

    useEffect(() => {
        api.get('/inventory/stock-balance').then(r => { setData(r.data); setLoading(false); });
    }, []);

    const filtered = data.filter(s =>
        s.product.name.toLowerCase().includes(search.toLowerCase()) ||
        s.branch.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <CircularProgress />;

    return (
        <>
            <TextField label="Search products or branches..." size="small" fullWidth sx={{ mb: 2 }}
                value={search} onChange={e => setSearch(e.target.value)} />
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                            <TableCell><b>Product</b></TableCell>
                            <TableCell><b>Category</b></TableCell>
                            <TableCell><b>Unit</b></TableCell>
                            <TableCell><b>Branch</b></TableCell>
                            <TableCell align="right"><b>Qty On Hand</b></TableCell>
                            <TableCell><b>Status</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.map(s => (
                            <TableRow key={s.id} hover>
                                <TableCell>{s.product.name}</TableCell>
                                <TableCell>{s.product.category?.name || '—'}</TableCell>
                                <TableCell>{s.product.unit?.name || '—'}</TableCell>
                                <TableCell>{s.branch.name}</TableCell>
                                <TableCell align="right"><b>{s.quantity}</b></TableCell>
                                <TableCell>
                                    {s.quantity <= 0 ? <Chip label="Out of Stock" color="error" size="small" /> :
                                        s.quantity < 10 ? <Chip label="Low Stock" color="warning" size="small" /> :
                                            <Chip label="In Stock" color="success" size="small" />}
                                </TableCell>
                            </TableRow>
                        ))}
                        {filtered.length === 0 && <TableRow><TableCell colSpan={6} align="center">No stock records found.</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
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

    // Form state
    const [supplierId, setSupplierId] = useState('');
    const [branchId, setBranchId] = useState('');
    const [lines, setLines] = useState([{ productId: '', quantity: 1, cost: 0 }]);

    // New supplier form
    const [newSupp, setNewSupp] = useState({ name: '', contact: '', email: '' });

    const load = async () => {
        const [p, s, pr, b] = await Promise.all([
            api.get('/inventory/purchases'),
            api.get('/suppliers'),
            api.get('/products'),
            api.get('/inventory/stock-balance'),
        ]);
        setPurchases(p.data);
        setSuppliers(s.data);
        setProducts(pr.data);
        // Extract unique branches from stock balance
        const uniqueBranches: Branch[] = [];
        const seen = new Set();
        b.data.forEach((sb: any) => {
            if (!seen.has(sb.branch.id)) { seen.add(sb.branch.id); uniqueBranches.push(sb.branch); }
        });
        setBranches(uniqueBranches);
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

    if (loading) return <CircularProgress />;

    return (
        <>
            <Box display="flex" gap={1} mb={2}>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>New Goods Receipt</Button>
                <Button variant="outlined" onClick={() => setSuppOpen(true)}>+ Supplier</Button>
            </Box>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
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
                                <TableCell>{p.supplier?.name}</TableCell>
                                <TableCell>{p.details?.length} item(s)</TableCell>
                                <TableCell align="right">${p.totalAmount.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* New Purchase Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Goods Receipt / Purchase Order</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Supplier</InputLabel>
                                <Select value={supplierId} label="Supplier" onChange={e => setSupplierId(e.target.value)}>
                                    {suppliers.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Receiving Branch</InputLabel>
                                <Select value={branchId} label="Receiving Branch" onChange={e => setBranchId(e.target.value)}>
                                    {branches.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Line Items</Typography>
                    {lines.map((line, i) => (
                        <Grid container spacing={1} key={i} sx={{ mb: 1 }}>
                            <Grid size={5}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Product</InputLabel>
                                    <Select value={line.productId} label="Product"
                                        onChange={e => { const n = [...lines]; n[i].productId = e.target.value; setLines(n); }}>
                                        {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={3}>
                                <TextField label="Qty" type="number" size="small" fullWidth value={line.quantity}
                                    onChange={e => { const n = [...lines]; n[i].quantity = +e.target.value; setLines(n); }} />
                            </Grid>
                            <Grid size={3}>
                                <TextField label="Unit Cost" type="number" size="small" fullWidth value={line.cost}
                                    onChange={e => { const n = [...lines]; n[i].cost = +e.target.value; setLines(n); }} />
                            </Grid>
                            <Grid size={1}>
                                {lines.length > 1 && <IconButton color="error" onClick={() => setLines(lines.filter((_, j) => j !== i))}>×</IconButton>}
                            </Grid>
                        </Grid>
                    ))}
                    <Button size="small" onClick={handleAddLine}>+ Add Line</Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>Receive Goods</Button>
                </DialogActions>
            </Dialog>

            {/* New Supplier Dialog */}
            <Dialog open={suppOpen} onClose={() => setSuppOpen(false)}>
                <DialogTitle>Add Supplier</DialogTitle>
                <DialogContent>
                    <TextField label="Name" fullWidth sx={{ mt: 1, mb: 1 }} value={newSupp.name} onChange={e => setNewSupp({ ...newSupp, name: e.target.value })} />
                    <TextField label="Contact" fullWidth sx={{ mb: 1 }} value={newSupp.contact} onChange={e => setNewSupp({ ...newSupp, contact: e.target.value })} />
                    <TextField label="Email" fullWidth value={newSupp.email} onChange={e => setNewSupp({ ...newSupp, email: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSuppOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateSupplier}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

// ═══════════════════════════════════════════════
// TAB 3: Stock Adjustments
// ═══════════════════════════════════════════════
function AdjustmentTab() {
    const [products, setProducts] = useState<Product[]>([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({ productId: '', branchId: '', quantityChange: 0, reason: '' });

    useEffect(() => { api.get('/products').then(r => setProducts(r.data)); }, []);

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
        <>
            <Button variant="contained" startIcon={<TuneRounded />} onClick={() => setOpen(true)}>New Stock Adjustment</Button>
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Stock Adjustment</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
                    <FormControl fullWidth size="small" sx={{ mt: 1, mb: 2 }}>
                        <InputLabel>Product</InputLabel>
                        <Select value={form.productId} label="Product"
                            onChange={e => setForm({ ...form, productId: e.target.value })}>
                            {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField label="Branch ID" fullWidth size="small" sx={{ mb: 2 }}
                        value={form.branchId} onChange={e => setForm({ ...form, branchId: e.target.value })} />
                    <TextField label="Quantity Change (+/-)" fullWidth size="small" type="number" sx={{ mb: 2 }}
                        value={form.quantityChange} onChange={e => setForm({ ...form, quantityChange: +e.target.value })}
                        helperText="Positive = add stock, Negative = remove stock" />
                    <TextField label="Reason" fullWidth size="small" multiline rows={2}
                        value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                        placeholder="e.g. Expired items, Physical count correction" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>Apply Adjustment</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

// ═══════════════════════════════════════════════
// TAB 4: Stock Transfers
// ═══════════════════════════════════════════════
function TransferTab() {
    const [products, setProducts] = useState<Product[]>([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({ fromBranchId: '', toBranchId: '', productId: '', quantity: 1 });

    useEffect(() => { api.get('/products').then(r => setProducts(r.data)); }, []);

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
        <>
            <Button variant="contained" startIcon={<SwapHoriz />} onClick={() => setOpen(true)}>New Stock Transfer</Button>
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Inter-Branch Stock Transfer</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
                    <TextField label="Source Branch ID" fullWidth size="small" sx={{ mt: 1, mb: 2 }}
                        value={form.fromBranchId} onChange={e => setForm({ ...form, fromBranchId: e.target.value })} />
                    <TextField label="Destination Branch ID" fullWidth size="small" sx={{ mb: 2 }}
                        value={form.toBranchId} onChange={e => setForm({ ...form, toBranchId: e.target.value })} />
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>Product</InputLabel>
                        <Select value={form.productId} label="Product"
                            onChange={e => setForm({ ...form, productId: e.target.value })}>
                            {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField label="Quantity" fullWidth size="small" type="number"
                        value={form.quantity} onChange={e => setForm({ ...form, quantity: +e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>Transfer Stock</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

// ═══════════════════════════════════════════════
// TAB 5: Movement Log (Audit Trail)
// ═══════════════════════════════════════════════
function MovementLogTab() {
    const [data, setData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/inventory/transactions').then(r => { setData(r.data); setLoading(false); });
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                        <TableCell><b>Date</b></TableCell>
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
                            <TableCell>{t.product.name}</TableCell>
                            <TableCell>{t.branch.name}</TableCell>
                            <TableCell>
                                <Chip label={t.type} color={t.type === 'IN' ? 'success' : 'error'} size="small" />
                            </TableCell>
                            <TableCell align="right">{t.quantity}</TableCell>
                            <TableCell>{t.reference || '—'}</TableCell>
                        </TableRow>
                    ))}
                    {data.length === 0 && <TableRow><TableCell colSpan={6} align="center">No transactions recorded yet.</TableCell></TableRow>}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
