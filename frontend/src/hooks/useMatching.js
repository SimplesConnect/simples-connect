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

  // API base URL - use relative URL to work with any port
  const API_BASE_URL = '/api';

  // Get authentication headers
  const getAuthHeaders = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No authentication token found');
    }
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    };
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
      const response = await fetch(`${API_BASE_URL}/matching/potential-matches`, {
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
      setError(err.message);
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
        throw new Error(`HTTP error! status: ${response.status}`);
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
      setError(err.message);
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to record pass');
      }

      // Move to next profile
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error('Error handling pass:', err);
      setError(err.message);
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch matches');
      }

      setMatches(data.matches || []);
    } catch (err) {
      console.error('Error fetching matches:', err);
    }
  }, [user, getAuthHeaders]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

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

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user, fetchMatches]);

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchPotentialMatches();
      fetchMatches();
    }
  }, [user, fetchPotentialMatches, fetchMatches]);

  const currentProfile = profiles[currentIndex] || null;
  const hasMoreProfiles = currentIndex < profiles.length;

  return {
    currentProfile,
    hasMoreProfiles,
    loading,
    error,
    matches,
    handleLike,
    handlePass,
    fetchPotentialMatches,
    fetchMatches,
    profilesRemaining: profiles.length - currentIndex
  };
}; 
