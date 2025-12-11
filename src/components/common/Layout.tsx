import React from 'react';
import { Box, Container, CssBaseline, useTheme, useMediaQuery, Typography } from '@mui/material';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Navbar />
      
      {/* Contenido principal - RESPETA el margen del drawer del Navbar */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: { xs: 7, sm: 8 }, // Margen para el AppBar
          minHeight: 'calc(100vh - 100px)', // Altura menos AppBar
        }}
      >
        {/* Contenedor con diseño moderno */}
        <Container 
          maxWidth="lg" 
          sx={{ 
            p: { xs: 2, sm: 3 },
            height: '100%',
          }}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              boxShadow: theme.shadows[1],
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
              minHeight: 'calc(100vh - 200px)',
              position: 'relative',
            }}
          >
            {/* Header decorativo con gradiente */}
            <Box
              sx={{
                height: 6,
                background: `linear-gradient(90deg, 
                  ${theme.palette.primary.main} 0%, 
                  ${theme.palette.secondary.main} 100%)`,
              }}
            />
            
            {/* Contenido principal */}
            <Box sx={{ 
              p: { xs: 2, sm: 3, md: 4 },
              position: 'relative',
            }}>
              {/* Fondo sutil con patrón */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `
                    radial-gradient(circle at 15% 50%, ${theme.palette.primary.light}20 0%, transparent 50%),
                    radial-gradient(circle at 85% 30%, ${theme.palette.secondary.light}20 0%, transparent 50%)
                  `,
                  opacity: 0.3,
                  pointerEvents: 'none',
                }}
              />
              
              {/* Contenido real */}
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                {children}
              </Box>
            </Box>
          </Box>
          
          {/* Footer */}
          {!isMobile && (
            <Box
              component="footer"
              sx={{
                mt: 3,
                py: 2,
                textAlign: 'center',
                color: theme.palette.text.secondary,
                fontSize: '0.875rem',
                borderTop: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 1,
                px: 2,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption">
                  © {new Date().getFullYear()} Biblioteca Universitaria
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  v1.0.0
                </Typography>
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;