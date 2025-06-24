
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/database';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular verificação de autenticação
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('auth_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simular login - substituir por integração real com Supabase
      const mockUser: User = {
        id: '1',
        name: 'Admin User',
        email: email,
        role: 'admin',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Falha na autenticação');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Simular cadastro - substituir por integração real com Supabase
      const mockUser: User = {
        id: '1',
        name: name,
        email: email,
        role: 'viewer',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Falha no cadastro');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};
