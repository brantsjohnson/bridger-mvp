import { useState, useEffect } from 'react';
import { LoginScreen } from './LoginScreen';
import { SignupScreen } from './SignupScreen';
import { MainApp } from './MainApp';

type AuthMode = 'login' | 'signup' | 'skip';

export const AuthContainer = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  // Handle email confirmation redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    
    if (accessToken && refreshToken) {
      console.log('Email confirmation detected!');
      // Clear the URL hash
      window.location.hash = '';
      // Show success message and switch to login
      setMode('login');
    }
  }, []);

  if (mode === 'skip') {
    return <MainApp />;
  }

  return (
    <div className="min-h-screen">
      {mode === 'login' ? (
        <LoginScreen onSwitchToSignup={() => setMode('signup')} onSkip={() => setMode('skip')} />
      ) : (
        <SignupScreen onSwitchToLogin={() => setMode('login')} onSkip={() => setMode('skip')} />
      )}
    </div>
  );
};