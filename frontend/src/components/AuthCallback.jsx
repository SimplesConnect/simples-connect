import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('Completing sign in...');
        
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          
          // Provide specific error messages
          if (error.message.includes('not configured')) {
            setError('🔧 Authentication service not configured. Please check the setup guide.');
          } else if (error.message.includes('invalid_grant')) {
            setError('🔐 Authentication expired. Please try signing in again.');
          } else {
            setError('🔧 Authentication failed. Please try again.');
          }
          return;
        }

        if (session?.user) {
          setStatus('Setting up your profile...');
          
          // Check if user has completed their profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_profile_complete')
            .eq('id', session.user.id)
            .single();

          // Create profile if it doesn't exist (for Google sign-in)
          if (!profile && !profileError) {
            setStatus('Creating your profile...');
            
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: session.user.id,
                  full_name: session.user.user_metadata?.full_name || session.user.email,
                  email: session.user.email,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  is_profile_complete: false
                }
              ]);

            if (profileError) {
              console.error('Error creating profile:', profileError);
              setError('🔧 Failed to create profile. Please try again.');
              return;
            }
            
            // Redirect to profile completion for new users
            navigate('/profile-completion');
          } else if (profile?.is_profile_complete) {
            // Redirect to dashboard for existing users with complete profiles
            navigate('/dashboard');
          } else {
            // Redirect to profile completion for existing users with incomplete profiles
            navigate('/profile-completion');
          }
        } else {
          // No session, redirect to landing page
          setError('🔐 No authentication session found. Please try signing in again.');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        
        if (error.message.includes('Supabase not configured')) {
          setError('🔧 Authentication service not configured. Please check the setup guide.');
        } else {
          setError('🔧 Something went wrong during authentication. Please try again.');
        }
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{status}</h2>
        <p className="text-gray-600">Please wait while we set up your account...</p>
      </div>
    </div>
  );
};

export default AuthCallback; 