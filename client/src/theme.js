import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565c0', // Deep blue
      light: '#5e92f3',
      dark: '#003c8f',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ffb300', // Amber
      light: '#ffe54c',
      dark: '#c68400',
      contrastText: '#212121',
    },
    background: {
      default: 'linear-gradient(135deg, #e3f2fd 0%, #fceabb 100%)', // Soft blue to amber gradient
      paper: '#f5f7fa', // Slightly tinted surface
    },
    text: {
      primary: '#212b36',
      secondary: '#637381',
    },
    info: {
      main: '#00bcd4', // Cyan accent
    },
    success: {
      main: '#43a047',
    },
    error: {
      main: '#e53935',
    },
    warning: {
      main: '#ffa726',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-1px' },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 24px 0 rgba(21, 101, 192, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px 0 rgba(255, 179, 0, 0.10)',
        },
      },
    },
  },
});

export default theme; 