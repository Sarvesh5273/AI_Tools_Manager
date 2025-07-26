import React, { useState } from 'react';
import { Github, Chrome, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import AnimatedBackground from './AnimatedBackground';

const LoginPage: React.FC = () => {
  const { signInWithGoogle, signInWithGitHub } = useAuth();
  const [loading, setLoading] = useState<'google' | 'github' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading('google');
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign-in failed:', err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setLoading('github');
      setError(null);
      await signInWithGitHub();
    } catch (err) {
      console.error('GitHub sign-in failed:', err);
      setError('Failed to sign in with GitHub. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  // Show configuration warning if Supabase is not configured
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-colors duration-700">
        <AnimatedBackground />
        <div className="relative z-10 max-w-md w-full mx-4">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl shadow-lg mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Configuration Required
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Supabase authentication is not configured. Please set up your Supabase project to enable login functionality.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Setup Instructions:
              </h3>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>1. Create a Supabase project</li>
                <li>2. Configure OAuth providers (Google & GitHub)</li>
                <li>3. Add environment variables</li>
                <li>4. Restart the application</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center transition-colors duration-700">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to access your AI tools collection
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Sign In Buttons */}
          <div className="space-y-4">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Chrome className="w-5 h-5 text-blue-500" />
              )}
              <span>
                {loading === 'google' ? 'Signing in...' : 'Continue with Google'}
              </span>
            </button>

            {/* GitHub Sign In */}
            <button
              onClick={handleGitHubSignIn}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 dark:bg-gray-700 border border-gray-800 dark:border-gray-600 rounded-xl font-medium text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading === 'github' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Github className="w-5 h-5" />
              )}
              <span>
                {loading === 'github' ? 'Signing in...' : 'Continue with GitHub'}
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              By signing in, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;