import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const useEnhancedMatching = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matches, setMatches] = useState([]);
  const [realtimeChannel, setRealtimeChannel] = useState(null);

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

  // Fetch potential matches using enhanced API
  const fetchPotentialMatches = useCallback(async () => {
    if (!user) {
      console.log('No user found, skipping fetch');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching enhanced matches for user:', user.id);

      // Use the enhanced matching function directly
      const { data: matches, error } = await supabase.rpc('find_potential_matches', {
        current_user_id: user.id,
        match_limit: 20
      });

      if (error) {
        console.error('Error fetching enhanced matches:', error);
        throw error;
      }

      console.log('Found enhanced matches:', matches?.length || 0);
      setProfiles(matches || []);
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
  }, [user]);

  // Handle like action with enhanced matching
  const handleLike = useCallback(async (targetUserId) => {
    if (!user || !targetUserId) return { isMatch: false, matchData: null };

    try {
      // Record interaction in database
      const { data: interaction, error: interactionError } = await supabase
        .from('user_interactions')
        .insert({
          user_id: user.id,
          target_user_id: targetUserId,
          interaction_type: 'like'
        })
        .select()
        .single();

      if (interactionError) {
        console.error('Error recording interaction:', interactionError);
        throw interactionError;
      }

      console.log('Interaction recorded:', interaction);

      // Check for match
      const { data: mutualLike } = await supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', targetUserId)
        .eq('target_user_id', user.id)
        .eq('interaction_type', 'like')
        .single();

      let isMatch = false;
      let matchData = null;

      if (mutualLike) {
        // Create match
        const { data: newMatch, error: matchError } = await supabase
          .from('matches')
          .insert({
            user1_id: user.id < targetUserId ? user.id : targetUserId,
            user2_id: user.id < targetUserId ? targetUserId : user.id
          })
          .select(`
            *,
            user1_profile:profiles!matches_user1_id_fkey(id, full_name, profile_picture_url),
            user2_profile:profiles!matches_user2_id_fkey(id, full_name, profile_picture_url)
          `)
          .single();

        if (!matchError) {
          console.log('Match created!', newMatch);
          isMatch = true;
          matchData = newMatch;
        }
      }

      // Move to next profile
      setCurrentIndex(prev => prev + 1);

      // Return match information
      return {
        isMatch,
        matchData
      };
    } catch (err) {
      console.error('Error handling like:', err);
      setError(err.message || '❌ Unable to process like. Please try again.');
      return { isMatch: false, matchData: null };
    }
  }, [user]);

  // Handle pass action
  const handlePass = useCallback(async (targetUserId) => {
    if (!user || !targetUserId) return;

    try {
      const { error } = await supabase
        .from('user_interactions')
        .insert({
          user_id: user.id,
          target_user_id: targetUserId,
          interaction_type: 'pass'
        });

      if (error) {
        console.error('Error recording pass:', error);
        throw error;
      }

      // Move to next profile
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error('Error handling pass:', err);
      setError(err.message || '❌ Unable to process pass. Please try again.');
    }
  }, [user]);

  // Handle super like action
  const handleSuperLike = useCallback(async (targetUserId) => {
    if (!user || !targetUserId) return { isMatch: false, matchData: null };

    try {
      // Record super like interaction
      const { data: interaction, error: interactionError } = await supabase
        .from('user_interactions')
        .insert({
          user_id: user.id,
          target_user_id: targetUserId,
          interaction_type: 'super_like'
        })
        .select()
        .single();

      if (interactionError) {
        console.error('Error recording super like:', interactionError);
        throw interactionError;
      }

      console.log('Super like recorded:', interaction);

      // Super likes create instant matches (for now)
      const { data: newMatch, error: matchError } = await supabase
        .from('matches')
        .insert({
          user1_id: user.id < targetUserId ? user.id : targetUserId,
          user2_id: user.id < targetUserId ? targetUserId : user.id
        })
        .select(`
          *,
          user1_profile:profiles!matches_user1_id_fkey(id, full_name, profile_picture_url),
          user2_profile:profiles!matches_user2_id_fkey(id, full_name, profile_picture_url)
        `)
        .single();

      let isMatch = false;
      let matchData = null;

      if (!matchError) {
        console.log('Super like match created!', newMatch);
        isMatch = true;
        matchData = newMatch;
      }

      // Move to next profile
      setCurrentIndex(prev => prev + 1);

      return {
        isMatch,
        matchData
      };
    } catch (err) {
      console.error('Error handling super like:', err);
      setError(err.message || '❌ Unable to process super like. Please try again.');
      return { isMatch: false, matchData: null };
    }
  }, [user]);

  // Fetch user's matches using enhanced API
  const fetchMatches = useCallback(async () => {
    if (!user) return;

    try {
      const { data: mutualMatches, error } = await supabase.rpc('find_mutual_matches', {
        current_user_id: user.id
      });

      if (error) {
        console.error('Error fetching mutual matches:', error);
        return;
      }

      setMatches(mutualMatches || []);
    } catch (err) {
      console.error('Error fetching matches:', err);
    }
  }, [user]);

  // Calculate match score between current user and target
  const calculateMatchScore = useCallback(async (targetUserId) => {
    if (!user || !targetUserId) return null;

    try {
      const { data: score, error } = await supabase.rpc('calculate_match_score', {
        current_user_id: user.id,
        target_user_id: targetUserId
      });

      if (error) {
        console.error('Error calculating match score:', error);
        return null;
      }

      return score;
    } catch (err) {
      console.error('Error calculating match score:', err);
      return null;
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    try {
      // Subscribe to new matches
      const channel = supabase
        .channel('enhanced_matches_realtime')
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
    handleSuperLike,
    fetchPotentialMatches,
    fetchMatches,
    calculateMatchScore
  };
};
