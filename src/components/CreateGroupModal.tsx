import React, { useState } from 'react';
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
    Autocomplete
} from '@mui/material';
import type { Group, User, GroupType } from '../types/models';

interface CreateGroupModalProps {
    open: boolean;
    onClose: () => void;
    onCreate: (group: Omit<Group, 'id'>) => Promise<void>;
    users: User[];
    groups: Group[];
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
    open,
    onClose,
    onCreate,
    users,
    groups
}) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<GroupType>('Department');
    const [ownerId, setOwnerId] = useState<string>('');
    const [parentGroupId, setParentGroupId] = useState<string>('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) return;

        setSaving(true);
        try {
            await onCreate({
                name: name.trim(),
                type,
                ownerId: ownerId || undefined,
                parentGroupId: parentGroupId || undefined,
                description: description.trim() || undefined
            });
            handleClose();
        } catch (error) {
            console.error('Failed to create group:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setName('');
        setType('Department');
        setOwnerId('');
        setParentGroupId('');
        setDescription('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <TextField
                        label="Group Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        fullWidth
                        autoFocus
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
                            <TextField {...params} label="Group Owner" placeholder="Select owner" />
                        )}
                    />

                    <Autocomplete
                        options={groups}
                        getOptionLabel={(option) => option.name}
                        value={groups.find(g => g.id === parentGroupId) || null}
                        onChange={(_event, newValue) => {
                            setParentGroupId(newValue?.id || '');
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Parent Group (Optional)" placeholder="Select parent" />
                        )}
                    />

                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!name.trim() || saving}
                >
                    {saving ? 'Creating...' : 'Create Group'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateGroupModal;
