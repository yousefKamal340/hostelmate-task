import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { theme } from './theme';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { TokenProvider } from './context/TokenContext';
import { NotesProvider } from './context/NotesContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <TokenProvider>
              <NotesProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </NotesProvider>
            </TokenProvider>
          </AuthProvider>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
