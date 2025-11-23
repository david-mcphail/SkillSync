import React from 'react';
import { Box, Button, Container, Typography, Grid, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import Header from '../components/layout/Header';
import ParticleNetwork from '../components/landing/ParticleNetwork';
import FeatureCard from '../components/landing/FeatureCard';

const features = [
    {
        icon: <SearchIcon sx={{ fontSize: 60, color: 'secondary.main' }} />,
        title: 'Discoverability',
        description: 'Enable instant search for employees based on specific technical or soft skills.'
    },
    {
        icon: <TrendingUpIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
        title: 'Gap Analysis',
        description: 'Identify organizational skill gaps to inform training budgets and hiring plans.'
    },
    {
        icon: <PeopleIcon sx={{ fontSize: 60, color: 'secondary.main' }} />,
        title: 'Mobility',
        description: 'Facilitate internal mobility by matching employees to projects that fit their capabilities.'
    },
];

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* Global Header */}
            <Header onLoginClick={() => navigate('/login')} onDemoClick={() => navigate('/demo')} />
            {/* Main Content */}
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', pt: 8 }}>
                {/* Hero Section */}
                <Box sx={{ position: 'relative', py: 12, background: 'radial-gradient(circle at 50% 20%, rgba(108, 99, 255, 0.15) 0%, rgba(10, 14, 23, 0) 70%)' }}>
                    <ParticleNetwork />
                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                        <Stack spacing={4} alignItems="center">
                            <Typography variant="h1" component="h1" sx={{ background: 'linear-gradient(45deg, #6C63FF 30%, #00E5FF 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                SkillSync
                            </Typography>
                            <Typography variant="h2" sx={{ color: 'text.secondary', fontSize: '1.5rem', fontWeight: 400, maxWidth: '800px' }}>
                                Democratizing Internal Talent. Map, track, and analyze the skills inventory of your organization.
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Button variant="contained" size="large" onClick={() => navigate('/login')}>
                                    Get Started
                                </Button>
                                <Button variant="outlined" size="large" color="secondary" onClick={() => navigate('/about')}>
                                    Learn More
                                </Button>
                            </Stack>
                        </Stack>
                    </Container>
                </Box>
                {/* Features Section */}
                <Container maxWidth="lg" sx={{ py: 8 }}>
                    <Grid container spacing={4}>
                        {features.map((f, idx) => (
                            <Grid item xs={12} md={4} key={idx}>
                                <FeatureCard icon={f.icon} title={f.title} description={f.description} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default LandingPage;
