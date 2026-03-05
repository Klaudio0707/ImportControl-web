import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Biblioteca para ler o recheio do Token
import { authService } from '../services/AuthService';
import { api } from '../config/api';

interface User {
  id: number;
  email: string;
  nome?: string;
}

interface AuthContextData {
  user: User | null;
  signIn: (email: string, pass: string) => Promise<void>;
  signed: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Efeito para recuperar o usuário se o Token já existir no LocalStorage (F5)
  useEffect(() => {
    const storagedToken = localStorage.getItem('@ImportControl:token');
    if (storagedToken) {
      try {
        const decoded: any = jwtDecode(storagedToken);
        // O "sub" no JWT costuma ser o e-mail ou ID. 
        // Ajuste conforme o que o seu Spring Boot envia no Token!
        setUser({ id: decoded.id || 1, email: decoded.sub });
      } catch {
        localStorage.removeItem('@ImportControl:token');
      }
    }
  }, []);

  const signIn = async (email: string, pass: string) => {
    const token = await authService.login(email, pass);
    localStorage.setItem('@ImportControl:token', token);
    
    // Decodifica o token acabado de receber e salva o user no estado
    const decoded: any = jwtDecode(token);
    setUser({ id: decoded.id || 1, email: decoded.sub });
    
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signed: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);