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
  signUpWithEmailAndPassword: (email: string, password: string) => Promise<void>;
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

  const signUpWithEmailAndPassword = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured - cannot sign up with email');
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
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