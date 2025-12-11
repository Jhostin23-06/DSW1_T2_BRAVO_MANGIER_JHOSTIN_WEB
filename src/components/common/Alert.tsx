import React from 'react';
import { Alert as MuiAlert, Snackbar, type AlertProps } from '@mui/material';

interface CustomAlertProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomAlert: React.FC<CustomAlertProps> = ({
  open,
  message,
  severity,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        zIndex: 99999
      }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%', marginTop: '3.5rem' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;