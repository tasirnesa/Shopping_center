import { useState, useEffect } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, CircularProgress, Chip, Select, MenuItem, InputLabel,
  FormControl, Typography, IconButton,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import api from "../api";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

const ALL_ROLES = [
  "OWNER", "MANAGER", "CASHIER", "STORE_KEEPER",
  "SALES_REP", "INVOICE_MAKER", "STORE_MAN", "DRIVER",
];

const statusColor = (s: string) =>
  s === "ACTIVE" ? "success" : s === "INACTIVE" ? "error" : "default";

function AddUserDialog({ open, onClose, onSaved, organizations }: {
  open: boolean; onClose: () => void; onSaved: () => void; organizations: any[];
}) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "OWNER", organizationId: "" });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.email || !form.password || !form.role) return;
    setSaving(true);
    try {
      await api.post("/foundation/users", {
        ...form,
        organizationId: form.organizationId || undefined,
      });
      onSaved();
      onClose();
      setForm({ name: "", email: "", password: "", role: "OWNER", organizationId: "" });
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to create user");
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Platform User</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
        <TextField label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
        <TextField label="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth type="email" required />
        <TextField label="Password *" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} fullWidth type="password" required />
        <FormControl fullWidth required>
          <InputLabel>Role</InputLabel>
          <Select value={form.role} label="Role" onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {ALL_ROLES.map((r) => <MenuItem key={r} value={r}>{r.replace(/_/g, " ")}</MenuItem>)}
          </Select>
        </FormControl>
        {organizations.length > 0 && (
          <FormControl fullWidth>
            <InputLabel>Organization (optional)</InputLabel>
            <Select value={form.organizationId} label="Organization (optional)" onChange={(e) => setForm({ ...form, organizationId: e.target.value })}>
              <MenuItem value="">— None —</MenuItem>
              {organizations.map((o: any) => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>)}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={save} disabled={saving || !form.email || !form.password}>
          {saving ? <CircularProgress size={20} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function EditUserDialog({ user, onClose, onSaved }: { user: any; onClose: () => void; onSaved: () => void }) {
  const [role, setRole] = useState(user?.role ?? "");
  const [status, setStatus] = useState(user?.status ?? "ACTIVE");
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (user) { setRole(user.role); setStatus(user.status); } }, [user]);

  const save = async () => {
    setSaving(true);
    try {
      const ops: Promise<any>[] = [];
      if (role !== user.role) ops.push(api.patch(`/foundation/users/${user.id}/role`, { role }));
      if (status !== user.status) ops.push(api.patch(`/foundation/users/${user.id}/status`, { status }));
      await Promise.all(ops);
      onSaved();
      onClose();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to update user");
    } finally { setSaving(false); }
  };

  if (!user) return null;
  return (
    <Dialog open={!!user} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit User — {user.name || user.email}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select value={role} label="Role" onChange={(e) => setRole(e.target.value)}>
            {ALL_ROLES.map((r) => <MenuItem key={r} value={r}>{r.replace(/_/g, " ")}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={save} disabled={saving}>
          {saving ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function SystemUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [uRes, oRes] = await Promise.all([
        api.get("/foundation/users"),
        api.get("/organizations").catch(() => ({ data: [] })),
      ]);
      setUsers(uRes.data);
      setOrgs(oRes.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <Box>
      <PageHeader title="Platform Users" subtitle="Manage cross-organization platform users" breadcrumb="Users" />

      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>Add User</Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>
      ) : users.length === 0 ? (
        <EmptyState icon="people" title="No users" description="No users found in the system." />
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name / Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Organization</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>
                    <Typography fontWeight={700}>{u.name || "—"}</Typography>
                    <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                  </TableCell>
                  <TableCell><Chip label={u.role.replace(/_/g, " ")} size="small" /></TableCell>
                  <TableCell>{u.organization?.name ?? "—"}</TableCell>
                  <TableCell><Chip label={u.status || "ACTIVE"} color={statusColor(u.status)} size="small" /></TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => setEditUser(u)}><Edit fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <AddUserDialog open={addOpen} onClose={() => setAddOpen(false)} onSaved={load} organizations={orgs} />
      <EditUserDialog user={editUser} onClose={() => setEditUser(null)} onSaved={load} />
    </Box>
  );
}
