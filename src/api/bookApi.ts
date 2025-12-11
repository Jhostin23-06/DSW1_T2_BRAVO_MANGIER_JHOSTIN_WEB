import type { Book, CreateBookDto, UpdateBookDto } from '../types/book';
import apiClient from './apiClient';

export const bookApi = {
  // Obtener todos los libros
  getAllBooks: async (): Promise<Book[]> => {
    const response = await apiClient.get<Book[]>('/books');
    return response.data;
  },

  // Obtener libros disponibles
  getAvailableBooks: async (): Promise<Book[]> => {
    const response = await apiClient.get<Book[]>('/books/available');
    return response.data;
  },

  // Obtener libro por ID
  getBookById: async (id: number): Promise<Book> => {
    const response = await apiClient.get<Book>(`/books/${id}`);
    return response.data;
  },

  // Buscar libros
  searchBooks: async (title?: string, author?: string): Promise<Book[]> => {
    const params = new URLSearchParams();
    if (title) params.append('title', title);
    if (author) params.append('author', author);
    
    const response = await apiClient.get<Book[]>(`/books?${params.toString()}`);
    return response.data;
  },

  // Crear libro
  createBook: async (bookData: CreateBookDto): Promise<Book> => {
    const response = await apiClient.post<Book>('/books', bookData);
    return response.data;
  },

  // Actualizar libro
  updateBook: async (id: number, bookData: UpdateBookDto): Promise<Book> => {
    const response = await apiClient.put<Book>(`/books/${id}`, bookData);
    return response.data;
  },

  // Eliminar libro
  deleteBook: async (id: number): Promise<boolean> => {
    const response = await apiClient.delete(`/books/${id}`);
    return response.status === 204;
  },
};