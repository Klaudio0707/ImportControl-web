import React, { createContext, useState, useContext, type ReactNode } from 'react';
import { api } from '../config/api';
import { authService } from '../services/auth.service';

interface AuthContextData {
  token: string | null;
  isAuthenticated: boolean;
  signIn: (login: string, senha: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  const signIn = async (login: string, senha: string) => {
    const jwtToken = await authService.login(login, senha);
    
    setToken(jwtToken);
    
    api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
  };

  const signOut = () => {
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);