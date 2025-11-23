import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

type FeatureCardProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
    return (
        <Card
            sx={{
                height: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)',
                },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                p: 2,
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                {icon}
                <Typography variant="h5" component="h2" sx={{ mt: 2, mb: 1 }}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default FeatureCard;
