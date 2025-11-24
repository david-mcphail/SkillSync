import { Card, CardContent, Typography, Chip, Box, LinearProgress } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import type { Risk } from '../types/models';

interface RiskCardProps {
    risk: Risk;
}

const RiskCard: React.FC<RiskCardProps> = ({ risk }) => {
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'error';
            case 'High': return 'warning';
            case 'Medium': return 'info';
            case 'Low': return 'success';
            default: return 'default';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Closed': return 'success';
            case 'Mitigating': return 'warning';
            case 'Monitoring': return 'info';
            case 'Analyzing': return 'default';
            default: return 'default';
        }
    };

    const getProbabilityValue = (probability: string) => {
        switch (probability) {
            case 'Very High': return 90;
            case 'High': return 70;
            case 'Medium': return 50;
            case 'Low': return 30;
            case 'Very Low': return 10;
            default: return 0;
        }
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningIcon color={getSeverityColor(risk.severity) as any} />
                        <Typography variant="h6" component="div">
                            {risk.title}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                        label={risk.severity}
                        color={getSeverityColor(risk.severity) as any}
                        size="small"
                    />
                    <Chip
                        label={risk.status}
                        color={getStatusColor(risk.status) as any}
                        size="small"
                        variant="outlined"
                    />
                    <Chip
                        label={risk.category}
                        size="small"
                        variant="outlined"
                    />
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                    {risk.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                            Probability
                        </Typography>
                        <Typography variant="caption" fontWeight="bold">
                            {risk.probability}
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={getProbabilityValue(risk.probability)}
                        color={getSeverityColor(risk.severity) as any}
                    />
                </Box>

                <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Impact
                    </Typography>
                    <Typography variant="body2">
                        {risk.impact}
                    </Typography>
                </Box>

                <Box sx={{ bgcolor: 'success.50', p: 1.5, borderRadius: 1, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Mitigation Plan
                    </Typography>
                    <Typography variant="body2">
                        {risk.mitigationPlan}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Owner
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                            {risk.owner}
                        </Typography>
                    </Box>
                    {risk.targetResolutionDate && (
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                                Target Resolution
                            </Typography>
                            <Typography variant="body2">
                                {new Date(risk.targetResolutionDate).toLocaleDateString()}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default RiskCard;
