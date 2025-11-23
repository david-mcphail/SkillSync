import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    IconButton,
    Chip,
    Divider
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { ProjectAssignment, User } from '../types/models';

interface AssignmentCardProps {
    assignment: ProjectAssignment;
    user: User;
    onEdit?: () => void;
    onRemove?: () => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
    assignment,
    user,
    onEdit,
    onRemove
}) => {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                    <Avatar
                        src={user.avatarUrl}
                        alt={user.name}
                        sx={{ width: 56, height: 56 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <Box>
                                <Typography variant="h6" component="div">
                                    {user.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user.role}
                                </Typography>
                            </Box>
                            <Box>
                                {onEdit && (
                                    <IconButton size="small" onClick={onEdit}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                )}
                                {onRemove && (
                                    <IconButton size="small" onClick={onRemove} color="error">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>
                        </Box>

                        <Divider sx={{ my: 1.5 }} />

                        <Typography variant="subtitle2" gutterBottom>
                            {assignment.roleTitle}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 1 }}>
                            <Chip
                                label={`${assignment.allocationPercent}% allocated`}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                            <Chip
                                label={assignment.bookingType}
                                size="small"
                                color={assignment.bookingType === 'Hard' ? 'success' : 'warning'}
                            />
                            <Chip
                                label={assignment.status}
                                size="small"
                                variant="outlined"
                            />
                        </Box>

                        <Typography variant="caption" color="text.secondary" display="block">
                            {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}
                        </Typography>

                        {assignment.notes && (
                            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                                "{assignment.notes}"
                            </Typography>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default AssignmentCard;
