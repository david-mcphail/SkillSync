import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6C63FF', // Vibrant Purple
      light: '#8F88FF',
      dark: '#4B44DB',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00E5FF', // Cyan accent
      light: '#6EFFDD',
      dark: '#00B2CC',
      contrastText: '#000000',
    },
    background: {
      default: '#0A0E17', // Very dark blue/black
      paper: '#141A26', // Slightly lighter for cards
    },
    text: {
      primary: '#F3F4F6',
      secondary: '#9CA3AF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      background: 'linear-gradient(45deg, #6C63FF 30%, #00E5FF 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(108, 99, 255, 0.3)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #6C63FF 30%, #4B44DB 90%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(20, 26, 38, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
