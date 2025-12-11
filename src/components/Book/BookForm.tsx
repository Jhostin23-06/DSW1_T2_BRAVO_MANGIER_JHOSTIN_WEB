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
} from '@mui/material';
import type { Book, CreateBookDto, UpdateBookDto } from '../../types/book';
import { bookApi } from '../../api/bookApi';

interface BookFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  book?: Book | null;
}

const BookForm: React.FC<BookFormProps> = ({ open, onClose, onSubmit, book }) => {
  const [formData, setFormData] = useState<CreateBookDto>({
    title: '',
    author: '',
    isbn: '',
    stock: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        stock: book.stock,
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        stock: 1,
      });
    }
    setErrors({});
  }, [book, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (!formData.author.trim()) newErrors.author = 'El autor es requerido';
    if (!formData.isbn.trim()) newErrors.isbn = 'El ISBN es requerido';
    if (formData.isbn.length > 20) newErrors.isbn = 'El ISBN no puede exceder 20 caracteres';
    if (formData.stock < 0) newErrors.stock = 'El stock no puede ser negativo';
    if (formData.title.length > 200) newErrors.title = 'El título no puede exceder 200 caracteres';
    if (formData.author.length > 150) newErrors.author = 'El autor no puede exceder 150 caracteres';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (book) {
        await bookApi.updateBook(book.id, formData as UpdateBookDto);
      } else {
        await bookApi.createBook(formData);
      }
      onSubmit();
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        Object.keys(error.response.data.errors).forEach(key => {
          apiErrors[key] = error.response.data.errors[key].join(', ');
        });
        setErrors(apiErrors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Error al guardar el libro' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'stock' ? parseInt(value) || 0 : value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {book ? 'Editar Libro' : 'Nuevo Libro'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid>
              <TextField
                fullWidth
                label="Título"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                required
                margin="normal"
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="Autor"
                name="author"
                value={formData.author}
                onChange={handleChange}
                error={!!errors.author}
                helperText={errors.author}
                required
                margin="normal"
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="ISBN"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                error={!!errors.isbn}
                helperText={errors.isbn}
                required
                margin="normal"
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                error={!!errors.stock}
                helperText={errors.stock}
                required
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
          </Grid>
          {errors.general && (
            <Box sx={{ mt: 2, p: 1, bgcolor: 'error.light', color: 'error.dark', borderRadius: 1 }}>
              {errors.general}
            </Box>
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
          disabled={loading}
          sx={{ backgroundColor: '#1976d2' }}
        >
          {loading ? 'Guardando...' : book ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookForm;