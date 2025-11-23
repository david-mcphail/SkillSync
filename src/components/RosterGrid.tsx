import React, { useState, useMemo } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Avatar,
    Typography
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRowParams } from '@mui/x-data-grid';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { User, Group } from '../types/models';

interface RosterGridProps {
    users: User[];
    groups: Group[];
    onUserClick?: (userId: string) => void;
}

const RosterGrid: React.FC<RosterGridProps> = ({ users, groups, onUserClick }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGroup, setFilterGroup] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    // Filter users based on search and filters
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.title && user.title.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesGroup = filterGroup === 'all' || user.department === filterGroup;
            const matchesStatus = filterStatus === 'all' || user.status === filterStatus;

            return matchesSearch && matchesGroup && matchesStatus;
        });
    }, [users, searchTerm, filterGroup, filterStatus]);

    const columns: GridColDef[] = [
        {
            field: 'avatar',
            headerName: '',
            width: 60,
            sortable: false,
            renderCell: (params) => (
                <Avatar
                    src={params.row.avatarUrl}
                    alt={params.row.name}
                    sx={{ width: 40, height: 40 }}
                />
            ),
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            minWidth: 180,
        },
        {
            field: 'title',
            headerName: 'Title',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <Typography variant="body2">
                    {params.value || params.row.role}
                </Typography>
            ),
        },
        {
            field: 'department',
            headerName: 'Primary Group',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'location',
            headerName: 'Location',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                <Typography variant="body2" color="text.secondary">
                    {params.value || 'Not specified'}
                </Typography>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value || 'Active'}
                    color={params.value === 'Active' ? 'success' : 'default'}
                    size="small"
                    sx={{ fontWeight: 'medium' }}
                />
            ),
        },
    ];

    const handleRowClick = (params: GridRowParams) => {
        if (onUserClick) {
            onUserClick(params.row.id);
        } else {
            navigate(`/profile/${params.row.id}`);
        }
    };

    return (
        <Box>
            {/* Filters */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <TextField
                    placeholder="Search by name, email, or title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flex: 1 }}
                />
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Group</InputLabel>
                    <Select
                        value={filterGroup}
                        onChange={(e) => setFilterGroup(e.target.value)}
                        label="Group"
                    >
                        <MenuItem value="all">All Groups</MenuItem>
                        {groups.filter(g => g.type === 'Department').map((group) => (
                            <MenuItem key={group.id} value={group.name}>
                                {group.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        label="Status"
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>
            </Stack>

            {/* Data Grid */}
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={filteredUsers}
                    columns={columns}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50]}
                    onRowClick={handleRowClick}
                    disableRowSelectionOnClick
                    sx={{
                        '& .MuiDataGrid-row': {
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'rgba(108, 99, 255, 0.08)',
                            },
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default RosterGrid;
