import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

const AuthCallback: React.FC = () => {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    // Check for GitHub cancel error from hash params
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const error = params.get('error');
    const errorDescription = params.get('error_description');

    if (error === 'access_denied') {
      setStatus('error');
      setMessage('You cancelled the login. Redirecting to login page...');
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      return;
    }

    // Otherwise proceed with user check
    const handleAuthCallback = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // wait for auth state update
        if (user) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        } else if (!loading) {
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('An error occurred during authentication.');
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [user, loading]);

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-12 h-12 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600 dark:text-blue-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center transition-colors duration-700">
      <AnimatedBackground />
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              {getIcon()}
            </div>
            <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
              {status === 'loading' && 'Authenticating...'}
              {status === 'success' && 'Welcome!'}
              {status === 'error' && 'Authentication Failed'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>

            {status === 'loading' && (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            )}

            {status === 'success' && user && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <p className="text-sm text-green-700 dark:text-green-400">
                  Signed in as <strong>{user.email}</strong>
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-sm text-red-700 dark:text-red-400">
                  You will be redirected to the login page shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
