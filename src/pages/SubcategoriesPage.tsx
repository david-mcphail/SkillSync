import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    IconButton,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TablePagination,
    Button
} from '@mui/material';
import { Search as SearchIcon, ArrowBack as ArrowBackIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { TAXONOMY } from '../data/taxonomy';

interface FlatSubcategory {
    name: string;
    category: string;
    skillCount: number;
}

const SubcategoriesPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const allSubcategories: FlatSubcategory[] = useMemo(() => {
        const subcategories: FlatSubcategory[] = [];
        TAXONOMY.forEach(category => {
            category.subcategories.forEach(subcategory => {
                subcategories.push({
                    name: subcategory.name,
                    category: category.name,
                    skillCount: subcategory.skills.length
                });
            });
        });
        return subcategories.sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    const categories = useMemo(() => {
        return Array.from(new Set(allSubcategories.map(s => s.category))).sort();
    }, [allSubcategories]);

    const filteredSubcategories = useMemo(() => {
        return allSubcategories.filter(subcategory => {
            const matchesSearch =
                subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                subcategory.category.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = !categoryFilter || subcategory.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [allSubcategories, searchTerm, categoryFilter]);

    const paginatedSubcategories = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return filteredSubcategories.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredSubcategories, page, rowsPerPage]);

    const handleCategoryChange = (value: string) => {
        setCategoryFilter(value);
        setPage(0);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setPage(0);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setPage(0);
    };

    const handleCreateSubcategory = () => {
        alert('Create Subcategory functionality coming soon!');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <IconButton onClick={() => navigate('/skills-configuration')}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">
                    Subcategories
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateSubcategory}
                >
                    Create Subcategory
                </Button>
            </Box>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search subcategories..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={categoryFilter}
                                label="Category"
                                onChange={(e) => handleCategoryChange(e.target.value)}
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                {categories.map(cat => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <Typography
                                variant="body2"
                                color="primary"
                                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                onClick={handleClearFilters}
                            >
                                Clear Filters
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Subcategory Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Skill Count</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedSubcategories.length > 0 ? (
                            paginatedSubcategories.map((subcategory, index) => (
                                <TableRow key={`${subcategory.name}-${index}`} hover>
                                    <TableCell>{subcategory.name}</TableCell>
                                    <TableCell>{subcategory.category}</TableCell>
                                    <TableCell align="right">{subcategory.skillCount}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">
                                        No subcategories found matching your filters
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={filteredSubcategories.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Box>
    );
};

export default SubcategoriesPage;
