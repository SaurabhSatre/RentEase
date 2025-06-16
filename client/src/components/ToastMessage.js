import React, { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const ToastMessage = ({ message, show, onClose, severity }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();  
      }, 2000);
      return () => clearTimeout(timer); 
    }
  }, [show, onClose]);

  return (
    <Snackbar 
      open={show} 
      autoHideDuration={2000} 
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastMessage;