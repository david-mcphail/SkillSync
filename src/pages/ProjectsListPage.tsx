import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    CircularProgress,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Paper,
    Divider,
    InputAdornment
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { mockService } from '../services/mockService';
import type { Project, ProjectRole, ProjectAssignment } from '../types/models';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';

const ProjectsListPage: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectRoles, setProjectRoles] = useState<ProjectRole[]>([]);
    const [projectAssignments, setProjectAssignments] = useState<ProjectAssignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>();
    const [groupBy, setGroupBy] = useState<'none' | 'customer' | 'portfolio'>('none');
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [projectsData, rolesData, assignmentsData] = await Promise.all([
                mockService.getProjects(),
                // Get all roles for all projects
                Promise.all((await mockService.getProjects()).map(p => mockService.getProjectRoles(p.id))).then(results => results.flat()),
                // Get all assignments for all projects
                Promise.all((await mockService.getProjects()).map(p => mockService.getProjectAssignments(p.id))).then(results => results.flat())
            ]);
            setProjects(projectsData);
            setProjectRoles(rolesData);
            setProjectAssignments(assignmentsData);
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (project: Omit<Project, 'id'>) => {
        try {
            // Auto-generate project code if not provided
            const projectCode = project.projectCode || `PROJ-${Date.now().toString().slice(-6)}`;
            await mockService.createProject({ ...project, projectCode });
            await loadData();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const handleEditProject = async (project: Omit<Project, 'id'>) => {
        if (editingProject) {
            try {
                await mockService.updateProject({ ...project, id: editingProject.id });
                await loadData();
                setEditingProject(undefined);
            } catch (error) {
                console.error('Error updating project:', error);
            }
        }
    };

    const getProjectStats = (projectId: string) => {
        const roles = projectRoles.filter(r => r.projectId === projectId);
        const assignments = projectAssignments.filter(a => a.projectId === projectId && a.status === 'Active');

        const totalRoles = roles.reduce((sum, role) => sum + role.count, 0);
        const filledRoles = assignments.length;

        return { filledRoles, totalRoles };
    };

    const getGroupedProjects = () => {
        let filtered = projects;
        if (filterText) {
            const lower = filterText.toLowerCase();
            filtered = projects.filter(p =>
                p.name.toLowerCase().includes(lower) ||
                p.clientName.toLowerCase().includes(lower) ||
                p.projectCode.toLowerCase().includes(lower) ||
                (p.portfolio && p.portfolio.toLowerCase().includes(lower))
            );
        }

        if (groupBy === 'none') return { 'All Projects': filtered };

        return filtered.reduce((groups, project) => {
            const key = groupBy === 'customer' ? project.clientName : (project.portfolio || 'Unassigned');
            if (!groups[key]) groups[key] = [];
            groups[key].push(project);
            return groups;
        }, {} as Record<string, Project[]>);
    };

    const groupedProjects = getGroupedProjects();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Projects
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateModalOpen(true)}
                >
                    Create Project
                </Button>
            </Box>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Search projects..."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: { md: 'flex-end' } }}>
                            <FilterIcon color="action" />
                            <FormControl size="small" sx={{ minWidth: 200 }}>
                                <InputLabel>Group By</InputLabel>
                                <Select
                                    value={groupBy}
                                    label="Group By"
                                    onChange={(e) => setGroupBy(e.target.value as any)}
                                >
                                    <MenuItem value="none">None</MenuItem>
                                    <MenuItem value="customer">Customer</MenuItem>
                                    <MenuItem value="portfolio">Portfolio</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {Object.entries(groupedProjects).map(([group, groupProjects]) => (
                <Box key={group} sx={{ mb: 4 }}>
                    {groupBy !== 'none' && (
                        <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                            {group} ({groupProjects.length})
                        </Typography>
                    )}
                    <Grid container spacing={3}>
                        {groupProjects.map((project) => {
                            const stats = getProjectStats(project.id);
                            return (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={project.id}
                                    sx={{ display: 'flex' }}
                                >
                                    <ProjectCard
                                        project={project}
                                        filledRoles={stats.filledRoles}
                                        totalRoles={stats.totalRoles}
                                        onClick={() => navigate(`/projects/${project.id}`)}
                                        onEdit={() => {
                                            setEditingProject(project);
                                            setCreateModalOpen(true);
                                        }}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            ))}

            {projects.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No projects yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Create your first project to get started with resource management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateModalOpen(true)}
                    >
                        Create First Project
                    </Button>
                </Box>
            )}

            <CreateProjectModal
                open={createModalOpen}
                onClose={() => {
                    setCreateModalOpen(false);
                    setEditingProject(undefined);
                }}
                onSave={editingProject ? handleEditProject : handleCreateProject}
                initialProject={editingProject}
            />
        </Box>
    );
};

export default ProjectsListPage;
