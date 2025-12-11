/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    CircularProgress,
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
    IconButton,
    Card,
    CardContent,
    Avatar,
    alpha,
    useTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tooltip,
    Badge,
    InputAdornment,
    Tabs,
    Tab,
} from '@mui/material';
import {
    Add as AddIcon,
    Undo as ReturnIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Warning as WarningIcon,
    Person as PersonIcon,
    Book as BookIcon,
    History as HistoryIcon,
    CalendarToday as CalendarIcon,
    CheckCircle as CheckCircleIcon,
    Clear as ClearIcon,
    FilterList as FilterIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import { format, differenceInDays, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Loan } from '../../types/loan';
import { loanApi } from '../../api/loanApi';
import LoanForm from './LoanForm';
import CustomAlert from '../common/Alert';

const LoanList: React.FC = () => {
    const theme = useTheme();
    const [loans, setLoans] = useState<Loan[]>([]);
    const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [openForm, setOpenForm] = useState(false);
    const [returnDialog, setReturnDialog] = useState<{ open: boolean; loanId: number | null }>({
        open: false,
        loanId: null,
    });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; loanId: number | null }>({
        open: false,
        loanId: null,
    });
    const [selectedTab, setSelectedTab] = useState(0);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    useEffect(() => {
        loadLoans();
    }, []);

    useEffect(() => {
        let result = [...loans];
        
        // Aplicar búsqueda
        if (searchTerm) {
            result = result.filter(
                (loan) =>
                    loan.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    loan.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    loan.studentName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrar por tab seleccionada
        if (selectedTab === 0) {
            result = result.filter(loan => loan.status === 'Active');
        } else if (selectedTab === 1) {
            result = result.filter(loan => loan.isOverdue);
        } else if (selectedTab === 2) {
            result = result.filter(loan => loan.status === 'Returned');
        }
        
        setFilteredLoans(result);
    }, [searchTerm, loans, selectedTab]);

    const loadLoans = async () => {
        try {
            setLoading(true);
            const data = await loanApi.getAllLoans();
            setLoans(data);
        } catch (error) {
            console.error('Error loading loans:', error);
            showAlert('Error al cargar los préstamos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = (id: number) => {
        setReturnDialog({ open: true, loanId: id });
    };

    const confirmReturn = async () => {
        if (returnDialog.loanId) {
            try {
                await loanApi.returnLoan(returnDialog.loanId);
                showAlert('Préstamo devuelto exitosamente', 'success');
                loadLoans();
            } catch (error: any) {
                showAlert(
                    error.response?.data?.message || 'Error al devolver el préstamo',
                    'error'
                );
            } finally {
                setReturnDialog({ open: false, loanId: null });
            }
        }
    };

    const handleDelete = (id: number) => {
        setDeleteDialog({ open: true, loanId: id });
    };

    const confirmDelete = async () => {
        if (deleteDialog.loanId) {
            try {
                await loanApi.deleteLoan(deleteDialog.loanId);
                showAlert('Préstamo eliminado exitosamente', 'success');
                loadLoans();
            } catch (error: any) {
                showAlert(
                    error.response?.data?.message || 'No se puede eliminar un préstamo activo. Debe devolverlo primero.',
                    'error'
                );
            } finally {
                setDeleteDialog({ open: false, loanId: null });
            }
        }
    };

    const handleFormSubmit = () => {
        loadLoans();
        setOpenForm(false);
        showAlert('Préstamo creado exitosamente', 'success');
    };

    const showAlert = (message: string, severity: 'success' | 'error') => {
        setAlert({ open: true, message, severity });
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
        } catch {
            return 'Fecha inválida';
        }
    };

    const getDaysRemaining = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diff = differenceInDays(due, today);
        
        if (isAfter(today, due)) {
            return Math.abs(diff);
        }
        return diff;
    };

    const getStatusColor = (loan: Loan) => {
        if (loan.status === 'Returned') return theme.palette.success.main;
        if (loan.isOverdue) return theme.palette.error.main;
        return theme.palette.warning.main;
    };

    const getStatusLabel = (loan: Loan) => {
        if (loan.status === 'Returned') return 'Devuelto';
        if (loan.isOverdue) return 'Vencido';
        return 'Activo';
    };

    const clearSearch = () => {
        setSearchTerm('');
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
        <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
            <CustomAlert
                open={alert.open}
                message={alert.message}
                severity={alert.severity}
                onClose={() => setAlert({ ...alert, open: false })}
            />

            <LoanForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSubmit={handleFormSubmit}
            />

            {/* Diálogo de confirmación para devolución */}
            <Dialog
                open={returnDialog.open}
                onClose={() => setReturnDialog({ open: false, loanId: null })}
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                            <ReturnIcon color="success" />
                        </Avatar>
                        <Typography variant="h6">Confirmar Devolución</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de marcar este préstamo como devuelto? Esta acción registrará la devolución del libro.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReturnDialog({ open: false, loanId: null })}>
                        Cancelar
                    </Button>
                    <Button onClick={confirmReturn} color="success" variant="contained" startIcon={<ReturnIcon />}>
                        Confirmar Devolución
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de confirmación para eliminar */}
            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, loanId: null })}
            >
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de eliminar este préstamo? Esta acción no se puede deshacer y eliminará permanentemente el registro.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, loanId: null })}>
                        Cancelar
                    </Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                        <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 0.5 }}>
                            Gestión de Préstamos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Control y seguimiento de préstamos de libros
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
                        Nuevo Préstamo
                    </Button>
                </Box>

                {/* Resumen */}
                <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { 
                        xs: '1fr',
                        sm: '1fr 1fr',
                        md: '1fr 1fr 1.5fr 2fr'
                    },
                    gap: 3,
                    mb: 3
                }}>
                    {/* Total de préstamos */}
                    <Card sx={{ 
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                    }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="h3" fontWeight={700} color="primary">
                                        {loans.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total préstamos
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                                    <HistoryIcon color="primary" />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Préstamos activos */}
                    <Card sx={{ 
                        background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
                        borderLeft: `4px solid ${theme.palette.warning.main}`,
                    }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="h3" fontWeight={700} color="warning.main">
                                        {loans.filter(l => l.status === 'Active').length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Activos
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
                                    <BookIcon color="warning" />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Préstamos vencidos */}
                    <Card sx={{ 
                        background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
                        borderLeft: `4px solid ${theme.palette.error.main}`,
                    }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="h3" fontWeight={700} color="error.main">
                                        {loans.filter(l => l.isOverdue).length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Vencidos
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1) }}>
                                    <WarningIcon color="error" />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Préstamos devueltos */}
                    <Card sx={{ 
                        background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                        borderLeft: `4px solid ${theme.palette.success.main}`,
                    }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="h3" fontWeight={700} color="success.main">
                                        {loans.filter(l => l.status === 'Returned').length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Devueltos
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                                    <CheckCircleIcon color="success" />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Tabs de filtro */}
            <Paper sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs 
                    value={selectedTab} 
                    onChange={(_, newValue) => setSelectedTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab 
                        icon={<BookIcon />} 
                        iconPosition="start" 
                        label={`Activos (${loans.filter(l => l.status === 'Active').length})`} 
                    />
                    <Tab 
                        icon={<WarningIcon />} 
                        iconPosition="start" 
                        label={`Vencidos (${loans.filter(l => l.isOverdue).length})`}
                        sx={{ color: theme.palette.error.main }}
                    />
                    <Tab 
                        icon={<CheckCircleIcon />} 
                        iconPosition="start" 
                        label={`Devueltos (${loans.filter(l => l.status === 'Returned').length})`} 
                    />
                </Tabs>
            </Paper>

            {/* Barra de búsqueda */}
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
                            placeholder="Buscar por estudiante o libro..."
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
                            <Badge badgeContent={filteredLoans.length} color="primary" sx={{ mr: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Resultados
                                </Typography>
                            </Badge>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            {/* Tabla de préstamos */}
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
                            <TableCell><strong>Libro</strong></TableCell>
                            <TableCell><strong>Estudiante</strong></TableCell>
                            <TableCell><strong>Fechas</strong></TableCell>
                            <TableCell><strong>Estado</strong></TableCell>
                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredLoans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <BookIcon sx={{ fontSize: 60, color: theme.palette.text.disabled, mb: 2 }} />
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            No se encontraron préstamos
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {searchTerm ? 'Intenta con otros términos de búsqueda' : selectedTab === 0 ? 'No hay préstamos activos' : 'No hay préstamos en esta categoría'}
                                        </Typography>
                                        {!searchTerm && selectedTab === 0 && (
                                            <Button
                                                variant="outlined"
                                                startIcon={<AddIcon />}
                                                onClick={() => setOpenForm(true)}
                                                sx={{ mt: 2 }}
                                            >
                                                Crear Préstamo
                                            </Button>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLoans.map((loan) => {
                                const daysRemaining = getDaysRemaining(loan.dueDate || '');
                                
                                return (
                                    <TableRow 
                                        key={loan.id} 
                                        hover
                                        sx={{ 
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                            },
                                            '&:last-child td': { borderBottom: 0 }
                                        }}
                                    >
                                        <TableCell>
                                            <Box>
                                                <Typography fontWeight={500}>
                                                    {loan.bookTitle}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography>{loan.studentName}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                                    <CalendarIcon fontSize="small" color="action" />
                                                    <Typography variant="body2">
                                                        <strong>Préstamo:</strong> {formatDate(loan.loanDate)}
                                                    </Typography>
                                                </Box>
                                                {loan.returnDate && (
                                                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                                        <CheckCircleIcon fontSize="small" color="success" />
                                                        <Typography variant="body2">
                                                            <strong>Devolución:</strong> {formatDate(loan.returnDate)}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Chip
                                                    label={getStatusLabel(loan)}
                                                    sx={{
                                                        backgroundColor: alpha(getStatusColor(loan), 0.1),
                                                        color: getStatusColor(loan),
                                                        fontWeight: 600,
                                                    }}
                                                />
                                                {loan.isOverdue && (
                                                    <Chip
                                                        icon={<WarningIcon />}
                                                        label={`Vencido hace ${daysRemaining} días`}
                                                        size="small"
                                                        color="error"
                                                    />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box display="flex" gap={1} justifyContent="center">
                                                {loan.status === 'Active' && (
                                                    <Tooltip title="Marcar como devuelto">
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            size="small"
                                                            startIcon={<ReturnIcon />}
                                                            onClick={() => handleReturn(loan.id)}
                                                            sx={{
                                                                minWidth: 'auto',
                                                                px: 2,
                                                            }}
                                                        >
                                                            Devolver
                                                        </Button>
                                                    </Tooltip>
                                                )}
                                                <Tooltip title="Eliminar">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDelete(loan.id)}
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
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Historial de devoluciones (solo si hay muchos) */}
            {loans.filter(loan => loan.status === 'Returned').length > 0 && selectedTab !== 2 && (
                <Box mt={4}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" fontWeight={600}>
                                <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Historial Reciente de Devoluciones
                            </Typography>
                            <Button 
                                variant="text" 
                                size="small"
                                onClick={() => setSelectedTab(2)}
                            >
                                Ver todo
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: alpha(theme.palette.background.default, 0.5) }}>
                                        <TableCell><strong>Libro</strong></TableCell>
                                        <TableCell><strong>Estudiante</strong></TableCell>
                                        <TableCell><strong>Fecha Préstamo</strong></TableCell>
                                        <TableCell><strong>Fecha Devolución</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loans
                                        .filter(loan => loan.status === 'Returned')
                                        .slice(0, 5)
                                        .map((loan) => (
                                            <TableRow key={loan.id} hover>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <BookIcon fontSize="small" color="action" />
                                                        <Typography variant="body2">{loan.bookTitle}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <PersonIcon fontSize="small" color="action" />
                                                        <Typography variant="body2">{loan.studentName}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {format(new Date(loan.loanDate), 'dd/MM/yyyy', { locale: es })}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={format(new Date(loan.returnDate!), 'dd/MM/yyyy', { locale: es })}
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            )}
        </Box>
    );
};

export default LoanList;