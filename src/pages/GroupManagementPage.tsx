import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Stack,
    Paper,
    Grid,
    CircularProgress,
    Alert,
    IconButton,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import GroupTreeView from '../components/GroupTreeView';
import CreateGroupModal from '../components/CreateGroupModal';
import EditGroupModal from '../components/EditGroupModal';
import { mockService } from '../services/mockService';
import type { Group, User, UserGroup } from '../types/models';

const GroupManagementPage: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [groupsData, usersData] = await Promise.all([
                mockService.getGroups(),
                mockService.getAllUsers()
            ]);
            setGroups(groupsData);
            setUsers(usersData);

            // Load all user-group relationships
            const allUserGroups: UserGroup[] = [];
            for (const user of usersData) {
                const userGroupData = await mockService.getUserGroups(user.id);
                allUserGroups.push(...userGroupData);
            }
            setUserGroups(allUserGroups);
        } catch (err) {
            setError('Failed to load groups');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async (group: Omit<Group, 'id'>) => {
        try {
            const newGroup = await mockService.createGroup(group);
            setGroups([...groups, newGroup]);
            setCreateModalOpen(false);
        } catch (err) {
            console.error('Failed to create group:', err);
        }
    };

    const handleUpdateGroup = async (group: Group) => {
        try {
            await mockService.updateGroup(group);
            setGroups(groups.map(g => g.id === group.id ? group : g));
            setEditModalOpen(false);
        } catch (err) {
            console.error('Failed to update group:', err);
        }
    };

    const handleDeleteGroup = async () => {
        if (!selectedGroupId) return;

        if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
            try {
                await mockService.deleteGroup(selectedGroupId);
                setGroups(groups.filter(g => g.id !== selectedGroupId));
                setSelectedGroupId(null);
            } catch (err) {
                console.error('Failed to delete group:', err);
            }
        }
    };

    const handleAddMember = async (userId: string, groupId: string, isPrimary: boolean) => {
        try {
            const newUserGroup = await mockService.addUserToGroup(userId, groupId, isPrimary);
            setUserGroups([...userGroups, newUserGroup]);
        } catch (err) {
            console.error('Failed to add member:', err);
        }
    };

    const handleRemoveMember = async (userId: string, groupId: string) => {
        try {
            await mockService.removeUserFromGroup(userId, groupId);
            setUserGroups(userGroups.filter(ug => !(ug.userId === userId && ug.groupId === groupId)));
        } catch (err) {
            console.error('Failed to remove member:', err);
        }
    };

    const selectedGroup = selectedGroupId ? groups.find(g => g.id === selectedGroupId) || null : null;
    const selectedGroupMemberIds = selectedGroupId
        ? userGroups.filter(ug => ug.groupId === selectedGroupId).map(ug => ug.userId)
        : [];

    const memberCounts = groups.reduce((acc, group) => {
        acc[group.id] = userGroups.filter(ug => ug.groupId === group.id).length;
        return acc;
    }, {} as Record<string, number>);

    const groupOwner = selectedGroup?.ownerId ? users.find(u => u.id === selectedGroup.ownerId) : null;

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
                            Group Management
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setCreateModalOpen(true)}
                        >
                            Create Group
                        </Button>
                    </Stack>
                    <Typography variant="body1" color="text.secondary">
                        Manage organizational groups, departments, and practices
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Two-Panel Layout */}
                <Grid container spacing={3}>
                    {/* Left Panel: Group Tree */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ height: '70vh', overflow: 'auto' }}>
                            <GroupTreeView
                                groups={groups}
                                selectedGroupId={selectedGroupId || undefined}
                                onGroupSelect={setSelectedGroupId}
                                memberCounts={memberCounts}
                            />
                        </Paper>
                    </Grid>

                    {/* Right Panel: Group Details */}
                    <Grid item xs={12} md={8}>
                        {selectedGroup ? (
                            <Paper sx={{ p: 4, height: '70vh', overflow: 'auto' }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold">
                                            {selectedGroup.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedGroup.type}
                                        </Typography>
                                    </Box>
                                    <Stack direction="row" spacing={1}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => setEditModalOpen(true)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={handleDeleteGroup}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                </Stack>

                                <Divider sx={{ mb: 3 }} />

                                <Stack spacing={3}>
                                    {selectedGroup.description && (
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Description
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedGroup.description}
                                            </Typography>
                                        </Box>
                                    )}

                                    {groupOwner && (
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Group Owner
                                            </Typography>
                                            <Typography variant="body1">
                                                {groupOwner.name} ({groupOwner.title || groupOwner.role})
                                            </Typography>
                                        </Box>
                                    )}

                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Members
                                        </Typography>
                                        <Typography variant="h6">
                                            {selectedGroupMemberIds.length} member{selectedGroupMemberIds.length !== 1 ? 's' : ''}
                                        </Typography>
                                        <Box sx={{ mt: 2 }}>
                                            {users.filter(u => selectedGroupMemberIds.includes(u.id)).map(user => (
                                                <Box key={user.id} sx={{ py: 1 }}>
                                                    <Typography variant="body1">
                                                        {user.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {user.title || user.role}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                </Stack>
                            </Paper>
                        ) : (
                            <Paper sx={{ p: 4, height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="body1" color="text.secondary">
                                    Select a group from the list to view details
                                </Typography>
                            </Paper>
                        )}
                    </Grid>
                </Grid>

                {/* Modals */}
                <CreateGroupModal
                    open={createModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    onCreate={handleCreateGroup}
                    users={users}
                    groups={groups}
                />

                <EditGroupModal
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    group={selectedGroup}
                    onUpdate={handleUpdateGroup}
                    onAddMember={handleAddMember}
                    onRemoveMember={handleRemoveMember}
                    users={users}
                    groups={groups}
                    memberIds={selectedGroupMemberIds}
                />
            </Box>
        </Container>
    );
};

export default GroupManagementPage;
