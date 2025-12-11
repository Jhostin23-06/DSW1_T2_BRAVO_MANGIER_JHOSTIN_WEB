/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Card,
  CardContent,
  alpha,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Avatar,
  Badge,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Book as BookIcon,
  Sort as SortIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import type { Book } from '../../types/book';
import { bookApi } from '../../api/bookApi';
import BookForm from './BookForm';
import CustomAlert from '../common/Alert';

const BookList: React.FC = () => {
  const theme = useTheme();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; bookId: number | null }>({
    open: false,
    bookId: null,
  });
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Book; direction: 'asc' | 'desc' } | null>(null);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    let result = [...books];
    
    // Aplicar búsqueda
    if (searchTerm) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.isbn.includes(searchTerm) 
      );
    }
    
    // Aplicar ordenamiento
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    setFilteredBooks(result);
  }, [searchTerm, books, sortConfig]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await bookApi.getAllBooks();
      setBooks(data);
    } catch (error) {
      console.error('Error loading books:', error);
      showAlert('Error al cargar los libros', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteDialog({ open: true, bookId: id });
  };

  const confirmDelete = async () => {
    if (deleteDialog.bookId) {
      try {
        await bookApi.deleteBook(deleteDialog.bookId);
        showAlert('Libro eliminado exitosamente', 'success');
        loadBooks();
      } catch (error: any) {
        showAlert(
          error.response?.data?.message || 'Error al eliminar el libro',
          'error'
        );
      } finally {
        setDeleteDialog({ open: false, bookId: null });
      }
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setOpenForm(true);
  };

  const handleView = (book: Book) => {
    setViewingBook(book);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditingBook(null);
  };

  const handleFormSubmit = () => {
    loadBooks();
    handleFormClose();
    showAlert(
      editingBook ? 'Libro actualizado exitosamente' : 'Libro creado exitosamente',
      'success'
    );
  };

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({ open: true, message, severity });
  };

  const handleSort = (key: keyof Book) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getStatusColor = (stock: number) => {
    if (stock > 10) return theme.palette.success.main;
    if (stock > 3) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getStatusLabel = (stock: number) => {
    if (stock > 10) return 'Disponible';
    if (stock > 3) return 'Pocas unidades';
    if (stock > 0) return 'Últimas unidades';
    return 'Agotado';
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
          borderRadius: 2,
        }}
      >
        <CircularProgress 
          size={60}
          thickness={4}
          sx={{ color: theme.palette.primary.main }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '100%', overflow: 'hidden', position: 'relative' }}>
      <CustomAlert
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />

      <BookForm
        open={openForm}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        book={editingBook}
      />

      {/* Dialogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, bookId: null })}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este libro? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, bookId: null })}>
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo para ver detalles */}
      {viewingBook && (
        <Dialog
          open={!!viewingBook}
          onClose={() => setViewingBook(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <BookIcon />
              </Avatar>
              <Typography variant="h6">{viewingBook.title}</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {/* Usando Box en lugar de Grid */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
              mt: 2
            }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Autor
                </Typography>
                <Typography variant="body1">{viewingBook.author}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  ISBN
                </Typography>
                <Typography variant="body1">{viewingBook.isbn}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Stock
                </Typography>
                <Chip
                  label={`${viewingBook.stock} unidades`}
                  sx={{
                    bgcolor: alpha(getStatusColor(viewingBook.stock), 0.1),
                    color: getStatusColor(viewingBook.stock),
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Estado
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: getStatusColor(viewingBook.stock),
                    fontWeight: 500,
                  }}
                >
                  {getStatusLabel(viewingBook.stock)}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewingBook(null)}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 0.5 }}>
              Gestión de Libros
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administra el catálogo de libros de la biblioteca
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenForm(true)}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: theme.shadows[3],
              '&:hover': {
                boxShadow: theme.shadows[6],
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Nuevo Libro
          </Button>
        </Box>

        {/* Resumen con Box en lugar de Grid */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr 1fr'
          },
          gap: 2,
          mb: 3
        }}>
          {/* Tarjeta 1 - Total de libros */}
          <Card sx={{ 
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            height: '100%',
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h3" fontWeight={700} color="primary">
                    {books.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total de libros
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                  <BookIcon color="primary" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          {/* Tarjeta 2 - Disponibles */}
          <Card sx={{ 
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
            borderLeft: `4px solid ${theme.palette.success.main}`,
            height: '100%',
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h3" fontWeight={700} color="success.main">
                    {books.filter(b => b.stock > 10).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Disponibles
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                  <BookIcon color="success" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          {/* Tarjeta 3 - Por agotarse */}
          <Card sx={{ 
            background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
            borderLeft: `4px solid ${theme.palette.warning.main}`,
            height: '100%',
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h3" fontWeight={700} color="warning.main">
                    {books.filter(b => b.stock <= 3 && b.stock > 0).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Por agotarse
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
                  <BookIcon color="warning" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          {/* Tarjeta 4 - Agotados */}
          <Card sx={{ 
            background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
            borderLeft: `4px solid ${theme.palette.error.main}`,
            height: '100%',
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h3" fontWeight={700} color="error.main">
                    {books.filter(b => b.stock === 0).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Agotados
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1) }}>
                  <BookIcon color="error" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Barra de búsqueda y filtros */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.paper,
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: { md: 'center' }
        }}>
          {/* Campo de búsqueda */}
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar por título, autor o ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={clearSearch}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                }
              }}
            />
          </Box>
          
          {/* Botones y contador */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            justifyContent: { xs: 'space-between', md: 'flex-end' },
            alignItems: 'center',
            width: { xs: '100%', md: 'auto' }
          }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Filtrar">
                <IconButton 
                  sx={{ 
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                  }}
                >
                  <FilterIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Exportar">
                <IconButton 
                  sx={{ 
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box display="flex" alignItems="center">
              <Badge badgeContent={filteredBooks.length} color="primary" sx={{ mr: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Resultados
                </Typography>
              </Badge>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Tabla de libros */}
      <TableContainer 
        component={Paper}
        elevation={0}
        sx={{ 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ 
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
              borderBottom: `2px solid ${theme.palette.divider}`,
            }}>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  Título
                  <IconButton size="small" onClick={() => handleSort('title')}>
                    <SortIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  Autor
                  <IconButton size="small" onClick={() => handleSort('author')}>
                    <SortIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  Stock
                  <IconButton size="small" onClick={() => handleSort('stock')}>
                    <SortIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <BookIcon sx={{ fontSize: 60, color: theme.palette.text.disabled, mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No se encontraron libros
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Agrega tu primer libro'}
                    </Typography>
                    {!searchTerm && (
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenForm(true)}
                        sx={{ mt: 2 }}
                      >
                        Agregar Libro
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredBooks.map((book) => (
                <TableRow 
                  key={book.id} 
                  hover
                  sx={{ 
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.02),
                    },
                    '&:last-child td': { borderBottom: 0 }
                  }}
                >
                  <TableCell>
                    <Typography fontWeight={500}>{book.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{book.author}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace',
                        backgroundColor: alpha(theme.palette.text.primary, 0.04),
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        display: 'inline-block',
                      }}
                    >
                      {book.isbn}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={book.stock}
                        sx={{
                          backgroundColor: alpha(getStatusColor(book.stock), 0.1),
                          color: getStatusColor(book.stock),
                          fontWeight: 600,
                          minWidth: 40,
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        unidades
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(book.stock)}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getStatusColor(book.stock), 0.1),
                        color: getStatusColor(book.stock),
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          onClick={() => handleView(book)}
                          sx={{ 
                            color: theme.palette.info.main,
                            '&:hover': { 
                              backgroundColor: alpha(theme.palette.info.main, 0.1) 
                            }
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(book)}
                          sx={{ 
                            color: theme.palette.warning.main,
                            '&:hover': { 
                              backgroundColor: alpha(theme.palette.warning.main, 0.1) 
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(book.id)}
                          sx={{ 
                            color: theme.palette.error.main,
                            '&:hover': { 
                              backgroundColor: alpha(theme.palette.error.main, 0.1) 
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación (opcional) */}
      {filteredBooks.length > 0 && (
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mt={3}
          px={2}
        >
          <Typography variant="body2" color="text.secondary">
            Mostrando {filteredBooks.length} de {books.length} libros
          </Typography>
          {/* Aquí puedes agregar componentes de paginación si es necesario */}
        </Box>
      )}
    </Box>
  );
};

export default BookList;