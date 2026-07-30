import { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Grid,
} from "@mui/material";
import {
  Delete,
  Add,
  AdminPanelSettings,
  Store,
  Category,
  Business,
  BrandingWatermark,
  Straighten,
} from "@mui/icons-material";
import api from "../api";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

function TabPanel({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  return value === index ? <Box sx={{ py: 2 }}>{children}</Box> : null;
}

export default function AdminPage() {
  const [tab, setTab] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch { }
  }, []);

  const isSysAdmin = user?.role === "SYSTEM_ADMIN";

  return (
    <Box>
      <PageHeader
        title="Administration"
        subtitle="Users, locations, and product master data"
        breadcrumb="Admin"
      />
      <Paper sx={{ mb: 2, borderRadius: 3, overflow: "hidden" }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {isSysAdmin && (
            <Tab icon={<Business />} iconPosition="start" label="Organizations" />
          )}
          <Tab icon={<AdminPanelSettings />} iconPosition="start" label="Users & Roles" />
          <Tab icon={<Store />} iconPosition="start" label="Branches" />
          <Tab icon={<Category />} iconPosition="start" label="Categories" />
          <Tab
            icon={<BrandingWatermark />}
            iconPosition="start"
            label="Brands"
          />
          <Tab icon={<Straighten />} iconPosition="start" label="Units" />
        </Tabs>
      </Paper>

      {/* Since tabs are dynamic, we calculate indices based on isSysAdmin */}
      {isSysAdmin && (
        <TabPanel value={tab} index={0}>
          <OrganizationsTab />
        </TabPanel>
      )}

      <TabPanel value={tab} index={isSysAdmin ? 1 : 0}>
        <UsersTab isSysAdmin={isSysAdmin} />
      </TabPanel>
      <TabPanel value={tab} index={isSysAdmin ? 2 : 1}>
        <BranchesTab />
      </TabPanel>
      <TabPanel value={tab} index={isSysAdmin ? 3 : 2}>
        <SimpleListTab
          endpoint="/foundation/categories"
          title="Category"
          hasDescription
        />
      </TabPanel>
      <TabPanel value={tab} index={isSysAdmin ? 4 : 3}>
        <SimpleListTab endpoint="/foundation/brands" title="Brand" />
      </TabPanel>
      <TabPanel value={tab} index={isSysAdmin ? 5 : 4}>
        <SimpleListTab endpoint="/foundation/units" title="Unit" />
      </TabPanel>
    </Box>
  );
}

