/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import type { CreateLoanDto } from '../../types/loan';
import type { Book } from '../../types/book';
import { loanApi } from '../../api/loanApi';
import { bookApi } from '../../api/bookApi';

interface LoanFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const LoanForm: React.FC<LoanFormProps> = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateLoanDto>({
    bookId: 0,
    studentName: '',
  });
  const [books, setBooks] = useState<Book[]>([]);
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stockError, setStockError] = useState<string>('');

  useEffect(() => {
    if (open) {
      loadBooks();
      resetForm();
    }
  }, [open]);

  const loadBooks = async () => {
    try {
      setLoadingBooks(true);
      const data = await bookApi.getAvailableBooks();
      setBooks(data);
      setAvailableBooks(data.filter(book => book.stock > 0));
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoadingBooks(false);
    }
  };

  const resetForm = () => {
    setFormData({
      bookId: 0,
      studentName: '',
    });
    setErrors({});
    setStockError('');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.bookId) newErrors.bookId = 'Seleccione un libro';
    if (!formData.studentName.trim()) newErrors.studentName = 'El nombre del estudiante es requerido';
    if (formData.studentName.length > 150) newErrors.studentName = 'El nombre no puede exceder 150 caracteres';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Verificar stock antes de crear el préstamo
      const selectedBook = books.find(book => book.id === formData.bookId);
      if (selectedBook && selectedBook.stock <= 0) {
        setStockError(`El libro "${selectedBook.title}" no tiene stock disponible`);
        setLoading(false);
        return;
      }

      await loanApi.createLoan(formData);
      onSubmit();
      onClose();
    } catch (error: any) {
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('stock')) {
          setStockError(error.response.data.message);
        } else if (error.response.data.message.includes('límite')) {
          setErrors({ studentName: error.response.data.message });
        } else {
          setErrors({ general: error.response.data.message });
        }
      } else if (error.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        Object.keys(error.response.data.errors).forEach(key => {
          apiErrors[key] = error.response.data.errors[key].join(', ');
        });
        setErrors(apiErrors);
      } else {
        setErrors({ general: 'Error al crear el préstamo' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'bookId' ? parseInt(value) : value,
    });
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
    if (stockError) setStockError('');
  };

  const selectedBook = books.find(book => book.id === formData.bookId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Nuevo Préstamo
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {loadingBooks ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : availableBooks.length === 0 ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No hay libros disponibles para préstamo. Agregue stock a los libros existentes.
            </Alert>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid>
                  <TextField
                    select
                    fullWidth
                    label="Libro"
                    name="bookId"
                    value={formData.bookId}
                    onChange={handleChange}
                    error={!!errors.bookId}
                    helperText={errors.bookId}
                    required
                    margin="normal"
                  >
                    <MenuItem value={0}>Seleccionar libro</MenuItem>
                    {availableBooks.map((book) => (
                      <MenuItem key={book.id} value={book.id}>
                        {book.title} - {book.author} (Disponibles: {book.stock})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {selectedBook && (
                  <Grid>
                    <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                      <Typography variant="body2">
                        <strong>Libro seleccionado:</strong> {selectedBook.title}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Autor:</strong> {selectedBook.author}
                      </Typography>
                      <Typography variant="body2">
                        <strong>ISBN:</strong> {selectedBook.isbn}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Stock disponible:</strong>{' '}
                        <span style={{ color: selectedBook.stock > 0 ? 'green' : 'red' }}>
                          {selectedBook.stock}
                        </span>
                      </Typography>
                    </Box>
                  </Grid>
                )}

                <Grid>
                  <TextField
                    fullWidth
                    label="Nombre del Estudiante"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    error={!!errors.studentName}
                    helperText={errors.studentName}
                    required
                    margin="normal"
                  />
                </Grid>
              </Grid>

              {stockError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {stockError}
                </Alert>
              )}

              {errors.general && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {errors.general}
                </Alert>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || loadingBooks || availableBooks.length === 0}
          sx={{ backgroundColor: '#1976d2' }}
        >
          {loading ? 'Creando...' : 'Crear Préstamo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoanForm;