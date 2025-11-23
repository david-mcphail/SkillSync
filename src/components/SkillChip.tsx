import React from 'react';
import { Chip, Rating, Box, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { Skill } from '../types/models';

interface SkillChipProps {
    skill: Skill;
}

const SkillChip: React.FC<SkillChipProps> = ({ skill }) => {
    return (
        <Tooltip title={`Proficiency: ${skill.proficiency}/5 - ${skill.verified ? 'Verified' : 'Unverified'}`}>
            <Chip
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {skill.name}
                        <Rating
                            value={skill.proficiency}
                            readOnly
                            max={5}
                            size="small"
                            sx={{
                                fontSize: '0.8rem',
                                color: 'secondary.main',
                                '& .MuiRating-iconEmpty': { color: 'rgba(255,255,255,0.2)' },
                            }}
                        />
                    </Box>
                }
                icon={skill.verified ? <CheckCircleIcon sx={{ fontSize: '1rem !important' }} /> : undefined}
                variant="outlined"
                sx={{
                    borderColor: skill.verified ? 'primary.main' : 'rgba(255,255,255,0.1)',
                    background: skill.verified ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                    '&:hover': {
                        borderColor: 'secondary.main',
                        background: 'rgba(0, 229, 255, 0.1)',
                    },
                }}
            />
        </Tooltip>
    );
};

export default SkillChip;
