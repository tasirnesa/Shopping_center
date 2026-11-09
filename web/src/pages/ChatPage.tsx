import { useEffect, useState, useRef, useCallback } from "react";
import {
  Box, Paper, Typography, TextField, Button, List, ListItem,
  ListItemButton, ListItemText, ListItemAvatar, Avatar, Divider,
  CircularProgress, Badge, useTheme, alpha,
} from "@mui/material";
import { Send, Chat as ChatIcon } from "@mui/icons-material";
import api from "../api";
import PageHeader from "../components/PageHeader";

interface ChatUser {
  id: string;
  name: string;
  email: string;
  role: string;
  unread?: number;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  recipientId: string;
  createdAt: string;
}

function getUser() {
  try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
}

const ROLE_COLORS: Record<string, string> = {
  OWNER: "#1e3c72", MANAGER: "#0369a1", CASHIER: "#059669",
  STORE_KEEPER: "#d97706", SALES_REP: "#7c3aed",
  INVOICE_MAKER: "#8b5cf6", STORE_MAN: "#f59e0b", DRIVER: "#3b82f6",
};

export default function ChatPage() {
  const theme = useTheme();
  const currentUser = getUser();
  const [contacts, setContacts] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadContacts = useCallback(async () => {
    try {
      const res = await api.get("/chat/users");
      setContacts(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const loadMessages = useCallback(async (userId: string) => {
    try {
      const res = await api.get(`/chat/${userId}`);
      setMessages(res.data);
      // Mark as read locally
      setContacts((prev) => prev.map((c) => c.id === userId ? { ...c, unread: 0 } : c));
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    loadContacts();
    const id = setInterval(loadContacts, 15000);
    return () => clearInterval(id);
  }, [loadContacts]);

  useEffect(() => {
    if (selectedUser) loadMessages(selectedUser.id);
  }, [selectedUser, loadMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedUser) return;
    setSending(true);
    try {
      await api.post(`/chat/${selectedUser.id}`, { text: input.trim() });
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        text: input.trim(),
        senderId: currentUser.id,
        recipientId: selectedUser.id,
        createdAt: new Date().toISOString(),
      }]);
      setInput("");
    } catch (e: any) {
      console.error(e);
    } finally { setSending(false); }
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <PageHeader title="Chat" subtitle="Send messages to your team members" breadcrumb="Chat" />
      <Paper sx={{ display: "flex", height: "calc(100vh - 200px)", borderRadius: 3, overflow: "hidden" }} elevation={2}>
        {/* Contact list */}
        <Box sx={{ width: 280, borderRight: `1px solid ${theme.palette.divider}`, overflowY: "auto" }}>
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="subtitle2" fontWeight={700}>Team Members</Typography>
          </Box>
          <List dense>
            {contacts.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">No contacts available</Typography>
              </Box>
            ) : contacts.map((c) => (
              <ListItemButton
                key={c.id}
                selected={selectedUser?.id === c.id}
                onClick={() => setSelectedUser(c)}
                sx={{
                  "&.Mui-selected": { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                }}
              >
                <ListItemAvatar>
                  <Badge badgeContent={c.unread || 0} color="error" invisible={!c.unread}>
                    <Avatar sx={{ bgcolor: ROLE_COLORS[c.role] || "#64748b", width: 40, height: 40, fontSize: 14, fontWeight: 700 }}>
                      {(c.name || c.email)?.[0]?.toUpperCase() || "?"}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="body2" fontWeight={600} noWrap>{c.name || c.email}</Typography>}
                  secondary={<Typography variant="caption" color="text.secondary">{c.role?.replace(/_/g, " ").toLowerCase()}</Typography>}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Message area */}
        {selectedUser ? (
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ bgcolor: ROLE_COLORS[selectedUser.role] || "#64748b", width: 36, height: 36, fontSize: 13, fontWeight: 700 }}>
                {(selectedUser.name || selectedUser.email)?.[0]?.toUpperCase() || "?"}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>{selectedUser.name || selectedUser.email}</Typography>
                <Typography variant="caption" color="text.secondary">{selectedUser.role?.replace(/_/g, " ").toLowerCase()}</Typography>
              </Box>
            </Box>

            {/* Messages */}
            <Box ref={scrollRef} sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              {messages.length === 0 ? (
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography color="text.secondary">No messages yet. Say hello!</Typography>
                </Box>
              ) : messages.map((m) => {
                const isMine = m.senderId === currentUser.id;
                return (
                  <Box key={m.id} sx={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
                    <Box sx={{
                      maxWidth: "70%",
                      px: 2, py: 1, borderRadius: 2,
                      bgcolor: isMine ? theme.palette.primary.main : theme.palette.background.default,
                      color: isMine ? "#fff" : theme.palette.text.primary,
                      border: isMine ? "none" : `1px solid ${theme.palette.divider}`,
                    }}>
                      <Typography variant="body2" sx={{ wordBreak: "break-word" }}>{m.text}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.6, display: "block", mt: 0.25 }}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* Input */}
            <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              <Button variant="contained" onClick={handleSend} disabled={sending || !input.trim()} sx={{ minWidth: 48, px: 1.5 }}>
                <Send />
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "text.secondary" }}>
            <ChatIcon sx={{ fontSize: 56, mb: 1, opacity: 0.3 }} />
            <Typography>Select a contact to start chatting</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
