import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box, Button, Paper, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Chip, CircularProgress, Alert, Typography,
  Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem,
  InputAdornment, Stack, Tooltip,
} from "@mui/material";
import { Add, Delete, Receipt, TrendingUp, CalendarToday } from "@mui/icons-material";
import api from "../api";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

interface Branch { id: string; name: string }
interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  branch: Branch;
  createdAt: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ description: "", amount: "", branchId: "", date: new Date().toISOString().split("T")[0] });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterBranch, setFilterBranch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [expRes, brRes] = await Promise.all([
        api.get("/expenses"),
        api.get("/foundation/branches"),
      ]);
      setExpenses(expRes.data);
      setBranches(brRes.data);
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.description.trim() || !form.amount || !form.branchId) return;
    setSaving(true);
    try {
      await api.post("/expenses", {
        description: form.description.trim(),
        amount: parseFloat(form.amount),
        branchId: form.branchId,
        date: new Date(form.date).toISOString(),
      });
      setOpen(false);
      setForm({ description: "", amount: "", branchId: "", date: new Date().toISOString().split("T")[0] });
      load();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to save expense");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/expenses/${deleteId}`);
      setDeleteId(null);
      load();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to delete expense");
    }
  };

  const filtered = filterBranch ? expenses.filter((e) => e.branch?.id === filterBranch) : expenses;

  const stats = useMemo(() => {
    const total = filtered.reduce((s, e) => s + e.amount, 0);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayTotal = filtered.filter((e) => new Date(e.date) >= today).reduce((s, e) => s + e.amount, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthTotal = filtered.filter((e) => new Date(e.date) >= monthStart).reduce((s, e) => s + e.amount, 0);
    return { total, todayTotal, monthTotal };
  }, [filtered]);

  const fmt = (n: number) => `ETB ${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  return (
    <Box>
      <PageHeader
        title="Expenses"
        subtitle="Track and manage operational expenses across branches"
        breadcrumb="Expenses"
        action={
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
            Add Expense
          </Button>
        }
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Summary cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Today", value: stats.todayTotal, icon: <CalendarToday />, color: "#1e3c72" },
          { label: "This Month", value: stats.monthTotal, icon: <TrendingUp />, color: "#10b981" },
          { label: "All Time", value: stats.total, icon: <Receipt />, color: "#8b5cf6" },
        ].map((s) => (
          <Grid item xs={12} sm={4} key={s.label}>
            <Card sx={{ borderRadius: 2, borderLeft: `4px solid ${s.color}` }} elevation={1}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ color: s.color }}>{s.icon}</Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                    {s.label}
                  </Typography>
                  <Typography variant="h6" fontWeight={900} color={s.color}>
                    {fmt(s.value)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filter */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2, display: "flex", gap: 2, alignItems: "center" }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Branch</InputLabel>
          <Select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} label="Filter by Branch">
            <MenuItem value="">All Branches</MenuItem>
            {branches.map((b) => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary">
          {filtered.length} expense{filtered.length !== 1 ? "s" : ""}
        </Typography>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}><CircularProgress /></Box>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Receipt sx={{ fontSize: 56, color: "text.disabled" }} />}
          title="No expenses recorded"
          description="Start tracking operational expenses."
          action={<Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Expense</Button>}
        />
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ "& th": { fontWeight: 700, bgcolor: "grey.50" } }}>
                <TableCell>Description</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((exp) => (
                <TableRow key={exp.id} hover>
                  <TableCell>
                    <Typography fontWeight={500}>{exp.description}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={exp.branch?.name || "—"} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{new Date(exp.date).toLocaleDateString()}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={700} color="error.main">{fmt(exp.amount)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => setDeleteId(exp.id)}><Delete fontSize="small" /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>Add Expense</DialogTitle>
        <DialogContent sx={{ pt: "12px !important" }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Description *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={2} />
            <TextField label="Amount (ETB) *" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} fullWidth type="number"
              InputProps={{ startAdornment: <InputAdornment position="start">ETB</InputAdornment> }} />
            <FormControl fullWidth>
              <InputLabel>Branch *</InputLabel>
              <Select value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })} label="Branch *">
                {branches.map((b) => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Date *" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} fullWidth type="date"
              InputLabelProps={{ shrink: true }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}
            disabled={saving || !form.description.trim() || !form.amount || !form.branchId}>
            {saving ? <CircularProgress size={18} /> : "Add Expense"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs">
        <DialogTitle fontWeight={700}>Delete Expense?</DialogTitle>
        <DialogContent>
          <Typography>This will permanently remove this expense record.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
