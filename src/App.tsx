import { createTheme, CssBaseline, ThemeProvider, alpha, Box, Button, Typography } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/common/Layout';
import BookList from './components/Book/BookList';
import LoanList from './components/Loan/LoanList';

// Tema moderno y profesional
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    divider: '#e2e8f0',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.025em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          border: '1px solid',
          borderColor: alpha('#e2e8f0', 0.5),
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: alpha('#f8fafc', 0.7),
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#ffffff',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              boxShadow: `0 0 0 3px ${alpha('#2563eb', 0.1)}`,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: 0,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#f8fafc',
          borderBottom: '2px solid',
          borderColor: '#e2e8f0',
        },
        root: {
          borderBottom: '1px solid',
          borderColor: alpha('#e2e8f0', 0.5),
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha('#ffffff', 0.8),
          borderBottom: '1px solid',
          borderColor: '#e2e8f0',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid',
          borderColor: '#e2e8f0',
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

// Componente de inicio moderno usando MUI
const HomeComponent: React.FC = () => (
  <Box sx={{ 
    width: '100%',
    maxWidth: '100%',
  }}>
    {/* Hero Section */}
    <Box sx={{
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
      borderRadius: 4,
      p: { xs: 3, sm: 4, md: 6, lg: 8 },
      mb: 4,
      textAlign: 'center',
      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      width: '100%',
    }}>
      <Typography variant="h1" sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        mb: 2,
        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
      }}>
        Biblioteca Universitaria
      </Typography>
      <Typography variant="h6" sx={{
        color: 'text.secondary',
        maxWidth: '800px',
        mx: 'auto',
        mb: 4,
        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
        lineHeight: 1.6,
      }}>
        Sistema integral de gestión de libros y préstamos para la biblioteca universitaria
      </Typography>
      <Box sx={{
        display: 'flex',
        gap: 2,
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => window.location.href = '/books'}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          Gestionar Libros
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => window.location.href = '/loans'}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          Gestionar Préstamos
        </Button>
      </Box>
    </Box>

    {/* Acciones Rápidas */}
    <Box sx={{
      backgroundColor: 'background.paper',
      borderRadius: 3,
      p: { xs: 3, sm: 4, md: 5 },
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[1],
      width: '100%',
    }}>
      <Typography variant="h4" sx={{ 
        mb: 3,
        fontWeight: 600,
        color: 'text.primary',
      }}>
        Acciones Rápidas
      </Typography>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
        width: '100%',
      }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => window.location.href = '/books?action=new'}
          sx={{
            height: '140px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            borderWidth: 2,
            borderColor: alpha(theme.palette.primary.main, 0.2),
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            color: theme.palette.primary.main,
            '&:hover': {
              borderWidth: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <Box sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Box component="span" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>+</Box>
          </Box>
          Agregar Nuevo Libro
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={() => window.location.href = '/loans?action=new'}
          sx={{
            height: '140px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            borderWidth: 2,
            borderColor: alpha(theme.palette.secondary.main, 0.2),
            backgroundColor: alpha(theme.palette.secondary.main, 0.05),
            color: theme.palette.secondary.main,
            '&:hover': {
              borderWidth: 2,
              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
            },
          }}
        >
          <Box sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.secondary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Box component="span" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>📝</Box>
          </Box>
          Registrar Préstamo
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={() => window.location.href = '/loans?filter=overdue'}
          sx={{
            height: '140px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            borderWidth: 2,
            borderColor: alpha(theme.palette.success.main, 0.2),
            backgroundColor: alpha(theme.palette.success.main, 0.05),
            color: theme.palette.success.main,
            '&:hover': {
              borderWidth: 2,
              backgroundColor: alpha(theme.palette.success.main, 0.1),
            },
          }}
        >
          <Box sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.success.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Box component="span" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>✓</Box>
          </Box>
          Ver Devoluciones
        </Button>
      </Box>
    </Box>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomeComponent />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/loans" element={<LoanList />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;