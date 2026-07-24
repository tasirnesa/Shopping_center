import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Paper, Alert, InputAdornment, alpha,
} from '@mui/material';
import { Email, Lock, Storefront } from '@mui/icons-material';
import api from '../api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Brand panel */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #6366f1 100%)',
          color: '#fff',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            bgcolor: alpha('#fff', 0.05),
            top: -100,
            right: -100,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            bgcolor: alpha('#fff', 0.05),
            bottom: -80,
            left: -80,
          }}
        />
        <Storefront sx={{ fontSize: 72, mb: 3, opacity: 0.9 }} />
        <Typography variant="h3" fontWeight={800} textAlign="center" sx={{ letterSpacing: '-0.03em', mb: 2 }}>
          Shop Center
        </Typography>
        <Typography variant="h6" textAlign="center" sx={{ opacity: 0.85, maxWidth: 360, fontWeight: 400, lineHeight: 1.6 }}>
          Manage products, inventory, sales, and your team — all in one place.
        </Typography>
        <Box sx={{ mt: 5, display: 'flex', gap: 3 }}>
          {['Products', 'Inventory', 'Sales', 'Reports'].map((f) => (
            <Box key={f} sx={{ textAlign: 'center', opacity: 0.75 }}>
              <Typography variant="caption" fontWeight={600}>{f}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Login form */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.55 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: { xs: 3, sm: 6 },
        }}
      >
        <Paper
          elevation={0}
          component="form"
          onSubmit={handleLogin}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            width: '100%',
            maxWidth: 420,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mb: 3 }}>
            <Storefront color="primary" />
            <Typography variant="h6" fontWeight={800}>Shop Center</Typography>
          </Box>

          <Typography variant="h5" fontWeight={800} mb={0.5} sx={{ letterSpacing: '-0.02em' }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Sign in to your account to continue
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <TextField
            label="Email address"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"><Email fontSize="small" color="action" /></InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"><Lock fontSize="small" color="action" /></InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !email || !password}
            sx={{ mt: 3, py: 1.5, borderRadius: 2.5, fontWeight: 700, fontSize: '1rem' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
