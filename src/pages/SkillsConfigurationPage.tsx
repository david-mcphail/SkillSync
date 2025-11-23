import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { mockService } from '../services/mockService';
import type { TaxonomyCategory } from '../types/models';

const SkillsConfigurationPage: React.FC = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<TaxonomyCategory[]>([]);

    useEffect(() => {
        const loadCategories = async () => {
            const data = await mockService.getCategories();
            setCategories(data);
        };
        loadCategories();
    }, []);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Skills Configuration
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardActionArea 
                            onClick={() => navigate('/skills-configuration/categories')}
                            aria-label="Categories Manage skill categories"
                        >
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Categories
                                </Typography>
                                <Typography variant="h3" color="primary">
                                    {categories.length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Manage skill categories
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardActionArea 
                            onClick={() => navigate('/skills-configuration/subcategories')}
                            aria-label="Subcategories Manage skill subcategories"
                        >
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Subcategories
                                </Typography>
                                <Typography variant="h3" color="primary">
                                    {categories.reduce((acc, cat) => acc + cat.subcategories.length, 0)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Manage skill subcategories
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardActionArea 
                            onClick={() => navigate('/skills-configuration/skills')}
                            aria-label="Skills Master list of all skills"
                        >
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Skills
                                </Typography>
                                <Typography variant="h3" color="primary">
                                    {categories.reduce((acc, cat) => acc + cat.subcategories.reduce((subAcc, sub) => subAcc + sub.skills.length, 0), 0)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Master list of all skills
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardActionArea 
                            onClick={() => navigate('/skills-configuration/tags')}
                            aria-label="Tags Manage skill tags"
                        >
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Tags
                                </Typography>
                                <Typography variant="h3" color="primary">
                                    3
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Manage skill tags
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SkillsConfigurationPage;
