import { useEffect, useState, useCallback } from "react";
import {
  Box, Button, Paper, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Chip, CircularProgress, Alert, Typography,
  InputAdornment, Tooltip, Stack,
} from "@mui/material";
import { Add, Edit, Delete, Search, Badge, Phone, Email, CreditCard } from "@mui/icons-material";
import api from "../api";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  tin: string | null;
  creditLimit: number;
  creditBalance: number;
  efdaLicensePath: string | null;
  efdaLicenseFileName: string | null;
  createdAt: string;
}

const EMPTY: Omit<Customer, "id" | "createdAt" | "creditBalance" | "efdaLicensePath" | "efdaLicenseFileName"> = {
  name: "", phone: "", email: "", tin: "", creditLimit: 0,
};

function getUser() {
  try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const user = getUser();
  const canManage = ["OWNER", "MANAGER", "INVOICE_MAKER"].includes(user?.role);
  const canDelete = ["OWNER", "MANAGER"].includes(user?.role);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setOpen(true);
  };

  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({ name: c.name, phone: c.phone || "", email: c.email || "", tin: c.tin || "", creditLimit: c.creditLimit });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
        tin: form.tin.trim() || undefined,
        creditLimit: Number(form.creditLimit) || 0,
      };
      if (editing) {
        await api.patch(`/customers/${editing.id}`, payload);
      } else {
        await api.post("/customers", payload);
      }
      setOpen(false);
      load();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to save customer");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/customers/${deleteId}`);
      setDeleteId(null);
      load();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to delete customer");
    }
  };

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.tin || "").toLowerCase().includes(q) ||
      (c.phone || "").includes(q) ||
      (c.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <Box>
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} customer${customers.length !== 1 ? "s" : ""} in your organization`}
        breadcrumb="Customers"
        action={
          canManage ? (
            <Button variant="contained" startIcon={<Add />} onClick={openAdd}>
              Add Customer
            </Button>
          ) : undefined
        }
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Search */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <TextField
          size="small"
          placeholder="Search by name, TIN, phone or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
          sx={{ width: 360 }}
        />
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Badge sx={{ fontSize: 56, color: "text.disabled" }} />}
          title="No customers found"
          description={search ? "Try a different search term." : "Add your first customer to get started."}
          action={canManage ? <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add Customer</Button> : undefined}
        />
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ "& th": { fontWeight: 700, bgcolor: "grey.50" } }}>
                <TableCell>Name</TableCell>
                <TableCell>TIN</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Credit</TableCell>
                <TableCell>EFDA</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>{c.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Since {new Date(c.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {c.tin ? (
                      <Chip label={c.tin} size="small" icon={<Badge />} variant="outlined" />
                    ) : (
                      <Typography variant="caption" color="text.disabled">—</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      {c.phone && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Phone sx={{ fontSize: 13, color: "text.secondary" }} />
                          <Typography variant="body2">{c.phone}</Typography>
                        </Box>
                      )}
                      {c.email && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Email sx={{ fontSize: 13, color: "text.secondary" }} />
                          <Typography variant="body2">{c.email}</Typography>
                        </Box>
                      )}
                      {!c.phone && !c.email && <Typography variant="caption" color="text.disabled">—</Typography>}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {c.creditLimit > 0 ? (
                      <Stack spacing={0.25}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <CreditCard sx={{ fontSize: 13, color: "primary.main" }} />
                          <Typography variant="body2" fontWeight={600}>
                            ETB {c.creditBalance.toFixed(0)} / {c.creditLimit.toFixed(0)}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">used / limit</Typography>
                      </Stack>
                    ) : (
                      <Typography variant="caption" color="text.disabled">No credit</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {c.efdaLicensePath ? (
                      <Chip label="On file" size="small" color="success" variant="outlined" />
                    ) : (
                      <Chip label="Missing" size="small" color="warning" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {canManage && (
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(c)}><Edit fontSize="small" /></IconButton>
                      </Tooltip>
                    )}
                    {canDelete && (
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => setDeleteId(c.id)}><Delete fontSize="small" /></IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add / Edit dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{editing ? "Edit Customer" : "Add Customer"}</DialogTitle>
        <DialogContent sx={{ pt: "12px !important" }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
            <TextField label="TIN (Tax ID)" value={form.tin} onChange={(e) => setForm({ ...form, tin: e.target.value })} fullWidth
              inputProps={{ style: { textTransform: "uppercase" } }} />
            <TextField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} fullWidth />
            <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth type="email" />
            <TextField label="Credit Limit (ETB)" value={form.creditLimit} onChange={(e) => setForm({ ...form, creditLimit: Number(e.target.value) || 0 })}
              fullWidth type="number" InputProps={{ startAdornment: <InputAdornment position="start">ETB</InputAdornment> }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || !form.name.trim()}>
            {saving ? <CircularProgress size={18} /> : editing ? "Save" : "Add Customer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs">
        <DialogTitle fontWeight={700}>Delete Customer?</DialogTitle>
        <DialogContent>
          <Typography>This will permanently remove the customer record. This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
