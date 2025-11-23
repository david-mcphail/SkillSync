import React, { useState, useMemo } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Grid,
    Avatar,
    Button,
    Divider,
    Stack,
    Card,
    CardActionArea,
    CardContent,
    IconButton
} from '@mui/material';
import {
    Edit as EditIcon,
    Add as AddIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { TAXONOMY, TAGS } from '../data/taxonomy';
import { mockService } from '../services/mockService';
import AddSkillModal from '../components/AddSkillModal';
import SkillChip from '../components/SkillChip';
import { type Skill, type TaxonomyCategory } from '../types/models';

const TAGS_CATEGORY: TaxonomyCategory = {
    name: 'Tags',
    description: 'View skills organized by their assigned tags.',
    subcategories: TAGS.map(tag => ({ name: tag.name, skills: [] }))
};

const ProfilePage: React.FC = () => {
    const { user, updateProfile } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState<TaxonomyCategory | null>(null);
    const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);

    console.log('TAGS_CATEGORY:', TAGS_CATEGORY);
    console.log('TAXONOMY length:', TAXONOMY.length);

    // Calculate counts and group skills
    const { categoryCounts, categorySkills } = useMemo(() => {
        const counts: Record<string, number> = {};
        const skills: Record<string, Skill[]> = {};

        if (user?.skills) {
            const taggedSkillIds = new Set<string>();

            user.skills.forEach(skill => {
                // Counts for regular categories
                counts[skill.category] = (counts[skill.category] || 0) + 1;

                // Grouping for regular categories
                if (selectedCategory && skill.category === selectedCategory.name) {
                    if (!skills[skill.subcategory]) {
                        skills[skill.subcategory] = [];
                    }
                    skills[skill.subcategory].push(skill);
                }

                // Logic for Tags
                if (skill.tags && skill.tags.length > 0) {
                    taggedSkillIds.add(skill.id);

                    if (selectedCategory?.name === 'Tags') {
                        skill.tags.forEach(tagId => {
                            const tag = TAGS.find(t => t.id === tagId);
                            if (tag) {
                                if (!skills[tag.name]) {
                                    skills[tag.name] = [];
                                }
                                // Avoid duplicates if a skill has multiple tags mapping to same name (unlikely but safe)
                                if (!skills[tag.name].some(s => s.id === skill.id)) {
                                    skills[tag.name].push(skill);
                                }
                            }
                        });
                    }
                }
            });
            counts['Tags'] = taggedSkillIds.size;
        }
        return { categoryCounts: counts, categorySkills: skills };
    }, [user?.skills, selectedCategory]);

    const handleAddSkill = async (newSkillData: Omit<Skill, 'id' | 'verified'>) => {
        if (!user) return;
        try {
            const addedSkill = await mockService.addSkill(user.email, newSkillData);
            // Update local user state via AuthContext
            const updatedUser = {
                ...user,
                skills: [...user.skills, addedSkill]
            };
            updateProfile(updatedUser);
        } catch (error) {
            console.error('Failed to add skill:', error);
        }
    };

    if (!user) return null;

    return (
        <Box>
            <Container maxWidth="lg">
                {/* Profile Header */}
                <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item>
                            <Avatar
                                src={user.avatarUrl}
                                alt={user.name}
                                sx={{ width: 100, height: 100, border: '4px solid rgba(108, 99, 255, 0.3)' }}
                            />
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h3" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2.5rem' } }}>
                                {user.name}
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ color: 'text.secondary' }}>
                                <Typography variant="subtitle1">{user.role}</Typography>
                                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                                <Typography variant="subtitle1">{user.department}</Typography>
                                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                                <Typography variant="subtitle1">{user.tenure}</Typography>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" startIcon={<EditIcon />}>
                                Edit Profile
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Main Content Area */}
                <Paper sx={{ p: 4, minHeight: 400 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {selectedCategory && (
                                <IconButton onClick={() => setSelectedCategory(null)} size="small" sx={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <ArrowBackIcon />
                                </IconButton>
                            )}
                            <Typography variant="h5">
                                {selectedCategory ? selectedCategory.name : 'Skills Overview'}
                            </Typography>
                        </Box>
                    </Box>

                    {!selectedCategory ? (
                        // Category Overview - Show all categories as cards
                        <Grid container spacing={3}>
                            {[...TAXONOMY, TAGS_CATEGORY].map((category) => (
                                <Grid item xs={12} sm={6} md={4} key={category.name}>
                                    <Card>
                                        <CardActionArea onClick={() => setSelectedCategory(category)}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    {category.name}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        bgcolor: 'rgba(108, 99, 255, 0.1)',
                                                        color: 'primary.main',
                                                        borderRadius: '12px',
                                                        px: 1.5,
                                                        py: 0.5,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold',
                                                        display: 'inline-block',
                                                        mb: 2
                                                    }}
                                                >
                                                    {categoryCounts[category.name] || 0}
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
                                                    {category.description}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        // Detailed Category View
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setIsAddSkillModalOpen(true)}
                                >
                                    Add Skill
                                </Button>
                            </Box>
                            {selectedCategory.subcategories.map((sub) => {
                                const skills = categorySkills[sub.name] || [];
                                return (
                                    <Box key={sub.name} sx={{ mb: 4 }}>
                                        <Typography
                                            variant="subtitle2"
                                            color="text.secondary"
                                            gutterBottom
                                            sx={{
                                                textTransform: 'uppercase',
                                                letterSpacing: 1,
                                                fontSize: '0.75rem',
                                                mb: 2,
                                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                pb: 1
                                            }}
                                        >
                                            {sub.name}
                                        </Typography>

                                        {skills.length > 0 ? (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {skills.map(skill => (
                                                    <SkillChip key={skill.id} skill={skill} />
                                                ))}
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', opacity: 0.5 }}>
                                                No skills added in this subcategory.
                                            </Typography>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                </Paper>
            </Container>

            <AddSkillModal
                open={isAddSkillModalOpen}
                onClose={() => setIsAddSkillModalOpen(false)}
                onAdd={handleAddSkill}
                initialCategory={selectedCategory}
            />
        </Box>
    );
};

export default ProfilePage;
