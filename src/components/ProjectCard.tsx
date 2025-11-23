import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Button,
    LinearProgress
} from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon } from '@mui/icons-material';
import type { Project } from '../types/models';
import ProjectStatusChip from './ProjectStatusChip';

interface ProjectCardProps {
    project: Project;
    filledRoles?: number;
    totalRoles?: number;
    onClick?: () => void;
    onEdit?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    filledRoles = 0,
    totalRoles = 0,
    onClick,
    onEdit
}) => {
    const staffingPercentage = totalRoles > 0 ? (filledRoles / totalRoles) * 100 : 0;

    return (
        <Card
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.2s ease-in-out',
                '&:hover': {
                    boxShadow: 4,
                    cursor: onClick ? 'pointer' : 'default'
                }
            }}
            onClick={onClick}
        >
            <CardContent sx={{ flexGrow: 1, pb: 2, width: '100%', minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, minWidth: 0 }}>
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                            fontWeight: 600,
                            lineHeight: 1.3,
                            pr: 1,
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word'
                        }}
                    >
                        {project.name}
                    </Typography>
                    <ProjectStatusChip status={project.status} />
                </Box>

                <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 1, fontWeight: 500, wordBreak: 'break-word', overflowWrap: 'break-word' }}
                >
                    {project.clientName}
                </Typography>

                <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2, fontSize: '0.75rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                >
                    {project.projectCode}
                </Typography>

                <Typography 
                    variant="body2" 
                    color="text.primary"
                    sx={{ 
                        mb: 2,
                        minHeight: '2.5rem',
                        maxHeight: '2.5rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto',
                        lineHeight: 1.25,
                        width: '100%'
                    }}
                >
                    {project.description}
                </Typography>

                <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2, fontSize: '0.75rem' }}
                >
                    {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                </Typography>

                <Box sx={{ mt: 'auto', minHeight: '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    {totalRoles > 0 ? (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                    Staffing
                                </Typography>
                                <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                                    {filledRoles}/{totalRoles} roles filled
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={staffingPercentage}
                                color={staffingPercentage === 100 ? 'success' : 'primary'}
                                sx={{ height: 8, borderRadius: 1 }}
                            />
                        </>
                    ) : (
                        <Box sx={{ height: '3.5rem' }} />
                    )}
                </Box>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                {onEdit && (
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                    >
                        Edit
                    </Button>
                )}
                {onClick && (
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<VisibilityIcon />}
                    >
                        View Details
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default ProjectCard;
