import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem
} from '@mui/material';
import type { Project, ProjectStatus } from '../types/models';

interface CreateProjectModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (project: Omit<Project, 'id'>) => void;
    initialProject?: Project;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
    open,
    onClose,
    onSave,
    initialProject
}) => {
    const [formData, setFormData] = useState<Omit<Project, 'id'>>({
        name: '',
        clientName: '',
        projectCode: '',
        startDate: '',
        endDate: '',
        description: '',
        status: 'Pipeline',
        ownerId: '1' // Default to current user
    });

    useEffect(() => {
        if (initialProject) {
            const { id, ...rest } = initialProject;
            setFormData(rest);
        } else {
            // Reset form when opening for new project
            setFormData({
                name: '',
                clientName: '',
                projectCode: '',
                startDate: '',
                endDate: '',
                description: '',
                status: 'Pipeline',
                ownerId: '1'
            });
        }
    }, [initialProject, open]);

    const handleChange = (field: keyof Omit<Project, 'id'>) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose();
    };

    const isValid = formData.name && formData.clientName && formData.startDate && formData.endDate;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {initialProject ? 'Edit Project' : 'Create New Project'}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12} sm={8}>
                        <TextField
                            fullWidth
                            label="Project Name"
                            value={formData.name}
                            onChange={handleChange('name')}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            select
                            label="Status"
                            value={formData.status}
                            onChange={handleChange('status')}
                        >
                            <MenuItem value="Pipeline">Pipeline</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="On Hold">On Hold</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <TextField
                            fullWidth
                            label="Client Name"
                            value={formData.clientName}
                            onChange={handleChange('clientName')}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Project Code"
                            value={formData.projectCode}
                            onChange={handleChange('projectCode')}
                            placeholder="AUTO"
                            helperText="Leave blank to auto-generate"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Start Date"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange('startDate')}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="End Date (Estimated)"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange('endDate')}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            value={formData.description}
                            onChange={handleChange('description')}
                            multiline
                            rows={4}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!isValid}
                >
                    {initialProject ? 'Save Changes' : 'Create Project'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateProjectModal;
