import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Chip
} from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { mockService } from '../services/mockService';
import type { Tag } from '../types/models';

const TagsPage: React.FC = () => {
    const navigate = useNavigate();
    const [tags, setTags] = useState<Tag[]>([]);
    const [open, setOpen] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#2196f3'); // Default blue
    const [newTagDescription, setNewTagDescription] = useState('');

    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = async () => {
        const data = await mockService.getTags();
        setTags(data);
    };

    const handleAddTag = async () => {
        if (!newTagName) return;

        await mockService.addTag({
            name: newTagName,
            color: newTagColor,
            description: newTagDescription
        });
        setOpen(false);
        setNewTagName('');
        setNewTagColor('#2196f3');
        setNewTagDescription('');
        loadTags();
    };

    const handleDeleteTag = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this tag?')) {
            await mockService.deleteTag(id);
            loadTags();
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/skills-configuration')} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1">
                    Tags
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Add Tag
                </Button>
            </Box>

            <Grid container spacing={3}>
                {tags.map((tag) => (
                    <Grid key={tag.id} item xs={12} sm={6} md={4}>
                        <Card
                            variant="outlined"
                            sx={{
                                height: '100%',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    borderColor: 'primary.main',
                                    boxShadow: '0 4px 20px rgba(108, 99, 255, 0.15)'
                                }
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Chip
                                        label={tag.name}
                                        sx={{ bgcolor: tag.color, color: 'white', fontWeight: 'bold' }}
                                    />
                                    <IconButton onClick={() => handleDeleteTag(tag.id)} color="error" size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                                    {tag.description || 'No description available.'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New Tag</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            autoFocus
                            label="Tag Name"
                            fullWidth
                            variant="outlined"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={3}
                            value={newTagDescription}
                            onChange={(e) => setNewTagDescription(e.target.value)}
                        />
                        <TextField
                            label="Color (Hex)"
                            fullWidth
                            variant="outlined"
                            value={newTagColor}
                            onChange={(e) => setNewTagColor(e.target.value)}
                            type="color"
                            sx={{ input: { height: 50 } }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddTag} variant="contained" disabled={!newTagName}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TagsPage;
