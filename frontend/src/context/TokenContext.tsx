import React, { createContext, useContext, useState, useCallback } from 'react';

interface TokenContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  getAuthHeader: () => { Authorization: string } | {};
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('token'));

  const setToken = useCallback((newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
    setTokenState(newToken);
  }, []);

  const getAuthHeader = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const value = {
    token,
    setToken,
    getAuthHeader,
  };

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
}; 