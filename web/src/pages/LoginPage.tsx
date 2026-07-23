import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, TextField, Typography, Paper, Container,
} from '@mui/material';
import api from '../api';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch {
            setError('Invalid credentials');
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        }}>
            <Container maxWidth="xs">
                <Paper elevation={8} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>
                        🏪 Shop Center
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
                        Sign in to manage your shop
                    </Typography>
                    {error && (
                        <Typography color="error" variant="body2" mb={2}>{error}</Typography>
                    )}
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mt: 2, py: 1.5, borderRadius: 2, fontWeight: 600 }}
                        onClick={handleLogin}
                    >
                        Sign In
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
}
