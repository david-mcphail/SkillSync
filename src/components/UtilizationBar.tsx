import React from 'react';
import { Box, LinearProgress, Typography, Tooltip } from '@mui/material';
import type { UserUtilization } from '../types/models';

interface UtilizationBarProps {
    utilization: UserUtilization;
}

const UtilizationBar: React.FC<UtilizationBarProps> = ({ utilization }) => {
    const { totalAllocation, assignments } = utilization;

    const getColor = (): 'success' | 'warning' | 'error' => {
        if (totalAllocation < 80) return 'success';
        if (totalAllocation <= 100) return 'warning';
        return 'error';
    };

    const tooltipContent = (
        <Box>
            <Typography variant="caption" fontWeight="bold">
                Total Allocation: {totalAllocation}%
            </Typography>
            {assignments.length > 0 && (
                <Box mt={1}>
                    {assignments.map((assignment, index) => (
                        <Typography key={index} variant="caption" display="block">
                            • {assignment.projectName}: {assignment.allocation}%
                        </Typography>
                    ))}
                </Box>
            )}
        </Box>
    );

    return (
        <Tooltip title={tooltipContent} arrow>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                        Utilization
                    </Typography>
                    <Typography variant="caption" fontWeight="medium">
                        {totalAllocation}%
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={Math.min(totalAllocation, 100)}
                    color={getColor()}
                    sx={{ height: 8, borderRadius: 1 }}
                />
            </Box>
        </Tooltip>
    );
};

export default UtilizationBar;
