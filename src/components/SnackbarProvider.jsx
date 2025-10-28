import React, { createContext, useState, useContext, useCallback } from 'react';
import Snackbar from './snackbar'; 

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'info',
    key: 0,
  });

  const showSnackbar = useCallback((message, type = 'info') => {
    setSnackbar({ open: true, message, type, key: new Date().getTime() });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const contextValue = {
    showSnackbar,
  };

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      {snackbar.open && (
        <Snackbar 
          key={snackbar.key}
          message={snackbar.message}
          type={snackbar.type}
          onClose={closeSnackbar}
        />
      )}
    </SnackbarContext.Provider>
  );
};