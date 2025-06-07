import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { TokenProvider } from './contexts/TokenContext';
import { NotesProvider } from './contexts/NotesContext';
import { theme } from './theme';
import { AppRoutes } from './routes';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <TokenProvider>
          <AuthProvider>
            <NotesProvider>
              <AppRoutes />
            </NotesProvider>
          </AuthProvider>
        </TokenProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
