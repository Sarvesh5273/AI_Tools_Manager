import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signUpWithEmailAndPassword: (email: string, password: string) => Promise<{ isNewUser: boolean; message: string }>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only initialize auth if Supabase is configured
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured - cannot sign in with Google');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Error signing in with Google:', error);
        throw error;
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signInWithGitHub = async () => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured - cannot sign in with GitHub');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Error signing in with GitHub:', error);
        throw error;
      }
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured - cannot sign out');
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const signUpWithEmailAndPassword = async (email: string, password: string): Promise<{ isNewUser: boolean; message: string }> => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured - cannot sign up with email');
      return {
        isNewUser: false,
        message: 'Authentication service not configured'
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Error signing up with email:', error);
        throw error;
      }
      
      // Check if a new user was created or if the email already exists
      if (data.user && data.user.email_confirmed_at === null) {
        // New user created, needs email confirmation
        return {
          isNewUser: true,
          message: 'Check your email for a verification link to complete your registration.'
        };
      } else if (!data.user && !error) {
        // Email already exists, Supabase sent a magic link but didn't create a new user
        return {
          isNewUser: false,
          message: 'If an account with this email exists, a verification link has been sent to your email address. Please check your inbox and spam folder.'
        };
      } else if (data.user && data.user.email_confirmed_at !== null) {
        // User already exists and is confirmed
        return {
          isNewUser: false,
          message: 'An account with this email already exists and is verified. Please sign in instead.'
        };
      } else {
        // Fallback message
        return {
          isNewUser: true,
          message: 'Check your email for a verification link to complete your registration.'
        };
      }
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    }
  };

  const signInWithEmailAndPassword = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured - cannot sign in with email');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Error signing in with email:', error);
        throw error;
      }
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    loading,
    signInWithGoogle,
    signInWithGitHub,
    signUpWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};