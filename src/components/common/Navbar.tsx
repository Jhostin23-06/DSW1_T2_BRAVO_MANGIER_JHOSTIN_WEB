import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  useTheme,
  Divider,
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Book as BookIcon,
  LibraryBooks as LoanIcon,
  Home as HomeIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const mainMenuItems = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/' },
    { text: 'Libros', icon: <BookIcon />, path: '/books' },
    { text: 'Préstamos', icon: <LoanIcon />, path: '/loans' },
  ];


  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header del Drawer */}
      <Box sx={{ 
        p: 3, 
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'white',
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              fontSize: '1.5rem',
            }}
          >
            BU
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Biblioteca
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
              Sistema de Gestión
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Universidad Tecnológica
        </Typography>
      </Box>

      {/* Barra de búsqueda */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ 
          position: 'relative',
          backgroundColor: theme.palette.action.hover,
          borderRadius: 1,
          overflow: 'hidden',
        }}>
          <Box sx={{ 
            position: 'absolute', 
            left: 12, 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: theme.palette.text.secondary,
          }}>
            <SearchIcon fontSize="small" />
          </Box>
          <input
            type="text"
            placeholder="Buscar libros..."
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
              outline: 'none',
              color: theme.palette.text.primary,
            }}
          />
        </Box>
      </Box>

      {/* Menú principal */}
      <List sx={{ flexGrow: 1, p: 2 }}>
        {mainMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                mb: 1,
                borderRadius: 1,
                backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                minWidth: 40,
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      {/* Menú secundario */}
      {/* <List sx={{ p: 2 }}>
        {secondaryMenuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 1,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.text.secondary, minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontSize: '0.875rem',
              }}
            />
          </ListItemButton>
        ))}
      </List> */}
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Título y breadcrumb */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
              Sistema de Gestión de Biblioteca
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {location.pathname === '/' && 'Dashboard'}
              {location.pathname === '/books' && 'Gestión de Libros'}
              {location.pathname === '/loans' && 'Préstamos y Devoluciones'}
            </Typography>
          </Box>

          {/* Acciones en el AppBar */}
          {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small">
              <Badge badgeContent={notifications} color="error">
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
            
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: theme.palette.primary.main,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/profile')}
            >
              <PersonIcon fontSize="small" />
            </Avatar>
          </Box> */}
        </Toolbar>
      </AppBar>
      
      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
};

export default Navbar;