import React from 'react';
import { Box, CssBaseline, useTheme } from '@mui/material';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      width: '100%',
    }}>
      <CssBaseline />
      
      <Navbar />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: '64px',
          width: { xs: '100%', sm: 'calc(100% - 260px)' },
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: theme.palette.background.default,
          display: 'grid',
          gridTemplateColumns: '1fr', // ← Grid de una columna
          justifyItems: 'center', // ← Centra los elementos del grid
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Este contenedor se centra automáticamente */}
        <Box
          sx={{
            maxWidth: '1400px',
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: theme.shadows[1],
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: 4,
              background: `linear-gradient(90deg, 
                ${theme.palette.primary.main} 0%, 
                ${theme.palette.secondary.main} 100%)`,
            }}
          />
          
          <Box sx={{ 
            p: { xs: 3, sm: 4, md: 5 },
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;