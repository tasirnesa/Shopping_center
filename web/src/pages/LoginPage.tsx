import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  alpha,
} from "@mui/material";
import { Email, Lock, Storefront, ArrowForward } from "@mui/icons-material";
import api from "../api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
        position: "relative",
        overflow: "hidden",
        p: 2,
      }}
    >
      {/* Background Decorative Bloom Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "50vw",
          height: "50vw",
          minWidth: 400,
          minHeight: 400,
          bgcolor: "rgba(99, 102, 241, 0.3)",
          filter: "blur(100px)",
          borderRadius: "50%",
          animation: "pulse 8s ease-in-out infinite alternate",
          "@keyframes pulse": {
            "0%": { transform: "scale(1)", opacity: 0.6 },
            "100%": { transform: "scale(1.2)", opacity: 0.9 },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: "40vw",
          height: "40vw",
          minWidth: 300,
          minHeight: 300,
          bgcolor: "rgba(236, 72, 153, 0.25)",
          filter: "blur(100px)",
          borderRadius: "50%",
          animation: "pulse2 10s ease-in-out infinite alternate",
          "@keyframes pulse2": {
            "0%": { transform: "scale(1) translate(0px, 0px)", opacity: 0.5 },
            "100%": {
              transform: "scale(1.3) translate(20px, -40px)",
              opacity: 0.8,
            },
          },
        }}
      />

      {/* Glassmorphism Card */}
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          p: { xs: 4, sm: 6 },
          borderRadius: 6,
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow:
            "0 24px 64px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            gap: 1.5,
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 54,
              height: 54,
              borderRadius: 3,
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              boxShadow: "0 8px 16px rgba(99, 102, 241, 0.4)",
            }}
          >
            <Storefront sx={{ fontSize: 32, color: "#fff" }} />
          </Box>
        </Box>

        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.02em",
              mb: 1,
              background: "linear-gradient(to right, #ffffff, #c7d2fe)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Shop Center Pro
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: alpha("#fff", 0.7), fontWeight: 500 }}
          >
            Sign in to access your business dashboard.
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              borderRadius: 3,
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#ffb3b3",
              "& .MuiAlert-icon": { color: "#ef4444" },
            }}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            fullWidth
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderRadius: 3,
                transition: "all 0.2s",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                "&.Mui-focused fieldset": {
                  borderColor: "#818cf8",
                  borderWidth: "2px",
                },
                "&.Mui-focused": { backgroundColor: "rgba(0, 0, 0, 0.3)" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "rgba(255,255,255,0.6)" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderRadius: 3,
                transition: "all 0.2s",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                "&.Mui-focused fieldset": {
                  borderColor: "#818cf8",
                  borderWidth: "2px",
                },
                "&.Mui-focused": { backgroundColor: "rgba(0, 0, 0, 0.3)" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "rgba(255,255,255,0.6)" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || !email || !password}
          endIcon={!loading && <ArrowForward />}
          sx={{
            mt: 2,
            py: 1.8,
            borderRadius: 3,
            fontWeight: 800,
            fontSize: "1.05rem",
            textTransform: "none",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            boxShadow: "0 8px 24px rgba(99, 102, 241, 0.4)",
            transition: "all 0.3s ease",
            color: "#ffffff",
            "&:hover": {
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              boxShadow: "0 12px 32px rgba(99, 102, 241, 0.6)",
              transform: "translateY(-2px)",
            },
            "&.Mui-disabled": {
              background: "rgba(255, 255, 255, 0.1)",
              color: "rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          {loading ? "Authenticating..." : "Sign In"}
        </Button>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            gap: 3,
            opacity: 0.6,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Products
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Inventory
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Analytics
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
