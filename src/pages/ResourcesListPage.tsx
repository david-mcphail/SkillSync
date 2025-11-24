import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Stack,
    Paper,
    Grid,
    Card,
    CardContent,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Download as DownloadIcon,
    People as PeopleIcon,
    CheckCircle as CheckCircleIcon,
    Groups as GroupsIcon
} from '@mui/icons-material';
import RosterGrid from '../components/RosterGrid';
import { mockService } from '../services/mockService';
import type { User, Group } from '../types/models';

const ResourcesListPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersData, groupsData] = await Promise.all([
                mockService.getAllUsers(),
                mockService.getGroups()
            ]);
            setUsers(usersData);
            setGroups(groupsData);
        } catch (error) {
            console.error('Failed to load resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        // Create CSV content
        const headers = ['Name', 'Email', 'Title', 'Department', 'Location', 'Status'];
        const rows = users.map(user => [
            user.name,
            user.email,
            user.title || user.role,
            user.department,
            user.location || '',
            user.status || 'Active'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resources-roster-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const activeUsers = users.filter(u => u.status === 'Active' || !u.status);



    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="h4" fontWeight="bold">
                            Resource Management
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={handleExportCSV}
                            >
                                Export CSV
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                disabled
                            >
                                Add New Resource
                            </Button>
                        </Stack>
                    </Stack>
                    <Typography variant="body1" color="text.secondary">
                        View and manage the organization's talent roster
                    </Typography>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Box
                                        sx={{
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            p: 1.5,
                                            borderRadius: 2
                                        }}
                                    >
                                        <PeopleIcon />
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold">
                                            {users.length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Headcount
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Box
                                        sx={{
                                            bgcolor: 'success.main',
                                            color: 'white',
                                            p: 1.5,
                                            borderRadius: 2
                                        }}
                                    >
                                        <CheckCircleIcon />
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold">
                                            {activeUsers.length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Active
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Box
                                        sx={{
                                            bgcolor: 'secondary.main',
                                            color: 'white',
                                            p: 1.5,
                                            borderRadius: 2
                                        }}
                                    >
                                        <GroupsIcon />
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold">
                                            {groups.filter(g => g.type === 'Department').length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Departments
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Box
                                        sx={{
                                            bgcolor: 'info.main',
                                            color: 'white',
                                            p: 1.5,
                                            borderRadius: 2
                                        }}
                                    >
                                        <GroupsIcon />
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold">
                                            {groups.filter(g => g.type === 'Practice').length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Practices
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Roster Grid */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Organization Roster
                    </Typography>
                    <RosterGrid users={users} groups={groups} />
                </Paper>
            </Box>
        </Container>
    );
};

export default ResourcesListPage;
