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
    TablePagination,
    Button
} from '@mui/material';
import { Search as SearchIcon, ArrowBack as ArrowBackIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { TAXONOMY } from '../data/taxonomy';

interface CategoryData {
    name: string;
    description: string;
    subcategoryCount: number;
    skillCount: number;
}

const CategoriesPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const allCategories: CategoryData[] = useMemo(() => {
        return TAXONOMY.map(category => ({
            name: category.name,
            description: category.description,
            subcategoryCount: category.subcategories.length,
            skillCount: category.subcategories.reduce((acc, sub) => acc + sub.skills.length, 0)
        })).sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    const filteredCategories = useMemo(() => {
        return allCategories.filter(category =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allCategories, searchTerm]);

    const paginatedCategories = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return filteredCategories.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredCategories, page, rowsPerPage]);

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

    const handleCreateCategory = () => {
        // Placeholder for create functionality
        alert('Create Category functionality coming soon!');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <IconButton onClick={() => navigate('/skills-configuration')}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">
                    Categories
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateCategory}
                >
                    Create Category
                </Button>
            </Box>

            <Paper sx={{ p: 3, mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search categories..."
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
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Category Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Subcategories</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Skills</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedCategories.length > 0 ? (
                            paginatedCategories.map((category) => (
                                <TableRow key={category.name} hover>
                                    <TableCell sx={{ fontWeight: 500 }}>{category.name}</TableCell>
                                    <TableCell sx={{ maxWidth: 400 }}>{category.description}</TableCell>
                                    <TableCell align="right">{category.subcategoryCount}</TableCell>
                                    <TableCell align="right">{category.skillCount}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">
                                        No categories found matching your search
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={filteredCategories.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Box>
    );
};

export default CategoriesPage;
