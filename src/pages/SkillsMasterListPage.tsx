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

interface FlatSkill {
    name: string;
    category: string;
    subcategory: string;
}

const SkillsMasterListPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [subcategoryFilter, setSubcategoryFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const allSkills: FlatSkill[] = useMemo(() => {
        const skills: FlatSkill[] = [];
        TAXONOMY.forEach(category => {
            category.subcategories.forEach(subcategory => {
                subcategory.skills.forEach(skillName => {
                    skills.push({
                        name: skillName,
                        category: category.name,
                        subcategory: subcategory.name
                    });
                });
            });
        });
        return skills.sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    const categories = useMemo(() => {
        return Array.from(new Set(allSkills.map(s => s.category))).sort();
    }, [allSkills]);

    const subcategories = useMemo(() => {
        if (!categoryFilter) return [];
        return Array.from(new Set(
            allSkills
                .filter(s => s.category === categoryFilter)
                .map(s => s.subcategory)
        )).sort();
    }, [allSkills, categoryFilter]);

    const filteredSkills = useMemo(() => {
        return allSkills.filter(skill => {
            const matchesSearch =
                skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                skill.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                skill.subcategory.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = !categoryFilter || skill.category === categoryFilter;
            const matchesSubcategory = !subcategoryFilter || skill.subcategory === subcategoryFilter;

            return matchesSearch && matchesCategory && matchesSubcategory;
        });
    }, [allSkills, searchTerm, categoryFilter, subcategoryFilter]);

    const paginatedSkills = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return filteredSkills.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredSkills, page, rowsPerPage]);

    const handleCategoryChange = (value: string) => {
        setCategoryFilter(value);
        setSubcategoryFilter('');
        setPage(0);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setSubcategoryFilter('');
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

    const handleSubcategoryChange = (value: string) => {
        setSubcategoryFilter(value);
        setPage(0);
    };

    const handleCreateSkill = () => {
        alert('Create Skill functionality coming soon!');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <IconButton onClick={() => navigate('/skills-configuration')}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">
                    Skills Master List
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateSkill}
                >
                    Create Skill
                </Button>
            </Box>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search skills..."
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
                    <Grid item xs={12} md={3}>
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
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth disabled={!categoryFilter}>
                            <InputLabel>Subcategory</InputLabel>
                            <Select
                                value={subcategoryFilter}
                                label="Subcategory"
                                onChange={(e) => handleSubcategoryChange(e.target.value)}
                            >
                                <MenuItem value="">All Subcategories</MenuItem>
                                {subcategories.map(sub => (
                                    <MenuItem key={sub} value={sub}>{sub}</MenuItem>
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
                            <TableCell sx={{ fontWeight: 'bold' }}>Skill Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Subcategory</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedSkills.length > 0 ? (
                            paginatedSkills.map((skill, index) => (
                                <TableRow key={`${skill.name}-${index}`} hover>
                                    <TableCell>{skill.name}</TableCell>
                                    <TableCell>{skill.category}</TableCell>
                                    <TableCell>{skill.subcategory}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">
                                        No skills found matching your filters
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={filteredSkills.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Box>
    );
};

export default SkillsMasterListPage;
