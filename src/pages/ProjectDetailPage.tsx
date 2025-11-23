import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Tabs,
    Tab,
    Grid,
    Paper,
    CircularProgress,
    Chip,
    Divider
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { mockService } from '../services/mockService';
import type { Project, ProjectRole, ProjectAssignment, User } from '../types/models';
import ProjectStatusChip from '../components/ProjectStatusChip';
import RoleCard from '../components/RoleCard';
import AssignmentCard from '../components/AssignmentCard';
import CreateProjectModal from '../components/CreateProjectModal';
import CreateRoleModal from '../components/CreateRoleModal';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
};

const ProjectDetailPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [project, setProject] = useState<Project | null>(null);
    const [roles, setRoles] = useState<ProjectRole[]>([]);
    const [assignments, setAssignments] = useState<ProjectAssignment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [roleModalOpen, setRoleModalOpen] = useState(false);

    useEffect(() => {
        if (projectId) {
            loadData();
        }
    }, [projectId]);

    const loadData = async () => {
        if (!projectId) return;

        try {
            setLoading(true);
            const [projectData, rolesData, assignmentsData] = await Promise.all([
                mockService.getProject(projectId),
                mockService.getProjectRoles(projectId),
                mockService.getProjectAssignments(projectId)
            ]);

            setProject(projectData);
            setRoles(rolesData);
            setAssignments(assignmentsData);

            // Load user data for assignments
            const uniqueUserIds = [...new Set(assignmentsData.map(a => a.userId))];
            const usersData = await Promise.all(
                uniqueUserIds.map(id => mockService.getUserProfile(`user${id}@example.com`))
            );
            setUsers(usersData);
        } catch (error) {
            console.error('Error loading project:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProject = async (updatedProject: Omit<Project, 'id'>) => {
        if (project) {
            try {
                await mockService.updateProject({ ...updatedProject, id: project.id });
                await loadData();
            } catch (error) {
                console.error('Error updating project:', error);
            }
        }
    };

    const handleCreateRole = async (role: Omit<ProjectRole, 'id'>) => {
        try {
            await mockService.createProjectRole(role);
            await loadData();
        } catch (error) {
            console.error('Error creating role:', error);
        }
    };

    const handleDeleteAssignment = async (assignmentId: string) => {
        try {
            await mockService.deleteAssignment(assignmentId);
            await loadData();
        } catch (error) {
            console.error('Error deleting assignment:', error);
        }
    };

    const getRoleAssignments = (roleId: string) => {
        return assignments.filter(a => a.roleId === roleId && a.status === 'Active');
    };

    const getStaffingStats = () => {
        const totalRoles = roles.reduce((sum, role) => sum + role.count, 0);
        const filledRoles = assignments.filter(a => a.status === 'Active').length;
        const avgUtilization = assignments.length > 0
            ? assignments.reduce((sum, a) => sum + a.allocationPercent, 0) / assignments.length
            : 0;

        return { totalRoles, filledRoles, avgUtilization };
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!project) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                    Project not found
                </Typography>
                <Button onClick={() => navigate('/projects')} sx={{ mt: 2 }}>
                    Back to Projects
                </Button>
            </Box>
        );
    }

    const stats = getStaffingStats();

    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/projects')}
                sx={{ mb: 2 }}
            >
                Back to Projects
            </Button>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {project.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            {project.clientName} • {project.projectCode}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <ProjectStatusChip status={project.status} />
                        <Button
                            startIcon={<EditIcon />}
                            onClick={() => setEditModalOpen(true)}
                        >
                            Edit
                        </Button>
                    </Box>
                </Box>

                <Typography variant="body1" paragraph>
                    {project.description}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                    {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                </Typography>
            </Paper>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                    <Tab label="Overview" />
                    <Tab label="Team & Staffing" />
                    <Tab label="Skills Matrix" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" color="primary.main">
                                {stats.filledRoles}/{stats.totalRoles}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Roles Filled
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" color="success.main">
                                {stats.avgUtilization.toFixed(0)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Avg Team Utilization
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" color="secondary.main">
                                {assignments.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Team Members
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                            Assigned Team ({assignments.filter(a => a.status === 'Active').length})
                        </Typography>
                    </Box>
                    <Grid container spacing={2}>
                        {assignments.filter(a => a.status === 'Active').map((assignment) => {
                            const user = users.find(u => u.id === assignment.userId);
                            if (!user) return null;
                            return (
                                <Grid item xs={12} md={6} key={assignment.id}>
                                    <AssignmentCard
                                        assignment={assignment}
                                        user={user}
                                        onRemove={() => handleDeleteAssignment(assignment.id)}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                    {assignments.filter(a => a.status === 'Active').length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                            No team members assigned yet
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                            Open Roles ({roles.length})
                        </Typography>
                        <Button
                            startIcon={<AddIcon />}
                            variant="contained"
                            onClick={() => setRoleModalOpen(true)}
                        >
                            Add Role
                        </Button>
                    </Box>
                    <Grid container spacing={2}>
                        {roles.map((role) => {
                            const roleAssignments = getRoleAssignments(role.id);
                            return (
                                <Grid item xs={12} md={6} key={role.id}>
                                    <RoleCard
                                        role={role}
                                        isFilled={roleAssignments.length >= role.count}
                                        assignedCount={roleAssignments.length}
                                        onFillRole={() => {
                                            // TODO: Open assignment modal
                                            alert('Assignment modal coming soon!');
                                        }}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                    {roles.length === 0 && (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                No roles defined yet
                            </Typography>
                            <Button
                                startIcon={<AddIcon />}
                                variant="contained"
                                onClick={() => setRoleModalOpen(true)}
                                sx={{ mt: 2 }}
                            >
                                Define First Role
                            </Button>
                        </Paper>
                    )}
                </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Skills Matrix
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Skills matrix heatmap visualization coming soon
                    </Typography>
                </Paper>
            </TabPanel>

            <CreateProjectModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={handleUpdateProject}
                initialProject={project}
            />

            <CreateRoleModal
                open={roleModalOpen}
                onClose={() => setRoleModalOpen(false)}
                onSave={handleCreateRole}
                projectId={project.id}
            />
        </Box>
    );
};

export default ProjectDetailPage;
