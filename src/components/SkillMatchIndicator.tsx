import React from 'react';
import { Box, CircularProgress, Typography, Tooltip, Chip } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import type { SkillRequirement } from '../types/models';

interface SkillMatchIndicatorProps {
    matchPercentage: number;
    missingSkills?: SkillRequirement[];
}

const SkillMatchIndicator: React.FC<SkillMatchIndicatorProps> = ({
    matchPercentage,
    missingSkills = []
}) => {
    const getColor = (): 'success' | 'warning' | 'error' => {
        if (matchPercentage >= 80) return 'success';
        if (matchPercentage >= 60) return 'warning';
        return 'error';
    };

    const tooltipContent = (
        <Box>
            <Typography variant="caption" fontWeight="bold">
                Match Score: {matchPercentage.toFixed(0)}%
            </Typography>
            {missingSkills.length > 0 && (
                <Box mt={1}>
                    <Typography variant="caption" fontWeight="bold" display="block">
                        Missing or Insufficient Skills:
                    </Typography>
                    {missingSkills.map((skill, index) => (
                        <Typography key={index} variant="caption" display="block">
                            • {skill.skillName} (Level {skill.minProficiency}+)
                        </Typography>
                    ))}
                </Box>
            )}
        </Box>
    );

    return (
        <Tooltip title={tooltipContent} arrow>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                        variant="determinate"
                        value={matchPercentage}
                        color={getColor()}
                        size={40}
                    />
                    <Box
                        sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="caption" component="div" fontWeight="bold">
                            {matchPercentage.toFixed(0)}%
                        </Typography>
                    </Box>
                </Box>
                {missingSkills.length > 0 && (
                    <Chip
                        icon={<WarningIcon />}
                        label={`${missingSkills.length} gap${missingSkills.length > 1 ? 's' : ''}`}
                        size="small"
                        color={getColor()}
                        variant="outlined"
                    />
                )}
            </Box>
        </Tooltip>
    );
};

export default SkillMatchIndicator;
