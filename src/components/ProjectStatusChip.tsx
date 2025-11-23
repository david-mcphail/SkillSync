import React from 'react';
import { Chip } from '@mui/material';
import type { ProjectStatus } from '../types/models';

interface ProjectStatusChipProps {
    status: ProjectStatus;
}

const ProjectStatusChip: React.FC<ProjectStatusChipProps> = ({ status }) => {
    const getStatusColor = (): 'primary' | 'success' | 'default' | 'warning' => {
        switch (status) {
            case 'Pipeline':
                return 'primary';
            case 'Active':
                return 'success';
            case 'Completed':
                return 'default';
            case 'On Hold':
                return 'warning';
            default:
                return 'default';
        }
    };

    return (
        <Chip
            label={status}
            color={getStatusColor()}
            size="small"
            sx={{ fontWeight: 'medium' }}
        />
    );
};

export default ProjectStatusChip;
