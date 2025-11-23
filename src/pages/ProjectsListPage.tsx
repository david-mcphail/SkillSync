import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
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

            <Grid container spacing={3}>
                {projects.map((project) => {
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
