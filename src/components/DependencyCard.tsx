import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { Link as LinkIcon, Block as BlockIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import type { Dependency } from '../types/models';

interface DependencyCardProps {
    dependency: Dependency;
}

const DependencyCard: React.FC<DependencyCardProps> = ({ dependency }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Resolved': return 'success';
            case 'In Progress': return 'info';
            case 'Blocked': return 'error';
            case 'Cancelled': return 'default';
            case 'Pending': return 'warning';
            default: return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Resolved': return <CheckCircleIcon fontSize="small" />;
            case 'Blocked': return <BlockIcon fontSize="small" />;
            default: return <LinkIcon fontSize="small" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'External': return 'warning';
            case 'Internal': return 'info';
            case 'Technical': return 'secondary';
            case 'Resource': return 'primary';
            case 'Vendor': return 'error';
            default: return 'default';
        }
    };

    const isOverdue = dependency.requiredDate && new Date(dependency.requiredDate) < new Date() && dependency.status !== 'Resolved';

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderLeft: isOverdue ? '4px solid' : 'none', borderColor: 'error.main' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(dependency.status)}
                        <Typography variant="h6" component="div">
                            {dependency.title}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                        label={dependency.status}
                        color={getStatusColor(dependency.status) as any}
                        size="small"
                    />
                    <Chip
                        label={dependency.type}
                        color={getTypeColor(dependency.type) as any}
                        size="small"
                        variant="outlined"
                    />
                    {isOverdue && (
                        <Chip
                            label="Overdue"
                            color="error"
                            size="small"
                        />
                    )}
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                    {dependency.description}
                </Typography>

                <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Depends On
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                        {dependency.dependsOn}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        Dependent Party
                    </Typography>
                    <Typography variant="body2">
                        {dependency.dependentParty}
                    </Typography>
                </Box>

                <Box sx={{ bgcolor: 'warning.50', p: 1.5, borderRadius: 1, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Impact if Not Met
                    </Typography>
                    <Typography variant="body2">
                        {dependency.impact}
                    </Typography>
                </Box>

                {dependency.notes && (
                    <Box sx={{ bgcolor: 'info.50', p: 1.5, borderRadius: 1, mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            Notes
                        </Typography>
                        <Typography variant="body2">
                            {dependency.notes}
                        </Typography>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Owner
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                            {dependency.owner}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Required Date
                        </Typography>
                        <Typography variant="body2" color={isOverdue ? 'error.main' : 'text.primary'} fontWeight={isOverdue ? 'bold' : 'normal'}>
                            {new Date(dependency.requiredDate).toLocaleDateString()}
                        </Typography>
                        {dependency.expectedDate && (
                            <>
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                    Expected: {new Date(dependency.expectedDate).toLocaleDateString()}
                                </Typography>
                            </>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default DependencyCard;
