import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/common/Layout';
import BookList from './components/Book/BookList';
import LoanList from './components/Loan/LoanList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const HomeComponent: React.FC = () => (
  <div style={{ padding: '10px' }}>
    <h1>Bienvenido al Sistema de Biblioteca</h1>
    <p>Seleccione una opción del menú para comenzar.</p>
  </div>
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

export default App
