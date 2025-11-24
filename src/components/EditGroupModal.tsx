import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Autocomplete,
    Box,
    Typography,
    IconButton
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import type { Group, User, GroupType } from '../types/models';

interface EditGroupModalProps {
    open: boolean;
    onClose: () => void;
    group: Group | null;
    onUpdate: (group: Group) => Promise<void>;
    onAddMember: (userId: string, groupId: string, isPrimary: boolean) => Promise<void>;
    onRemoveMember: (userId: string, groupId: string) => Promise<void>;
    users: User[];
    groups: Group[];
    memberIds: string[];
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({
    open,
    onClose,
    group,
    onUpdate,
    onAddMember,
    onRemoveMember,
    users,
    groups,
    memberIds
}) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<GroupType>('Department');
    const [ownerId, setOwnerId] = useState<string>('');
    const [parentGroupId, setParentGroupId] = useState<string>('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        if (group) {
            setName(group.name);
            setType(group.type);
            setOwnerId(group.ownerId || '');
            setParentGroupId(group.parentGroupId || '');
            setDescription(group.description || '');
        }
    }, [group]);

    const handleSubmit = async () => {
        if (!group || !name.trim()) return;

        setSaving(true);
        try {
            await onUpdate({
                ...group,
                name: name.trim(),
                type,
                ownerId: ownerId || undefined,
                parentGroupId: parentGroupId || undefined,
                description: description.trim() || undefined
            });
        } catch (error) {
            console.error('Failed to update group:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleAddMember = async () => {
        if (!selectedUser || !group) return;

        try {
            await onAddMember(selectedUser.id, group.id, false);
            setSelectedUser(null);
        } catch (error) {
            console.error('Failed to add member:', error);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!group) return;

        try {
            await onRemoveMember(userId, group.id);
        } catch (error) {
            console.error('Failed to remove member:', error);
        }
    };

    const members = users.filter(u => memberIds.includes(u.id));
    const availableUsers = users.filter(u => !memberIds.includes(u.id));

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
        },
        {
            field: 'title',
            headerName: 'Title',
            flex: 1,
            renderCell: (params) => params.value || params.row.role,
        },
        {
            field: 'actions',
            headerName: '',
            width: 80,
            sortable: false,
            renderCell: (params) => (
                <IconButton
                    size="small"
                    onClick={() => handleRemoveMember(params.row.id)}
                    color="error"
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            ),
        },
    ];

    if (!group) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Edit Group: {group.name}</DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    {/* Group Details */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Group Details
                        </Typography>
                        <Stack spacing={2}>
                            <TextField
                                label="Group Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                fullWidth
                            />

                            <FormControl fullWidth required>
                                <InputLabel>Group Type</InputLabel>
                                <Select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as GroupType)}
                                    label="Group Type"
                                >
                                    <MenuItem value="Department">Department</MenuItem>
                                    <MenuItem value="Practice">Practice</MenuItem>
                                    <MenuItem value="Squad">Squad</MenuItem>
                                </Select>
                            </FormControl>

                            <Autocomplete
                                options={users}
                                getOptionLabel={(option) => option.name}
                                value={users.find(u => u.id === ownerId) || null}
                                onChange={(_event, newValue) => {
                                    setOwnerId(newValue?.id || '');
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Group Owner" />
                                )}
                            />

                            <Autocomplete
                                options={groups.filter(g => g.id !== group.id)}
                                getOptionLabel={(option) => option.name}
                                value={groups.find(g => g.id === parentGroupId) || null}
                                onChange={(_event, newValue) => {
                                    setParentGroupId(newValue?.id || '');
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Parent Group (Optional)" />
                                )}
                            />

                            <TextField
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                rows={2}
                                fullWidth
                            />
                        </Stack>
                    </Box>

                    {/* Members Section */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Members ({members.length})
                        </Typography>

                        {/* Add Member */}
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            <Autocomplete
                                options={availableUsers}
                                getOptionLabel={(option) => `${option.name} (${option.title || option.role})`}
                                value={selectedUser}
                                onChange={(_event, newValue) => {
                                    setSelectedUser(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Add Member" placeholder="Search users..." />
                                )}
                                sx={{ flex: 1 }}
                            />
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddMember}
                                disabled={!selectedUser}
                            >
                                Add
                            </Button>
                        </Stack>

                        {/* Members Grid */}
                        <Box sx={{ height: 300, width: '100%' }}>
                            <DataGrid
                                rows={members}
                                columns={columns}
                                pageSizeOptions={[5, 10]}
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 5 } },
                                }}
                                disableRowSelectionOnClick
                            />
                        </Box>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!name.trim() || saving}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditGroupModal;
