import apiClient from './apiClient';
import type { Loan, CreateLoanDto } from '../types/loan';

export const loanApi = {
  // Obtener todos los préstamos
  getAllLoans: async (): Promise<Loan[]> => {
    const response = await apiClient.get<Loan[]>('/loans');
    return response.data;
  },

  // Obtener préstamos activos
  getActiveLoans: async (): Promise<Loan[]> => {
    const response = await apiClient.get<Loan[]>('/loans/active');
    return response.data;
  },

  // Obtener préstamos por estudiante
  getLoansByStudent: async (studentName: string): Promise<Loan[]> => {
    const response = await apiClient.get<Loan[]>(`/loans/student/${studentName}`);
    return response.data;
  },

  // Obtener préstamos por libro
  getLoansByBook: async (bookId: number): Promise<Loan[]> => {
    const response = await apiClient.get<Loan[]>(`/loans/book/${bookId}`);
    return response.data;
  },

  // Obtener préstamo por ID
  getLoanById: async (id: number): Promise<Loan> => {
    const response = await apiClient.get<Loan>(`/loans/${id}`);
    return response.data;
  },

  // Crear préstamo
  createLoan: async (loanData: CreateLoanDto): Promise<Loan> => {
    const response = await apiClient.post<Loan>('/loans', loanData);
    return response.data;
  },

  // Devolver préstamo
  returnLoan: async (id: number): Promise<Loan> => {
    const response = await apiClient.put<Loan>(`/loans/${id}/return`);
    return response.data;
  },

  // Eliminar préstamo
  deleteLoan: async (id: number): Promise<boolean> => {
    const response = await apiClient.delete(`/loans/${id}`);
    return response.status === 204;
  },
};