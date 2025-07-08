import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key_here';

// Create a mock client if environment variables are not set
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: () => Promise.reject(new Error('Supabase not configured. Please add your credentials to .env file.')),
    signInWithPassword: () => Promise.reject(new Error('Supabase not configured. Please add your credentials to .env file.')),
    signInWithOAuth: () => Promise.reject(new Error('Supabase not configured. Please add your credentials to .env file.')),
    signOut: () => Promise.resolve({ error: null }),
    resetPasswordForEmail: () => Promise.reject(new Error('Supabase not configured. Please add your credentials to .env file.')),
    updateUser: () => Promise.reject(new Error('Supabase not configured. Please add your credentials to .env file.'))
  },
  from: () => ({
    insert: () => Promise.resolve({ data: null, error: null })
  })
});

export const supabase = (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder_key_here') 
  ? createMockClient()
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }); 