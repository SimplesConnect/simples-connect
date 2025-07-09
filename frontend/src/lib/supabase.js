import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly set
const isConfigured = supabaseUrl && 
                    supabaseAnonKey && 
                    supabaseUrl !== 'your_supabase_url_here' && 
                    supabaseAnonKey !== 'your_supabase_anon_key_here' &&
                    !supabaseUrl.includes('placeholder') &&
                    !supabaseAnonKey.includes('placeholder');

// Create a mock client with helpful error messages if not configured
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: () => Promise.reject(new Error('🔧 Supabase not configured. Please check your environment variables in Vercel dashboard and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')),
    signInWithPassword: () => Promise.reject(new Error('🔧 Supabase not configured. Please check your environment variables in Vercel dashboard and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')),
    signInWithOAuth: () => Promise.reject(new Error('🔧 Supabase not configured. Please check your environment variables in Vercel dashboard and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')),
    signOut: () => Promise.resolve({ error: null }),
    resetPasswordForEmail: () => Promise.reject(new Error('🔧 Supabase not configured. Please check your environment variables in Vercel dashboard and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')),
    updateUser: () => Promise.reject(new Error('🔧 Supabase not configured. Please check your environment variables in Vercel dashboard and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')),
    getUser: () => Promise.reject(new Error('🔧 Supabase not configured. Please check your environment variables in Vercel dashboard and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'))
  },
  from: () => ({
    insert: () => Promise.reject(new Error('🔧 Supabase not configured. Please check your environment variables in Vercel dashboard.')),
    select: () => ({
      eq: () => ({
        single: () => Promise.reject(new Error('🔧 Supabase not configured. Please check your environment variables in Vercel dashboard.'))
      })
    })
  }),
  channel: () => ({
    on: () => ({ subscribe: () => {} })
  })
});

// Log configuration status for debugging
if (typeof window !== 'undefined') {
  console.log('Supabase Configuration Status:');
  console.log('- URL Set:', !!supabaseUrl);
  console.log('- Key Set:', !!supabaseAnonKey);
  console.log('- Is Configured:', isConfigured);
  
  if (!isConfigured) {
    console.warn('⚠️ Supabase not properly configured. Please check VERCEL_DEPLOYMENT_SETUP.md for setup instructions.');
  }
}

export const supabase = !isConfigured
  ? createMockClient()
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        redirectTo: `${window.location.origin}/auth-callback`
      }
    }); 