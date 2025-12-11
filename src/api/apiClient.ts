import axios from 'axios';

const API_BASE_URL = 'http://localhost:5171/api'; // Cambiar según tu API

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Mostrar mensajes de error específicos
    if (error.response?.data?.message) {
      alert(`Error: ${error.response.data.message}`);
    } else if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      Object.keys(errors).forEach(key => {
        alert(`Error en ${key}: ${errors[key].join(', ')}`);
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;