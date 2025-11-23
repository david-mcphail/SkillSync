import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Button,
    Divider
} from '@mui/material';
import { Add as AddIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import type { ProjectRole } from '../types/models';

interface RoleCardProps {
    role: ProjectRole;
    isFilled: boolean;
    assignedCount?: number;
    onFillRole?: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({
    role,
    isFilled,
    assignedCount = 0,
    onFillRole
}) => {
    const remainingPositions = role.count - assignedCount;

    return (
        <Card
            sx={{
                height: '100%',
                border: isFilled ? '1px solid' : '2px dashed',
                borderColor: isFilled ? 'divider' : 'primary.main',
                bgcolor: isFilled ? 'background.paper' : 'action.hover',
                opacity: isFilled ? 1 : 0.9
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6" component="div">
                        {role.roleTitle}
                    </Typography>
                    <Chip
                        label={`${assignedCount}/${role.count}`}
                        size="small"
                        color={assignedCount === role.count ? 'success' : 'default'}
                    />
                </Box>

                {role.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {role.description}
                    </Typography>
                )}

                <Divider sx={{ my: 1.5 }} />

                <Typography variant="subtitle2" gutterBottom>
                    Required Skills:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {role.requiredSkills.map((skill, index) => (
                        <Chip
                            key={index}
                            label={`${skill.skillName} (L${skill.minProficiency}+)`}
                            size="small"
                            variant="outlined"
                        />
                    ))}
                </Box>

                {role.softSkillPreferences && role.softSkillPreferences.length > 0 && (
                    <>
                        <Typography variant="subtitle2" gutterBottom>
                            Preferences:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                            {role.softSkillPreferences.map((pref, index) => (
                                <Chip
                                    key={index}
                                    label={pref}
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    </>
                )}

                {!isFilled && remainingPositions > 0 && onFillRole && (
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={onFillRole}
                        sx={{ mt: 1 }}
                    >
                        Fill Role ({remainingPositions} open)
                    </Button>
                )}

                {isFilled && remainingPositions > 0 && onFillRole && (
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={onFillRole}
                        sx={{ mt: 1 }}
                    >
                        Add More ({remainingPositions} remaining)
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default RoleCard;
