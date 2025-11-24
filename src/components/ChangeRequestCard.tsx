import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import type { ChangeRequest } from '../types/models';

interface ChangeRequestCardProps {
    changeRequest: ChangeRequest;
    onClick?: () => void;
}

const ChangeRequestCard: React.FC<ChangeRequestCardProps> = ({ changeRequest, onClick }) => {
    const getStatusColor = (): 'default' | 'primary' | 'success' | 'warning' | 'error' => {
        switch (changeRequest.status) {
            case 'Approved': return 'success';
            case 'Under Review': return 'warning';
            case 'Submitted': return 'primary';
            case 'Rejected': return 'error';
            case 'Implemented': return 'default';
            default: return 'default';
        }
    };

    const getTypeColor = (): 'default' | 'primary' | 'secondary' | 'info' => {
        switch (changeRequest.type) {
            case 'Scope Change': return 'primary';
            case 'Budget Adjustment': return 'secondary';
            case 'Timeline Extension': return 'info';
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography variant="h6" component="div">
                        {changeRequest.title}
                    </Typography>
                    <Chip label={changeRequest.status} color={getStatusColor()} size="small" />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Chip
                        label={changeRequest.type}
                        color={getTypeColor()}
                        size="small"
                        variant="outlined"
                    />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {changeRequest.description}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ mb: 1.5 }}>
                    <Typography variant="caption" fontWeight="medium" color="text.secondary">
                        Business Justification:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {changeRequest.businessJustification}
                    </Typography>
                </Box>

                {changeRequest.impactAnalysis && (
                    <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" fontWeight="medium" color="text.secondary" gutterBottom>
                            Impact Analysis:
                        </Typography>
                        <List dense sx={{ pt: 0.5 }}>
                            {changeRequest.impactAnalysis.scope && (
                                <ListItem sx={{ py: 0.25, px: 0 }}>
                                    <ListItemText
                                        primary={`Scope: ${changeRequest.impactAnalysis.scope}`}
                                        primaryTypographyProps={{ variant: 'caption' }}
                                    />
                                </ListItem>
                            )}
                            {changeRequest.impactAnalysis.timeline && (
                                <ListItem sx={{ py: 0.25, px: 0 }}>
                                    <ListItemText
                                        primary={`Timeline: ${changeRequest.impactAnalysis.timeline}`}
                                        primaryTypographyProps={{ variant: 'caption' }}
                                    />
                                </ListItem>
                            )}
                            {changeRequest.impactAnalysis.budget !== undefined && changeRequest.impactAnalysis.budget !== 0 && (
                                <ListItem sx={{ py: 0.25, px: 0 }}>
                                    <ListItemText
                                        primary={`Budget: $${changeRequest.impactAnalysis.budget.toLocaleString()}`}
                                        primaryTypographyProps={{ variant: 'caption', color: 'primary.main', fontWeight: 'medium' }}
                                    />
                                </ListItem>
                            )}
                            {changeRequest.impactAnalysis.resources && (
                                <ListItem sx={{ py: 0.25, px: 0 }}>
                                    <ListItemText
                                        primary={`Resources: ${changeRequest.impactAnalysis.resources}`}
                                        primaryTypographyProps={{ variant: 'caption' }}
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        Requested by: {changeRequest.requestedBy}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {new Date(changeRequest.requestedDate).toLocaleDateString()}
                    </Typography>
                </Box>

                {changeRequest.comments && changeRequest.comments.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                        <Chip
                            label={`${changeRequest.comments.length} comment${changeRequest.comments.length > 1 ? 's' : ''}`}
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ChangeRequestCard;
