import { useState, useEffect } from 'react';
import {
    Box, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, IconButton, CircularProgress, Chip, Select, MenuItem, InputLabel, FormControl,
    Typography, Grid,
} from '@mui/material';
import { Delete, Add, AdminPanelSettings, Store, Category, BrandingWatermark, Straighten } from '@mui/icons-material';
import api from '../api';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
    return value === index ? <Box sx={{ py: 2 }}>{children}</Box> : null;
}

export default function AdminPage() {
    const [tab, setTab] = useState(0);

    return (
        <Box>
            <PageHeader
                title="Administration"
                subtitle="Users, locations, and product master data"
                breadcrumb="Admin"
            />
            <Paper sx={{ mb: 2, borderRadius: 3, overflow: 'hidden' }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
                    <Tab icon={<AdminPanelSettings />} iconPosition="start" label="Users & Roles" />
                    <Tab icon={<Store />} iconPosition="start" label="Shops & Branches" />
                    <Tab icon={<Category />} iconPosition="start" label="Categories" />
                    <Tab icon={<BrandingWatermark />} iconPosition="start" label="Brands" />
                    <Tab icon={<Straighten />} iconPosition="start" label="Units" />
                </Tabs>
            </Paper>
            <TabPanel value={tab} index={0}><UsersTab /></TabPanel>
            <TabPanel value={tab} index={1}><ShopsBranchesTab /></TabPanel>
            <TabPanel value={tab} index={2}><SimpleListTab endpoint="/foundation/categories" title="Category" hasDescription /></TabPanel>
            <TabPanel value={tab} index={3}><SimpleListTab endpoint="/foundation/brands" title="Brand" /></TabPanel>
            <TabPanel value={tab} index={4}><SimpleListTab endpoint="/foundation/units" title="Unit" /></TabPanel>
        </Box>
    );
}

function SimpleListTab({ endpoint, title, hasDescription = false }: { endpoint: string, title: string, hasDescription?: boolean }) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');

    const load = () => api.get(endpoint).then(r => { setData(r.data); setLoading(false); });
    useEffect(() => { load(); }, [endpoint]);

    const handleCreate = async () => {
        const payload: any = { name };
        if (hasDescription) payload.description = desc;
        await api.post(endpoint, payload);
        setOpen(false); setName(''); setDesc(''); load();
    };

    const handleDelete = async (id: string) => {
        if (confirm(`Delete this ${title}?`)) {
            await api.delete(`${endpoint}/${id}`);
            load();
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={6}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>
                Add {title}
            </Button>
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                {data.length === 0 ? (
                    <EmptyState
                        icon={<Category />}
                        title={`No ${title.toLowerCase()}s yet`}
                        description={`Create ${title.toLowerCase()}s to organize your product catalog.`}
                        action={{ label: `Add ${title}`, onClick: () => setOpen(true) }}
                    />
                ) : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                {hasDescription && <TableCell>Description</TableCell>}
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map(item => (
                                <TableRow key={item.id} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{item.name}</TableCell>
                                    {hasDescription && <TableCell>{item.description || '—'}</TableCell>}
                                    <TableCell align="right">
                                        <IconButton color="error" size="small" onClick={() => handleDelete(item.id)}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle fontWeight={700}>Add {title}</DialogTitle>
                <DialogContent>
                    <TextField label="Name" fullWidth sx={{ mt: 1, mb: 2 }} value={name} onChange={e => setName(e.target.value)} />
                    {hasDescription && (
                        <TextField label="Description" fullWidth value={desc} onChange={e => setDesc(e.target.value)} />
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate} disabled={!name.trim()}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

function UsersTab() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [role, setRole] = useState('');

    const load = () => api.get('/foundation/users').then(r => { setUsers(r.data); setLoading(false); });
    useEffect(() => { load(); }, []);

    const handleRoleChange = async () => {
        await api.patch(`/foundation/users/${selectedUser.id}/role`, { role });
        setOpen(false); load();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={6}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                {users.length === 0 ? (
                    <EmptyState icon={<AdminPanelSettings />} title="No users" description="Registered users will appear here." />
                ) : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Branch</TableCell>
                                <TableCell>Joined</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(u => (
                                <TableRow key={u.id} hover>
                                    <TableCell sx={{ fontWeight: 500 }}>{u.email}</TableCell>
                                    <TableCell>
                                        <Chip label={u.role.replace('_', ' ')} size="small" color="primary" variant="outlined" />
                                    </TableCell>
                                    <TableCell>{u.branch?.name || '—'}</TableCell>
                                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">
                                        <Button size="small" variant="outlined" onClick={() => { setSelectedUser(u); setRole(u.role); setOpen(true); }}>
                                            Edit Role
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle fontWeight={700}>Change Role</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {selectedUser?.email}
                    </Typography>
                    <FormControl fullWidth sx={{ minWidth: 200 }}>
                        <InputLabel>Role</InputLabel>
                        <Select value={role} label="Role" onChange={e => setRole(e.target.value)}>
                            <MenuItem value="OWNER">Owner</MenuItem>
                            <MenuItem value="MANAGER">Manager</MenuItem>
                            <MenuItem value="CASHIER">Cashier</MenuItem>
                            <MenuItem value="STORE_KEEPER">Store keeper</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleRoleChange}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

function ShopsBranchesTab() {
    const [shops, setShops] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [sOpen, setSOpen] = useState(false);
    const [sName, setSName] = useState('');
    const [bOpen, setBOpen] = useState(false);
    const [bName, setBName] = useState('');
    const [bShopId, setBShopId] = useState('');

    const load = async () => {
        const [s, b] = await Promise.all([api.get('/foundation/shops'), api.get('/foundation/branches')]);
        setShops(s.data);
        setBranches(b.data);
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    const handleCreateShop = async () => {
        let user: any = {};
        try {
            const stored = localStorage.getItem('user');
            if (stored && stored !== 'undefined') user = JSON.parse(stored);
        } catch { /* ignore */ }

        await api.post('/foundation/shops', { name: sName, ownerId: user.sub || user.id || '' });
        setSOpen(false);
        setSName('');
        load();
    };

    const handleCreateBranch = async () => {
        await api.post('/foundation/branches', { name: bName, shopId: bShopId });
        setBOpen(false);
        setBName('');
        setBShopId('');
        load();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={6}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Box display="flex" gap={1.5} mb={3} flexWrap="wrap">
                <Button variant="contained" startIcon={<Add />} onClick={() => setSOpen(true)}>Add Shop</Button>
                <Button variant="outlined" startIcon={<Add />} onClick={() => setBOpen(true)} disabled={shops.length === 0}>
                    Add Branch
                </Button>
            </Box>

            <Grid container spacing={2.5}>
                <Grid item xs={12} md={5}>
                    <Typography variant="subtitle1" fontWeight={700} mb={1.5}>Shops</Typography>
                    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                        {shops.length === 0 ? (
                            <EmptyState
                                icon={<Store />}
                                title="No shops yet"
                                description="Create a shop before recording sales."
                                action={{ label: 'Add Shop', onClick: () => setSOpen(true) }}
                            />
                        ) : (
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Shop Name</TableCell>
                                        <TableCell>Created</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {shops.map(s => (
                                        <TableRow key={s.id} hover>
                                            <TableCell sx={{ fontWeight: 600 }}>{s.name}</TableCell>
                                            <TableCell>{new Date(s.createdAt).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={7}>
                    <Typography variant="subtitle1" fontWeight={700} mb={1.5}>Branches</Typography>
                    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                        {branches.length === 0 ? (
                            <EmptyState
                                icon={<Store />}
                                title="No branches yet"
                                description="Branches hold inventory and receive goods."
                                action={shops.length > 0 ? { label: 'Add Branch', onClick: () => setBOpen(true) } : undefined}
                            />
                        ) : (
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Branch</TableCell>
                                        <TableCell>Parent Shop</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {branches.map(b => (
                                        <TableRow key={b.id} hover>
                                            <TableCell sx={{ fontWeight: 600 }}>{b.name}</TableCell>
                                            <TableCell>{b.shop?.name || '—'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                </Grid>
            </Grid>

            <Dialog open={sOpen} onClose={() => setSOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle fontWeight={700}>Create Shop</DialogTitle>
                <DialogContent>
                    <TextField label="Shop Name" fullWidth sx={{ mt: 1 }} value={sName} onChange={e => setSName(e.target.value)} />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setSOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateShop} disabled={!sName.trim()}>Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={bOpen} onClose={() => setBOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle fontWeight={700}>Create Branch</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth size="small" sx={{ mt: 1, mb: 2 }}>
                        <InputLabel>Parent Shop</InputLabel>
                        <Select value={bShopId} label="Parent Shop" onChange={e => setBShopId(e.target.value)}>
                            {shops.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField label="Branch Name" fullWidth size="small" value={bName} onChange={e => setBName(e.target.value)} />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setBOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateBranch} disabled={!bName.trim() || !bShopId}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
