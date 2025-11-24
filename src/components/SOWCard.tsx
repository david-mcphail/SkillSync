import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    LinearProgress,
    Divider,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import type { SOW } from '../types/models';

interface SOWCardProps {
    sow: SOW;
    onClick?: () => void;
}

const SOWCard: React.FC<SOWCardProps> = ({ sow, onClick }) => {
    const completedMilestones = sow.milestones.filter(m => m.completed).length;
    const totalMilestones = sow.milestones.length;
    const progress = (completedMilestones / totalMilestones) * 100;

    const getStatusColor = (): 'default' | 'primary' | 'success' | 'warning' | 'error' => {
        switch (sow.status) {
            case 'Active': return 'success';
            case 'Approved': return 'primary';
            case 'Completed': return 'default';
            case 'Under Review': return 'warning';
            default: return 'default';
        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                '&:hover': {
                    boxShadow: onClick ? 4 : undefined,
                    cursor: onClick ? 'pointer' : 'default'
                }
            }}
            onClick={onClick}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                            {sow.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Version {sow.version}
                        </Typography>
                    </Box>
                    <Chip label={sow.status} color={getStatusColor()} size="small" />
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        {sow.scope}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                        Total Value:
                    </Typography>
                    <Typography variant="body2" color="primary.main" fontWeight="bold">
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: sow.currency
                        }).format(sow.totalValue)}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        {new Date(sow.startDate).toLocaleDateString()} - {new Date(sow.endDate).toLocaleDateString()}
                    </Typography>
                </Box>

                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                            Milestones
                        </Typography>
                        <Typography variant="caption" fontWeight="medium">
                            {completedMilestones}/{totalMilestones} completed
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        color={progress === 100 ? 'success' : 'primary'}
                        sx={{ height: 6, borderRadius: 1 }}
                    />
                </Box>

                {sow.deliverables && sow.deliverables.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                            Key Deliverables:
                        </Typography>
                        <List dense sx={{ pt: 0.5 }}>
                            {sow.deliverables.slice(0, 3).map((deliverable, index) => (
                                <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
                                    <CheckCircleIcon sx={{ fontSize: 14, mr: 0.5, color: 'success.main' }} />
                                    <ListItemText
                                        primary={deliverable}
                                        primaryTypographyProps={{ variant: 'caption' }}
                                    />
                                </ListItem>
                            ))}
                            {sow.deliverables.length > 3 && (
                                <Typography variant="caption" color="text.secondary" sx={{ pl: 2.5 }}>
                                    +{sow.deliverables.length - 3} more
                                </Typography>
                            )}
                        </List>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default SOWCard;
