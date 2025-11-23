import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, Link, Stack, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email);
            navigate(from, { replace: true });
        } catch (err) {
            setError('Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at 50% 50%, rgba(108, 99, 255, 0.1) 0%, rgba(10, 14, 23, 1) 100%)',
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={24}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        background: 'rgba(20, 26, 38, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
                        SkillSync
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                        Sign in to your account
                    </Typography>
                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mb: 2 }}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Link href="#" variant="body2" color="secondary">
                                Forgot password?
                            </Link>
                            <Link href="#" variant="body2" color="text.secondary">
                                SSO Login
                            </Link>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;
