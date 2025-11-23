import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, useScrollTrigger, Slide, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
    onDemoClick?: () => void;
    onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDemoClick, onLoginClick }) => {
    const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: trigger ? 'rgba(10,14,23,0.9)' : 'transparent',
                    backdropFilter: trigger ? 'blur(10px)' : 'none',
                    boxShadow: trigger ? 1 : 0,
                    transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
                }}
            >
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold' }}>
                        SkillSync
                    </Typography>
                    <Button color="inherit" onClick={onLoginClick}>
                        Login
                    </Button>
                    <Button variant="contained" color="primary" onClick={onDemoClick} sx={{ ml: 1 }}>
                        Request Demo
                    </Button>
                </Toolbar>
            </AppBar>
        </Slide>
    );
};

export default Header;
