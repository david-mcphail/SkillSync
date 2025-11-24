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
import type { Project, ProjectRole, ProjectAssignment, User, SOW, ChangeRequest, Risk, Dependency, SupportingDocument } from '../types/models';
import SOWCard from '../components/SOWCard';
import ChangeRequestCard from '../components/ChangeRequestCard';
import RiskCard from '../components/RiskCard';
import DependencyCard from '../components/DependencyCard';
import DocumentCard from '../components/DocumentCard';
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
    const [sows, setSOWs] = useState<SOW[]>([]);
    const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
    const [risks, setRisks] = useState<Risk[]>([]);
    const [dependencies, setDependencies] = useState<Dependency[]>([]);
    const [documents, setDocuments] = useState<SupportingDocument[]>([]);
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
            const [projectData, rolesData, assignmentsData, sowsData, changeRequestsData, risksData, dependenciesData, documentsData] = await Promise.all([
                mockService.getProject(projectId),
                mockService.getProjectRoles(projectId),
                mockService.getProjectAssignments(projectId),
                mockService.getProjectSOWs(projectId),
                mockService.getProjectChangeRequests(projectId),
                mockService.getProjectRisks(projectId),
                mockService.getProjectDependencies(projectId),
                mockService.getProjectDocuments(projectId)
            ]);

            setProject(projectData);
            setRoles(rolesData);
            setAssignments(assignmentsData);
            setSOWs(sowsData);
            setChangeRequests(changeRequestsData);
            setRisks(risksData);
            setDependencies(dependenciesData);
            setDocuments(documentsData);

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

    const getProjectHealth = () => {
        // Team Health
        const teamHealth = stats.filledRoles >= stats.totalRoles ? 'good' :
            stats.filledRoles >= stats.totalRoles * 0.7 ? 'warning' : 'critical';

        // Contract Health
        const activeSOWs = sows.filter(s => s.status === 'Active').length;
        const pendingCRs = changeRequests.filter(cr => cr.status === 'Under Review' || cr.status === 'Submitted').length;
        const contractHealth = activeSOWs > 0 && pendingCRs < 3 ? 'good' :
            activeSOWs > 0 ? 'warning' : 'critical';

        // Risk Health
        const criticalRisks = risks.filter(r => r.severity === 'Critical' && r.status !== 'Closed').length;
        const highRisks = risks.filter(r => r.severity === 'High' && r.status !== 'Closed').length;
        const riskHealth = criticalRisks === 0 && highRisks === 0 ? 'good' :
            criticalRisks === 0 && highRisks <= 2 ? 'warning' : 'critical';

        // Dependency Health
        const blockedDeps = dependencies.filter(d => d.status === 'Blocked').length;
        const overdueDeps = dependencies.filter(d =>
            d.status !== 'Resolved' && new Date(d.requiredDate) < new Date()
        ).length;
        const dependencyHealth = blockedDeps === 0 && overdueDeps === 0 ? 'good' :
            blockedDeps === 0 || overdueDeps <= 1 ? 'warning' : 'critical';

        // Document Health
        const approvedDocs = documents.filter(d => d.status === 'Approved').length;
        const documentHealth = approvedDocs >= 3 ? 'good' :
            approvedDocs >= 1 ? 'warning' : 'critical';

        // Overall Health
        const healthScores = [teamHealth, contractHealth, riskHealth, dependencyHealth, documentHealth];
        const criticalCount = healthScores.filter(h => h === 'critical').length;
        const warningCount = healthScores.filter(h => h === 'warning').length;

        const overallHealth = criticalCount > 0 ? 'critical' :
            warningCount > 2 ? 'warning' : 'good';

        return {
            overall: overallHealth,
            team: teamHealth,
            contracts: contractHealth,
            risks: riskHealth,
            dependencies: dependencyHealth,
            documents: documentHealth
        };
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
                    <Tab label="Contracts" />
                    <Tab label="Risks" />
                    <Tab label="Dependencies" />
                    <Tab label="Supporting Documents" />
                    <Tab label="Skills Matrix" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                {/* Project Health Overview */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Project Health Check
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={2}>
                            <Paper sx={{
                                p: 2,
                                textAlign: 'center',
                                bgcolor: getProjectHealth().overall === 'good' ? 'success.50' :
                                    getProjectHealth().overall === 'warning' ? 'warning.50' : 'error.50',
                                border: 2,
                                borderColor: getProjectHealth().overall === 'good' ? 'success.main' :
                                    getProjectHealth().overall === 'warning' ? 'warning.main' : 'error.main'
                            }}>
                                <Typography variant="h4">
                                    {getProjectHealth().overall === 'good' ? '✓' :
                                        getProjectHealth().overall === 'warning' ? '⚠' : '✗'}
                                </Typography>
                                <Typography variant="caption" fontWeight="bold">
                                    Overall
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Paper sx={{
                                p: 2,
                                textAlign: 'center',
                                bgcolor: getProjectHealth().team === 'good' ? 'success.50' :
                                    getProjectHealth().team === 'warning' ? 'warning.50' : 'error.50'
                            }}>
                                <Typography variant="body2" fontWeight="bold">
                                    Team
                                </Typography>
                                <Typography variant="caption">
                                    {stats.filledRoles}/{stats.totalRoles} filled
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Paper sx={{
                                p: 2,
                                textAlign: 'center',
                                bgcolor: getProjectHealth().contracts === 'good' ? 'success.50' :
                                    getProjectHealth().contracts === 'warning' ? 'warning.50' : 'error.50'
                            }}>
                                <Typography variant="body2" fontWeight="bold">
                                    Contracts
                                </Typography>
                                <Typography variant="caption">
                                    {sows.filter(s => s.status === 'Active').length} active SOWs
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Paper sx={{
                                p: 2,
                                textAlign: 'center',
                                bgcolor: getProjectHealth().risks === 'good' ? 'success.50' :
                                    getProjectHealth().risks === 'warning' ? 'warning.50' : 'error.50'
                            }}>
                                <Typography variant="body2" fontWeight="bold">
                                    Risks
                                </Typography>
                                <Typography variant="caption">
                                    {risks.filter(r => r.severity === 'Critical' && r.status !== 'Closed').length} critical
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Paper sx={{
                                p: 2,
                                textAlign: 'center',
                                bgcolor: getProjectHealth().dependencies === 'good' ? 'success.50' :
                                    getProjectHealth().dependencies === 'warning' ? 'warning.50' : 'error.50'
                            }}>
                                <Typography variant="body2" fontWeight="bold">
                                    Dependencies
                                </Typography>
                                <Typography variant="caption">
                                    {dependencies.filter(d => d.status === 'Blocked').length} blocked
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Paper sx={{
                                p: 2,
                                textAlign: 'center',
                                bgcolor: getProjectHealth().documents === 'good' ? 'success.50' :
                                    getProjectHealth().documents === 'warning' ? 'warning.50' : 'error.50'
                            }}>
                                <Typography variant="body2" fontWeight="bold">
                                    Documents
                                </Typography>
                                <Typography variant="caption">
                                    {documents.filter(d => d.status === 'Approved').length} approved
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Key Metrics */}
                <Typography variant="h6" gutterBottom>
                    Key Metrics
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" color="primary.main">
                                {stats.filledRoles}/{stats.totalRoles}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Roles Filled
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" color="success.main">
                                {stats.avgUtilization.toFixed(0)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Avg Team Utilization
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" color="secondary.main">
                                {assignments.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Team Members
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" color="info.main">
                                {sows.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total SOWs
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Critical Items */}
                <Typography variant="h6" gutterBottom>
                    Items Requiring Attention
                </Typography>
                <Grid container spacing={2}>
                    {risks.filter(r => r.severity === 'Critical' && r.status !== 'Closed').length > 0 && (
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, bgcolor: 'error.50', borderLeft: 4, borderColor: 'error.main' }}>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Critical Risks ({risks.filter(r => r.severity === 'Critical' && r.status !== 'Closed').length})
                                </Typography>
                                {risks.filter(r => r.severity === 'Critical' && r.status !== 'Closed').map(risk => (
                                    <Typography key={risk.id} variant="body2" sx={{ mb: 0.5 }}>
                                        • {risk.title}
                                    </Typography>
                                ))}
                            </Paper>
                        </Grid>
                    )}
                    {dependencies.filter(d => d.status === 'Blocked').length > 0 && (
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, bgcolor: 'warning.50', borderLeft: 4, borderColor: 'warning.main' }}>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Blocked Dependencies ({dependencies.filter(d => d.status === 'Blocked').length})
                                </Typography>
                                {dependencies.filter(d => d.status === 'Blocked').map(dep => (
                                    <Typography key={dep.id} variant="body2" sx={{ mb: 0.5 }}>
                                        • {dep.title}
                                    </Typography>
                                ))}
                            </Paper>
                        </Grid>
                    )}
                    {changeRequests.filter(cr => cr.status === 'Under Review').length > 0 && (
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, bgcolor: 'info.50', borderLeft: 4, borderColor: 'info.main' }}>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Pending Change Requests ({changeRequests.filter(cr => cr.status === 'Under Review').length})
                                </Typography>
                                {changeRequests.filter(cr => cr.status === 'Under Review').map(cr => (
                                    <Typography key={cr.id} variant="body2" sx={{ mb: 0.5 }}>
                                        • {cr.title}
                                    </Typography>
                                ))}
                            </Paper>
                        </Grid>
                    )}
                    {risks.filter(r => r.severity === 'Critical' && r.status !== 'Closed').length === 0 &&
                        dependencies.filter(d => d.status === 'Blocked').length === 0 &&
                        changeRequests.filter(cr => cr.status === 'Under Review').length === 0 && (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.50' }}>
                                    <Typography variant="body1" color="success.dark">
                                        ✓ No critical items requiring immediate attention
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* 30/60/90 Day Outlook */}
                <Typography variant="h6" gutterBottom>
                    30/60/90 Day Outlook
                </Typography>
                <Grid container spacing={2}>
                    {/* Next 30 Days */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, height: '100%', bgcolor: 'info.50', borderTop: 3, borderColor: 'info.main' }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="info.dark">
                                Next 30 Days
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                {/* SOW Milestones */}
                                {sows.flatMap(sow =>
                                    sow.milestones
                                        .filter(m => {
                                            const dueDate = new Date(m.dueDate);
                                            const today = new Date();
                                            const thirtyDays = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                                            return dueDate >= today && dueDate <= thirtyDays && !m.completed;
                                        })
                                        .map(m => ({
                                            type: 'Milestone',
                                            title: m.name,
                                            date: m.dueDate,
                                            sow: sow.title
                                        }))
                                ).slice(0, 3).map((item, idx) => (
                                    <Box key={idx} sx={{ mb: 1.5, pb: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {new Date(item.date).toLocaleDateString()} • {item.type}
                                        </Typography>
                                        <Typography variant="body2" fontWeight="medium">
                                            {item.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.sow}
                                        </Typography>
                                    </Box>
                                ))}
                                {/* Assignment Rolloffs */}
                                {assignments
                                    .filter(a => {
                                        const endDate = new Date(a.endDate);
                                        const today = new Date();
                                        const thirtyDays = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                                        return endDate >= today && endDate <= thirtyDays && a.status === 'Active';
                                    })
                                    .slice(0, 2)
                                    .map(assignment => {
                                        const user = users.find(u => u.id === assignment.userId);
                                        return (
                                            <Box key={assignment.id} sx={{ mb: 1.5, pb: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {new Date(assignment.endDate).toLocaleDateString()} • Rolloff
                                                </Typography>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {user?.name || 'Team Member'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {assignment.allocationPercent}% allocation ending
                                                </Typography>
                                            </Box>
                                        );
                                    })
                                }
                                {sows.flatMap(sow => sow.milestones.filter(m => {
                                    const dueDate = new Date(m.dueDate);
                                    const today = new Date();
                                    const thirtyDays = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                                    return dueDate >= today && dueDate <= thirtyDays && !m.completed;
                                })).length === 0 && assignments.filter(a => {
                                    const endDate = new Date(a.endDate);
                                    const today = new Date();
                                    const thirtyDays = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                                    return endDate >= today && endDate <= thirtyDays && a.status === 'Active';
                                }).length === 0 && (
                                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                            No upcoming events
                                        </Typography>
                                    )}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* 31-60 Days */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, height: '100%', bgcolor: 'warning.50', borderTop: 3, borderColor: 'warning.main' }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="warning.dark">
                                31-60 Days
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                {sows.flatMap(sow =>
                                    sow.milestones
                                        .filter(m => {
                                            const dueDate = new Date(m.dueDate);
                                            const today = new Date();
                                            const thirtyOneDays = new Date(today.getTime() + 31 * 24 * 60 * 60 * 1000);
                                            const sixtyDays = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
                                            return dueDate >= thirtyOneDays && dueDate <= sixtyDays && !m.completed;
                                        })
                                        .map(m => ({
                                            type: 'Milestone',
                                            title: m.name,
                                            date: m.dueDate,
                                            sow: sow.title
                                        }))
                                ).slice(0, 3).map((item, idx) => (
                                    <Box key={idx} sx={{ mb: 1.5, pb: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {new Date(item.date).toLocaleDateString()} • {item.type}
                                        </Typography>
                                        <Typography variant="body2" fontWeight="medium">
                                            {item.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.sow}
                                        </Typography>
                                    </Box>
                                ))}
                                {assignments
                                    .filter(a => {
                                        const endDate = new Date(a.endDate);
                                        const today = new Date();
                                        const thirtyOneDays = new Date(today.getTime() + 31 * 24 * 60 * 60 * 1000);
                                        const sixtyDays = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
                                        return endDate >= thirtyOneDays && endDate <= sixtyDays && a.status === 'Active';
                                    })
                                    .slice(0, 2)
                                    .map(assignment => {
                                        const user = users.find(u => u.id === assignment.userId);
                                        return (
                                            <Box key={assignment.id} sx={{ mb: 1.5, pb: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {new Date(assignment.endDate).toLocaleDateString()} • Rolloff
                                                </Typography>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {user?.name || 'Team Member'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {assignment.allocationPercent}% allocation ending
                                                </Typography>
                                            </Box>
                                        );
                                    })
                                }
                                {sows.flatMap(sow => sow.milestones.filter(m => {
                                    const dueDate = new Date(m.dueDate);
                                    const today = new Date();
                                    const thirtyOneDays = new Date(today.getTime() + 31 * 24 * 60 * 60 * 1000);
                                    const sixtyDays = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
                                    return dueDate >= thirtyOneDays && dueDate <= sixtyDays && !m.completed;
                                })).length === 0 && assignments.filter(a => {
                                    const endDate = new Date(a.endDate);
                                    const today = new Date();
                                    const thirtyOneDays = new Date(today.getTime() + 31 * 24 * 60 * 60 * 1000);
                                    const sixtyDays = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
                                    return endDate >= thirtyOneDays && endDate <= sixtyDays && a.status === 'Active';
                                }).length === 0 && (
                                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                            No upcoming events
                                        </Typography>
                                    )}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* 61-90 Days */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, height: '100%', bgcolor: 'success.50', borderTop: 3, borderColor: 'success.main' }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="success.dark">
                                61-90 Days
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                {sows.flatMap(sow =>
                                    sow.milestones
                                        .filter(m => {
                                            const dueDate = new Date(m.dueDate);
                                            const today = new Date();
                                            const sixtyOneDays = new Date(today.getTime() + 61 * 24 * 60 * 60 * 1000);
                                            const ninetyDays = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
                                            return dueDate >= sixtyOneDays && dueDate <= ninetyDays && !m.completed;
                                        })
                                        .map(m => ({
                                            type: 'Milestone',
                                            title: m.name,
                                            date: m.dueDate,
                                            sow: sow.title
                                        }))
                                ).slice(0, 3).map((item, idx) => (
                                    <Box key={idx} sx={{ mb: 1.5, pb: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {new Date(item.date).toLocaleDateString()} • {item.type}
                                        </Typography>
                                        <Typography variant="body2" fontWeight="medium">
                                            {item.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.sow}
                                        </Typography>
                                    </Box>
                                ))}
                                {assignments
                                    .filter(a => {
                                        const endDate = new Date(a.endDate);
                                        const today = new Date();
                                        const sixtyOneDays = new Date(today.getTime() + 61 * 24 * 60 * 60 * 1000);
                                        const ninetyDays = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
                                        return endDate >= sixtyOneDays && endDate <= ninetyDays && a.status === 'Active';
                                    })
                                    .slice(0, 2)
                                    .map(assignment => {
                                        const user = users.find(u => u.id === assignment.userId);
                                        return (
                                            <Box key={assignment.id} sx={{ mb: 1.5, pb: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {new Date(assignment.endDate).toLocaleDateString()} • Rolloff
                                                </Typography>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {user?.name || 'Team Member'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {assignment.allocationPercent}% allocation ending
                                                </Typography>
                                            </Box>
                                        );
                                    })
                                }
                                {sows.flatMap(sow => sow.milestones.filter(m => {
                                    const dueDate = new Date(m.dueDate);
                                    const today = new Date();
                                    const sixtyOneDays = new Date(today.getTime() + 61 * 24 * 60 * 60 * 1000);
                                    const ninetyDays = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
                                    return dueDate >= sixtyOneDays && dueDate <= ninetyDays && !m.completed;
                                })).length === 0 && assignments.filter(a => {
                                    const endDate = new Date(a.endDate);
                                    const today = new Date();
                                    const sixtyOneDays = new Date(today.getTime() + 61 * 24 * 60 * 60 * 1000);
                                    const ninetyDays = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
                                    return endDate >= sixtyOneDays && endDate <= ninetyDays && a.status === 'Active';
                                }).length === 0 && (
                                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                            No upcoming events
                                        </Typography>
                                    )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </TabPanel >

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
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Statements of Work ({sows.length})
                    </Typography>
                    <Grid container spacing={2}>
                        {sows.map((sow) => (
                            <Grid item xs={12} md={6} key={sow.id}>
                                <SOWCard sow={sow} />
                            </Grid>
                        ))}
                    </Grid>
                    {sows.length === 0 && (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                No SOWs defined for this project
                            </Typography>
                        </Paper>
                    )}
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box>
                    <Typography variant="h6" gutterBottom>
                        Change Requests ({changeRequests.length})
                    </Typography>
                    <Grid container spacing={2}>
                        {changeRequests.map((cr) => (
                            <Grid item xs={12} md={6} key={cr.id}>
                                <ChangeRequestCard changeRequest={cr} />
                            </Grid>
                        ))}
                    </Grid>
                    {changeRequests.length === 0 && (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                No change requests for this project
                            </Typography>
                        </Paper>
                    )}
                </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
                <Typography variant="h6" gutterBottom>
                    Project Risks ({risks.length})
                </Typography>
                <Grid container spacing={2}>
                    {risks.map((risk) => (
                        <Grid item xs={12} md={6} key={risk.id}>
                            <RiskCard risk={risk} />
                        </Grid>
                    ))}
                </Grid>
                {risks.length === 0 && (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No risks identified for this project
                        </Typography>
                    </Paper>
                )}
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
                <Typography variant="h6" gutterBottom>
                    Project Dependencies ({dependencies.length})
                </Typography>
                <Grid container spacing={2}>
                    {dependencies.map((dependency) => (
                        <Grid item xs={12} md={6} key={dependency.id}>
                            <DependencyCard dependency={dependency} />
                        </Grid>
                    ))}
                </Grid>
                {dependencies.length === 0 && (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No dependencies defined for this project
                        </Typography>
                    </Paper>
                )}
            </TabPanel>

            <TabPanel value={tabValue} index={5}>
                <Typography variant="h6" gutterBottom>
                    Supporting Documents ({documents.length})
                </Typography>
                <Grid container spacing={2}>
                    {documents.map((document) => (
                        <Grid item xs={12} md={6} key={document.id}>
                            <DocumentCard document={document} />
                        </Grid>
                    ))}
                </Grid>
                {documents.length === 0 && (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No documents uploaded for this project
                        </Typography>
                    </Paper>
                )}
            </TabPanel>

            <TabPanel value={tabValue} index={6}>
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
        </Box >
    );
};

export default ProjectDetailPage;
