import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sign up with email and password
  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) throw error;

    // Create profile in profiles table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            full_name: fullName,
            email: email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }

    return data;
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Check if user has completed their profile
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_profile_complete')
        .eq('id', data.user.id)
        .single();

      // Redirect based on profile completion status
      if (profile?.is_profile_complete) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/profile-completion';
      }
    }

    return data;
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth-callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Google OAuth error:', error);
        
        // Provide more specific error messages
        if (error.message.includes('not configured')) {
          throw new Error('🔧 Google OAuth not configured. Please check your environment variables and Supabase settings.');
        } else if (error.message.includes('invalid_client')) {
          throw new Error('🔧 Invalid Google OAuth client. Please check your Google Cloud Console configuration.');
        } else if (error.message.includes('redirect_uri_mismatch')) {
          throw new Error('🔧 OAuth redirect URL mismatch. Please update your Google OAuth settings.');
        } else {
          throw new Error('🔧 Google sign-in failed. Please try again or contact support.');
        }
      }

      return data;
    } catch (err) {
      console.error('Google sign-in error:', err);
      
      // Handle configuration errors
      if (err.message.includes('Supabase not configured')) {
        throw new Error('🔧 Authentication service not configured. Please check your environment variables.');
      }
      
      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Reset password
  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return data;
  };

  // Update password
  const updatePassword = async (password) => {
    const { data, error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) throw error;
    return data;
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