function SimpleListTab({
  endpoint,
  title,
  hasDescription = false,
}: {
  endpoint: string;
  title: string;
  hasDescription?: boolean;
}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const load = () =>
    api.get(endpoint).then((r) => {
      setData(r.data);
      setLoading(false);
    });
  useEffect(() => {
    load();
  }, [endpoint]);

  const handleCreate = async () => {
    const payload: any = { name };
    if (hasDescription) payload.description = desc;
    await api.post(endpoint, payload);
    setOpen(false);
    setName("");
    setDesc("");
    load();
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
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
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
              {data.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{item.name}</TableCell>
                  {hasDescription && (
                    <TableCell>{item.description || "—"}</TableCell>
                  )}
                  <TableCell align="right">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add {title}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            sx={{ mt: 1, mb: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {hasDescription && (
            <TextField
              label="Description"
              fullWidth
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function UsersTab({ isSysAdmin }: { isSysAdmin: boolean }) {
  const [users, setUsers] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // States for adding user
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [branchId, setBranchId] = useState("");
  const [orgId, setOrgId] = useState("");

  const load = async () => {
    try {
      const [u, b] = await Promise.all([
        api.get("/foundation/users"),
        api.get("/foundation/branches").catch(() => ({ data: [] }))
      ]);
      setUsers(u.data);
      setBranches(b.data);

      if (isSysAdmin) {
        const o = await api.get("/organizations");
        setOrgs(o.data);
      }
    } catch { }
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const handleRoleChange = async () => {
    await api.patch(`/foundation/users/${selectedUser.id}/role`, { role });
    setOpen(false);
    load();
  };

  const handleAddUser = async () => {
    try {
      await api.post("/auth/register", {
        email,
        password,
        name,
        role,
        branchId: branchId || undefined,
        organizationId: orgId || undefined,
      });
      setAddOpen(false);
      setEmail("");
      setPassword("");
      setName("");
      setRole("");
      setBranchId("");
      setOrgId("");
      load();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to create user");
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
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setAddOpen(true)}
        sx={{ mb: 2 }}
      >
        Add User
      </Button>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        {users.length === 0 ? (
          <EmptyState
            icon={<AdminPanelSettings />}
            title="No users"
            description="Registered users will appear here."
            action={{ label: "Add User", onClick: () => setAddOpen(true) }}
          />
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
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{u.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.role.replace("_", " ")}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{u.branch?.name || "—"}</TableCell>
                  <TableCell>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedUser(u);
                        setRole(u.role);
                        setOpen(true);
                      }}
                    >
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
        <DialogTitle sx={{ fontWeight: 700 }}>Change Role</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedUser?.email}
          </Typography>
          <FormControl fullWidth sx={{ minWidth: 200 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              {isSysAdmin && <MenuItem value="SYSTEM_ADMIN">System Admin</MenuItem>}
              <MenuItem value="OWNER">Owner</MenuItem>
              <MenuItem value="MANAGER">Manager</MenuItem>
              <MenuItem value="CASHIER">Cashier</MenuItem>
              <MenuItem value="STORE_KEEPER">Store keeper</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRoleChange}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            size="small"
            sx={{ mt: 1, mb: 1.5 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            size="small"
            sx={{ mb: 1.5 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            size="small"
            sx={{ mb: 1.5 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              {isSysAdmin && <MenuItem value="SYSTEM_ADMIN">System Admin</MenuItem>}
              <MenuItem value="OWNER">Owner</MenuItem>
              <MenuItem value="MANAGER">Manager</MenuItem>
              <MenuItem value="CASHIER">Cashier</MenuItem>
              <MenuItem value="STORE_KEEPER">Store keeper</MenuItem>
            </Select>
          </FormControl>

          {isSysAdmin && role === "OWNER" && (
            <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
              <InputLabel>Organization</InputLabel>
              <Select
                value={orgId}
                label="Organization"
                onChange={(e) => setOrgId(e.target.value)}
              >
                {orgs.map((o) => (
                  <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {!isSysAdmin && (role === "MANAGER" || role === "CASHIER" || role === "STORE_KEEPER") && (
            <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
              <InputLabel>Assign to Branch</InputLabel>
              <Select
                value={branchId}
                label="Assign to Branch"
                onChange={(e) => setBranchId(e.target.value)}
              >
                {branches.map((b) => (
                  <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddUser} disabled={!email || !password || !role}>
            Create User
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function OrganizationsTab() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/organizations");
      setOrgs(res.data);
    } catch { }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    await api.post("/organizations", { name, businessType, email, phone });
    setOpen(false);
    setName("");
    setBusinessType("");
    setEmail("");
    setPhone("");
    load();
  };

  if (loading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;

  return (
    <>
      <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Organization
      </Button>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        {orgs.length === 0 ? (
          <EmptyState icon={<Business />} title="No organizations yet" description="Create businesses that will use this platform." />
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orgs.map((o) => (
                <TableRow key={o.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{o.name}</TableCell>
                  <TableCell>{o.businessType || "—"}</TableCell>
                  <TableCell>{o.email || "—"}</TableCell>
                  <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Register Organization</DialogTitle>
        <DialogContent>
          <TextField label="Business Name" fullWidth sx={{ mt: 1, mb: 2 }} value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Business Type (e.g. Retail)" fullWidth sx={{ mb: 2 }} value={businessType} onChange={(e) => setBusinessType(e.target.value)} />
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField label="Email" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} /></Grid>
            <Grid item xs={6}><TextField label="Phone" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!name.trim()}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function BranchesTab() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const load = async () => {
    const res = await api.get("/foundation/branches");
    setBranches(res.data);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    await api.post("/foundation/branches", { name });
    setOpen(false);
    setName("");
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
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Add Branch
      </Button>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        {branches.length === 0 ? (
          <EmptyState
            icon={<Store />}
            title="No branches yet"
            description="Create branches to manage inventory by location."
            action={{ label: "Add Branch", onClick: () => setOpen(true) }}
          />
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Branch Name</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {branches.map((b) => (
                <TableRow key={b.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{b.name}</TableCell>
                  <TableCell>
                    {new Date(b.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create Branch</DialogTitle>
        <DialogContent>
          <TextField
            label="Branch Name"
            fullWidth
            sx={{ mt: 1 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
