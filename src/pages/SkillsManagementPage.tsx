import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Divider,
    Alert,
    Snackbar
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { mockService } from '../services/mockService';
import type { TaxonomyCategory } from '../types/models';

const SkillsManagementPage: React.FC = () => {
    const [categories, setCategories] = useState<TaxonomyCategory[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCategory, setEditingCategory] = useState<TaxonomyCategory | null>(null);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const data = await mockService.getCategories();
        setCategories(data);
    };

    const handleOpenDialog = (category?: TaxonomyCategory) => {
        if (category) {
            setEditingCategory(category);
            setCategoryName(category.name);
            setCategoryDescription(category.description);
        } else {
            setEditingCategory(null);
            setCategoryName('');
            setCategoryDescription('');
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingCategory(null);
        setCategoryName('');
        setCategoryDescription('');
    };

    const handleSaveCategory = async () => {
        if (!categoryName.trim()) return;

        try {
            if (editingCategory) {
                await mockService.updateCategory({
                    ...editingCategory,
                    name: categoryName,
                    description: categoryDescription
                });
                setSnackbar({ open: true, message: 'Category updated successfully', severity: 'success' });
            } else {
                await mockService.addCategory({
                    name: categoryName,
                    description: categoryDescription,
                    subcategories: [] // Initialize with empty subcategories
                });
                setSnackbar({ open: true, message: 'Category added successfully', severity: 'success' });
            }
            loadCategories();
            handleCloseDialog();
        } catch (error) {
            console.error('Failed to save category:', error);
            setSnackbar({ open: true, message: 'Failed to save category', severity: 'error' });
        }
    };

    const handleDeleteCategory = async (name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await mockService.deleteCategory(name);
                setSnackbar({ open: true, message: 'Category deleted successfully', severity: 'success' });
                loadCategories();
            } catch (error) {
                console.error('Failed to delete category:', error);
                setSnackbar({ open: true, message: 'Failed to delete category', severity: 'error' });
            }
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Skills Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Category
                </Button>
            </Box>

            <Paper variant="outlined">
                <List>
                    {categories.map((category, index) => (
                        <React.Fragment key={category.name}>
                            {index > 0 && <Divider />}
                            <ListItem
                                secondaryAction={
                                    <Box>
                                        <IconButton edge="end" aria-label="edit" onClick={() => handleOpenDialog(category)} sx={{ mr: 1 }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCategory(category.name)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                }
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" component="div">
                                            {category.name}
                                        </Typography>
                                    }
                                    secondary={category.description}
                                />
                            </ListItem>
                        </React.Fragment>
                    ))}
                    {categories.length === 0 && (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography color="text.secondary">No categories found. Add one to get started.</Typography>
                        </Box>
                    )}
                </List>
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Category Name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            fullWidth
                            required
                            autoFocus
                        />
                        <TextField
                            label="Description"
                            value={categoryDescription}
                            onChange={(e) => setCategoryDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSaveCategory} variant="contained" disabled={!categoryName.trim()}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default SkillsManagementPage;
