import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Box,
    Typography,
    Autocomplete,
    Chip,
    MenuItem,
    IconButton
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { TAXONOMY } from '../data/taxonomy';
import type { ProjectRole, SkillRequirement, ProficiencyLevel } from '../types/models';

interface CreateRoleModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (role: Omit<ProjectRole, 'id'>) => void;
    projectId: string;
    initialRole?: ProjectRole;
}

const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
    open,
    onClose,
    onSave,
    projectId,
    initialRole
}) => {
    const [formData, setFormData] = useState<Omit<ProjectRole, 'id'>>({
        projectId,
        roleTitle: '',
        count: 1,
        requiredSkills: [],
        softSkillPreferences: [],
        description: ''
    });

    // Get all available skills from taxonomy
    const allSkills = TAXONOMY.flatMap(category =>
        category.subcategories.flatMap(subcategory =>
            subcategory.skills.map(skill => ({
                skillName: skill,
                category: category.name,
                subcategory: subcategory.name
            }))
        )
    );

    useEffect(() => {
        if (initialRole) {
            const { id, ...rest } = initialRole;
            setFormData(rest);
        } else {
            setFormData({
                projectId,
                roleTitle: '',
                count: 1,
                requiredSkills: [],
                softSkillPreferences: [],
                description: ''
            });
        }
    }, [initialRole, open, projectId]);

    const handleChange = (field: keyof Omit<ProjectRole, 'id'>) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleAddSkill = (skillInfo: { skillName: string; category: string; subcategory: string } | null, minProficiency: ProficiencyLevel) => {
        if (skillInfo) {
            const newSkill: SkillRequirement = {
                ...skillInfo,
                minProficiency
            };
            setFormData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, newSkill]
            }));
        }
    };

    const handleRemoveSkill = (index: number) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose();
    };

    const isValid = formData.roleTitle && formData.count > 0 && formData.requiredSkills.length > 0;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {initialRole ? 'Edit Role' : 'Define New Role'}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12} sm={8}>
                        <TextField
                            fullWidth
                            label="Role Title"
                            value={formData.roleTitle}
                            onChange={handleChange('roleTitle')}
                            placeholder="e.g., Senior Backend Developer"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Number of Positions"
                            value={formData.count}
                            onChange={handleChange('count')}
                            inputProps={{ min: 1 }}
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
                            rows={2}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
                            Required Skills *
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {formData.requiredSkills.map((skill, index) => (
                                <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Chip
                                        label={`${skill.skillName} (Level ${skill.minProficiency}+)`}
                                        onDelete={() => handleRemoveSkill(index)}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        {skill.category} → {skill.subcategory}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={8}>
                        <Autocomplete
                            options={allSkills}
                            getOptionLabel={(option) => `${option.skillName} (${option.category})`}
                            renderInput={(params) => (
                                <TextField {...params} label="Add Required Skill" />
                            )}
                            onChange={(_, value) => {
                                if (value) {
                                    handleAddSkill(value, 3); // Default to level 3
                                }
                            }}
                            value={null}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            select
                            label="Min Proficiency"
                            defaultValue={3}
                            helperText="For next skill added"
                        >
                            <MenuItem value={1}>1 - Novice</MenuItem>
                            <MenuItem value={2}>2 - Learner</MenuItem>
                            <MenuItem value={3}>3 - Competent</MenuItem>
                            <MenuItem value={4}>4 - Advanced</MenuItem>
                            <MenuItem value={5}>5 - Expert</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Soft Skill Preferences (comma-separated)"
                            value={formData.softSkillPreferences?.join(', ') || ''}
                            onChange={(e) => {
                                const prefs = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                setFormData(prev => ({ ...prev, softSkillPreferences: prefs }));
                            }}
                            placeholder="e.g., Spanish Speaker, Client Facing, Mentoring"
                            helperText="Optional preferences for this role"
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
                    {initialRole ? 'Save Changes' : 'Create Role'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateRoleModal;
