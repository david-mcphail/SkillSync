import React from 'react';
import { Box, Button, Container, Typography, Paper, Stack } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <Box>
            <Container maxWidth="lg">
                <Paper sx={{ p: 4, mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Dashboard
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Welcome back, {user?.name || 'User'}!
                    </Typography>
                    <Typography variant="body1" paragraph>
                        This is a protected area. You can only see this if you are logged in.
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" onClick={() => navigate('/profile')}>
                            View Profile
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};

export default DashboardPage;
