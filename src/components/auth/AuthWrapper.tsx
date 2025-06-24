
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { Layout } from '@/components/layout/Layout';
import { ReactNode } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { user, loading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return isLoginMode ? (
      <LoginForm onToggleMode={() => setIsLoginMode(false)} />
    ) : (
      <SignUpForm onToggleMode={() => setIsLoginMode(true)} />
    );
  }

  return <Layout>{children}</Layout>;
};
