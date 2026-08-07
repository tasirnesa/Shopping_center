import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Collapse,
  IconButton,
  Tooltip,
  Alert,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  CheckCircle,
  Cancel,
  LocalShipping,
  Inventory,
  Refresh,
} from "@mui/icons-material";
import api from "../api";
import PageHeader from "../components/PageHeader";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_COLOR: Record<string, "default" | "warning" | "info" | "success" | "error" | "primary" | "secondary"> = {
  DRAFT: "default",
  SUBMITTED: "warning",
  WAITING_FOR_INVOICE: "warning",
  INVOICE_APPROVED: "info",
  WAITING_FOR_WAREHOUSE: "secondary",
  PICKING: "warning",
  PACKED: "info",
  READY_FOR_DELIVERY: "primary",
  OUT_FOR_DELIVERY: "primary",
  DELIVERED: "success",
  COMPLETED: "success",
  REJECTED: "error",
  CANCELLED: "error",
  RETURNED: "default",
};

function getUser() {
  try {
    const s = localStorage.getItem("user");
    if (s) return JSON.parse(s);
  } catch { }
  return {};
}

// ─── Metric card ─────────────────────────────────────────────────────────────
function MetricCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <Card elevation={2} sx={{ borderRadius: 3, borderLeft: `4px solid ${color}` }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: "12px !important" }}>
        <Box sx={{ color, fontSize: 32 }}>{icon}</Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1, color }}>{value}</Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>{label}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// ─── Order row with expandable detail ────────────────────────────────────────
