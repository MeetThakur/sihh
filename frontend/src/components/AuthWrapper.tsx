import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import { Loader2, Leaf } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgot-password';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { state } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Show loading screen while checking authentication
  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <Leaf className="h-10 w-10 text-white" />
          </div>
          <Loader2 className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Loading KhetSetu...</p>
          <p className="text-sm text-gray-600 mt-2">Please wait while we check your authentication status</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, render the app
  if (state.isAuthenticated && state.user) {
    return <>{children}</>;
  }

  // If not authenticated, show authentication forms
  const handleToggleMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
  };

  const handleForgotPassword = () => {
    setAuthMode('forgot-password');
  };

  const handleBackToLogin = () => {
    setAuthMode('login');
  };

  switch (authMode) {
    case 'register':
      return <Register onToggleMode={handleToggleMode} />;
    case 'forgot-password':
      return <ForgotPassword onBack={handleBackToLogin} />;
    case 'login':
    default:
      return (
        <Login
          onToggleMode={handleToggleMode}
          onForgotPassword={handleForgotPassword}
        />
      );
  }
};

export default AuthWrapper;
