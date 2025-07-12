import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const useMatching = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matches, setMatches] = useState([]);
  const [realtimeChannel, setRealtimeChannel] = useState(null);

  // API base URL - hardcoded to working Render backend
  const API_BASE_URL = 'https://simples-connect.onrender.com/api';

  // Get authentication headers
  const getAuthHeaders = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('🔐 No authentication token found. Please log in again.');
      }
      return {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      };
    } catch (err) {
      if (err.message.includes('Supabase not configured')) {
        throw new Error('🔧 Authentication service not configured. Please check your environment variables.');
      }
      throw err;
    }
  }, []);

  // Fetch potential matches using backend API
  const fetchPotentialMatches = useCallback(async () => {
    if (!user) {
      console.log('No user found, skipping fetch');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching potential matches for user:', user.id);

      const headers = await getAuthHeaders();
      // FIXED: updated endpoint to match other routes
      const response = await fetch(`${API_BASE_URL}/matching/discover`, {
        headers
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('🔐 Authentication expired. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('🚫 Access denied. Please check your account status.');
        } else if (response.status === 404) {
          throw new Error('🔍 Matching service not found. Please contact support.');
        } else if (response.status >= 500) {
          throw new Error('🔧 Server error. Please try again later.');
        }
        throw new Error(`❌ HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch potential matches');
      }

      console.log('Found potential matches:', data.matches?.length || 0);
      setProfiles(data.matches || []);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Error fetching potential matches:', err);
      
      // Provide more specific error messages
      if (err.message.includes('fetch')) {
        setError('🌐 Network error. Please check your connection and try again.');
      } else if (err.message.includes('configured')) {
        setError('🔧 Service not configured. Please check the setup guide.');
      } else {
        setError(err.message || '❌ Unable to load matches. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [user, getAuthHeaders]);

  // Handle like action using backend API
  const handleLike = useCallback(async (targetUserId) => {
    if (!user || !targetUserId) return { isMatch: false, matchData: null };

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/matching/interact`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          target_user_id: targetUserId,
          interaction_type: 'like'
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('🔐 Authentication expired. Please log in again.');
        } else if (response.status >= 500) {
          throw new Error('🔧 Server error. Please try again.');
        }
        throw new Error(`❌ HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to record like');
      }

      // Move to next profile
      setCurrentIndex(prev => prev + 1);

      // Return match information
      return {
        isMatch: data.is_match || false,
        matchData: data.match_data || null
      };
    } catch (err) {
      console.error('Error handling like:', err);
      setError(err.message || '❌ Unable to process like. Please try again.');
      return { isMatch: false, matchData: null };
    }
  }, [user, getAuthHeaders]);

  // Handle pass action using backend API
  const handlePass = useCallback(async (targetUserId) => {
    if (!user || !targetUserId) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/matching/interact`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          target_user_id: targetUserId,
          interaction_type: 'pass'
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('🔐 Authentication expired. Please log in again.');
        } else if (response.status >= 500) {
          throw new Error('🔧 Server error. Please try again.');
        }
        throw new Error(`❌ HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to record pass');
      }

      // Move to next profile
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error('Error handling pass:', err);
      setError(err.message || '❌ Unable to process pass. Please try again.');
    }
  }, [user, getAuthHeaders]);

  // Fetch user's matches using backend API
  const fetchMatches = useCallback(async () => {
    if (!user) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/matching/matches`, {
        headers
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('Authentication expired while fetching matches');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch matches');
      }

      setMatches(data.matches || []);
    } catch (err) {
      console.error('Error fetching matches:', err);
      // Don't set error for matches fetch as it's not critical
    }
  }, [user, getAuthHeaders]);

  // Set up real-time subscriptions with error handling
  useEffect(() => {
    if (!user) return;

    try {
      // Subscribe to new matches
      const channel = supabase
        .channel('matches_realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'matches',
            filter: `user1_id=eq.${user.id},user2_id=eq.${user.id}`
          },
          (payload) => {
            console.log('New match received!', payload);
            fetchMatches(); // Refresh matches when new match is created
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'user_interactions',
            filter: `target_user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Someone interacted with you!', payload);
            // You can add notifications here
          }
        )
        .subscribe();

      setRealtimeChannel(channel);

      // Cleanup on unmount
      return () => {
        if (channel) {
          channel.unsubscribe();
        }
      };
    } catch (err) {
      console.warn('Real-time subscriptions not available:', err);
      // Continue without real-time features
    }
  }, [user, fetchMatches]);

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchPotentialMatches();
      fetchMatches();
    }
  }, [user, fetchPotentialMatches, fetchMatches]);

  // Computed values
  const currentProfile = profiles[currentIndex] || null;
  const hasMoreProfiles = currentIndex < profiles.length;
  const profilesRemaining = Math.max(0, profiles.length - currentIndex);

  return {
    currentProfile,
    profiles,
    currentIndex,
    hasMoreProfiles,
    profilesRemaining,
    loading,
    error,
    matches,
    handleLike,
    handlePass,
    fetchPotentialMatches,
    fetchMatches
  };
};