function OrderRow({ order, userRole, onAction }: { order: any; userRole: string; onAction: () => void }) {
  const [open, setOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const act = async (endpoint: string, body?: any) => {
    setLoading(true);
    setError("");
    try {
      await api.post(`/orders/${order.id}/${endpoint}`, body ?? {});
      onAction();
    } catch (e: any) {
      setError(e.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const canApprove = ["INVOICE_MAKER", "OWNER", "MANAGER"].includes(userRole) && order.status === "SUBMITTED";
  const canReject  = canApprove;
  const canPick    = ["STORE_MAN", "OWNER", "MANAGER"].includes(userRole) && order.status === "WAITING_FOR_WAREHOUSE";
  const canPack    = ["STORE_MAN", "OWNER", "MANAGER"].includes(userRole) && order.status === "PICKING";
  const canPickup  = ["DRIVER", "OWNER", "MANAGER"].includes(userRole) && order.status === "READY_FOR_DELIVERY";
  const canDeliver = ["DRIVER", "OWNER", "MANAGER"].includes(userRole) && order.status === "OUT_FOR_DELIVERY";
  const canCancel  = ["MANAGER", "OWNER"].includes(userRole) &&
    ["DRAFT","SUBMITTED","WAITING_FOR_INVOICE","INVOICE_APPROVED","WAITING_FOR_WAREHOUSE","PICKING","PACKED","READY_FOR_DELIVERY"].includes(order.status);

  return (
    <>
      <TableRow hover sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: 13 }}>
          #{order.id.substring(0, 8).toUpperCase()}
        </TableCell>
        <TableCell sx={{ fontWeight: 600 }}>{order.customerName}</TableCell>
        <TableCell sx={{ color: "text.secondary", fontSize: 12 }}>{order.tin}</TableCell>
        <TableCell>
          <Chip
            label={order.status.replace(/_/g, " ")}
            color={STATUS_COLOR[order.status] ?? "default"}
            size="small"
            sx={{ fontWeight: 700, fontSize: 11 }}
          />
        </TableCell>
        <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
          ${order.grandTotal?.toFixed(2) ?? "—"}
        </TableCell>
        <TableCell sx={{ fontSize: 12, color: "text.secondary" }}>
          {new Date(order.createdAt).toLocaleDateString()}
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
          {canApprove && (
            <Tooltip title="Approve — generate invoice">
              <IconButton color="success" size="small" onClick={() => act("approve")} disabled={loading}>
                <CheckCircle fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {canReject && (
            <Tooltip title="Reject">
              <IconButton color="error" size="small" onClick={() => setRejectOpen(true)} disabled={loading}>
                <Cancel fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {canPick && (
            <Tooltip title="Start picking">
              <IconButton color="warning" size="small" onClick={() => act("pick")} disabled={loading}>
                <Inventory fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {canPack && (
            <Tooltip title="Confirm packing">
              <IconButton color="info" size="small" onClick={() => act("pack")} disabled={loading}>
                <LocalShipping fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {canPickup && (
            <Tooltip title="Driver pickup — out for delivery">
              <IconButton color="primary" size="small" onClick={() => act("pickup")} disabled={loading}>
                <LocalShipping fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {canDeliver && (
            <Tooltip title="Confirm delivery">
              <IconButton color="success" size="small" onClick={() => act("deliver")} disabled={loading}>
                <CheckCircle fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {canCancel && (
            <Tooltip title="Cancel order">
              <IconButton color="error" size="small" onClick={() => setRejectOpen(true)} disabled={loading}>
                <Cancel fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>

      {/* Expandable detail row */}
      <TableRow>
        <TableCell colSpan={8} sx={{ py: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2, px: 4 }}>
              {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Delivery: {order.deliveryAddress}
                </Typography>
                {/* Invoice print button — shown once order is approved */}
                {order.invoice && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CheckCircle />}
                    onClick={() => {
                      const token = localStorage.getItem("token");
                      window.open(`http://localhost:3000/invoices/${order.invoice.id}/print?token=${token}`, "_blank");
                    }}
                  >
                    {order.invoice.invoiceNumber} — Print Invoice
                  </Button>
                )}
              </Box>

              {/* Attachments */}
              {order.attachments?.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase" }}>
                    Documents
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
                    {order.attachments.map((a: any) => (
                      <Chip
                        key={a.id}
                        label={a.type.replace(/_/g, " ")}
                        size="small"
                        icon={<CheckCircle />}
                        color="success"
                        variant="outlined"
                        onClick={() => {
                          const token = localStorage.getItem("token");
                          window.open(
                            `http://localhost:3000/orders/${order.id}/attachments/${a.id}?token=${token}`,
                            "_blank"
                          );
                        }}
                        sx={{ cursor: "pointer" }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Lines table */}
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.lines?.map((line: any) => (
                    <TableRow key={line.id}>
                      <TableCell>{line.product?.name ?? line.productId}</TableCell>
                      <TableCell align="right">{line.quantity}</TableCell>
                      <TableCell align="right">${line.unitPrice.toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>${line.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} sx={{ fontWeight: 700 }}>Grand Total (incl. 15% tax)</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, color: "primary.main", fontSize: 15 }}>
                      ${order.grandTotal?.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {/* Status timeline */}
              {order.statusEvents?.length > 0 && (
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase" }}>
                    History
                  </Typography>
                  {order.statusEvents.map((e: any) => (
                    <Typography key={e.id} variant="caption" sx={{ display: "block", color: "text.secondary", mt: 0.25 }}>
                      {new Date(e.createdAt).toLocaleString()} — {e.previousStatus ?? "NEW"} → {e.newStatus}
                      {e.note ? ` (${e.note})` : ""}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Reject / Cancel dialog */}
      <Dialog open={rejectOpen} onClose={() => { setRejectOpen(false); setReason(""); }} maxWidth="xs" fullWidth>
        <DialogTitle>{canCancel && order.status !== "SUBMITTED" ? "Cancel Order" : "Reject Order"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason (min 10 chars)"
            fullWidth
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setRejectOpen(false); setReason(""); }}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={reason.trim().length < 10 || loading}
            onClick={() => {
              const endpoint = canCancel && order.status !== "SUBMITTED" ? "cancel" : "reject";
              act(endpoint, { reason: reason.trim() }).then(() => {
                setRejectOpen(false);
                setReason("");
              });
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const user = getUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, metricsRes] = await Promise.all([
        api.get("/orders"),
        api.get("/dashboard/fulfillment").catch(() => ({ data: null })),
      ]);
      setOrders(ordersRes.data);
      setMetrics(metricsRes.data);
    } catch (e: any) {
      console.error("Failed to load orders:", e.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = statusFilter === "ALL"
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => { statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1; });

  const filterButtons = [
    "ALL", "DRAFT", "SUBMITTED", "WAITING_FOR_WAREHOUSE", "PICKING",
    "READY_FOR_DELIVERY", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED",
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Order Fulfillment"
        subtitle="Manage the full order lifecycle from creation to delivery"
        breadcrumb="Orders"
      />

      {/* Dashboard metrics */}
      {metrics && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {metrics.sales && (
            <>
              <Grid item xs={6} sm={3}>
                <MetricCard label="Created Today" value={metrics.sales.createdToday} color="#1e3c72" icon={<CheckCircle />} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MetricCard label="Pending Approval" value={metrics.sales.pendingApproval} color="#f59e0b" icon={<CheckCircle />} />
              </Grid>
            </>
          )}
          {metrics.invoice && (
            <Grid item xs={6} sm={3}>
              <MetricCard label="Waiting Invoice" value={metrics.invoice.waitingApproval} color="#8b5cf6" icon={<CheckCircle />} />
            </Grid>
          )}
          {metrics.warehouse && (
            <>
              <Grid item xs={6} sm={3}>
                <MetricCard label="Waiting Picking" value={metrics.warehouse.waitingPicking} color="#f97316" icon={<Inventory />} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MetricCard label="Ready to Ship" value={metrics.warehouse.readyForDelivery} color="#10b981" icon={<LocalShipping />} />
              </Grid>
            </>
          )}
          {metrics.delivery && (
            <>
              <Grid item xs={6} sm={3}>
                <MetricCard label="Out for Delivery" value={metrics.delivery.outForDelivery} color="#0ea5e9" icon={<LocalShipping />} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MetricCard label="Delivered Today" value={metrics.delivery.deliveredToday} color="#22c55e" icon={<CheckCircle />} />
              </Grid>
            </>
          )}
        </Grid>
      )}

      {/* Filter chips */}
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <IconButton size="small" onClick={load} title="Refresh">
          <Refresh />
        </IconButton>
        {filterButtons.map((s) => (
          <Chip
            key={s}
            label={`${s.replace(/_/g, " ")}${s !== "ALL" && statusCounts[s] ? ` (${statusCounts[s]})` : ""}`}
            onClick={() => setStatusFilter(s)}
            color={statusFilter === s ? "primary" : "default"}
            variant={statusFilter === s ? "filled" : "outlined"}
            size="small"
            sx={{ fontWeight: 600, cursor: "pointer" }}
          />
        ))}
      </Box>

      {/* Orders table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        {filtered.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="h6">No orders found</Typography>
            <Typography variant="body2">Try changing the filter or check back later</Typography>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell width={48} />
                <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>TIN</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  userRole={user?.role ?? ""}
                  onAction={load}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
}
