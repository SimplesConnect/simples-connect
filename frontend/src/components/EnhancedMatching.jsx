// Enhanced Matching Component for Multi-Purpose Social Networking
import React, { useState, useEffect } from 'react';
import { Heart, Users, MessageCircle, Sparkles, Clock, MapPin, Target, Zap, X, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const EnhancedMatching = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [matchingOptions, setMatchingOptions] = useState({});
  
  // Fetch matching options from database
  useEffect(() => {
    const fetchMatchingOptions = async () => {
      try {
        const { data, error } = await supabase.rpc('get_matching_options');
        if (error) throw error;
        setMatchingOptions(data);
      } catch (error) {
        console.error('Error fetching matching options:', error);
      }
    };

    fetchMatchingOptions();
  }, []);

  // Fetch potential matches
  useEffect(() => {
    const fetchPotentialMatches = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        console.log('Fetching potential matches for user:', user.id);
        
        const { data: matches, error } = await supabase.rpc('find_potential_matches', {
          current_user_id: user.id,
          match_limit: 20
        });

        if (error) {
          console.error('Error fetching matches:', error);
          setPotentialMatches([]);
        } else {
          console.log('Fetched potential matches:', matches);
          setPotentialMatches(matches || []);
        }
      } catch (error) {
        console.error('Error in fetchPotentialMatches:', error);
        setPotentialMatches([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPotentialMatches();
    }
  }, [user]);

  // Handle swipe interactions
  const handleInteraction = async (targetUserId, interactionType) => {
    try {
      // Record interaction in database
      const { data: interaction, error: interactionError } = await supabase
        .from('user_interactions')
        .insert({
          user_id: user.id,
          target_user_id: targetUserId,
          interaction_type: interactionType
        })
        .select()
        .single();

      if (interactionError) {
        console.error('Error recording interaction:', interactionError);
        return;
      }

      console.log('Interaction recorded:', interaction);

      // Check for match if it's a like
      if (interactionType === 'like') {
        const { data: mutualLike } = await supabase
          .from('user_interactions')
          .select('*')
          .eq('user_id', targetUserId)
          .eq('target_user_id', user.id)
          .eq('interaction_type', 'like')
          .single();

        if (mutualLike) {
          // Create match
          const { data: newMatch, error: matchError } = await supabase
            .from('matches')
            .insert({
              user1_id: user.id < targetUserId ? user.id : targetUserId,
              user2_id: user.id < targetUserId ? targetUserId : user.id
            })
            .select()
            .single();

          if (!matchError) {
            console.log('Match created!', newMatch);
            // Show match notification
            setSwipeDirection('match');
            setTimeout(() => setSwipeDirection(null), 2000);
          }
        }
      }

      // Move to next match
      setCurrentMatchIndex(prev => prev + 1);
      
    } catch (error) {
      console.error('Error handling interaction:', error);
    }
  };

  const handleLike = () => {
    if (currentMatch) {
      setSwipeDirection('like');
      setTimeout(() => {
        handleInteraction(currentMatch.user_id, 'like');
        setSwipeDirection(null);
      }, 300);
    }
  };

  const handlePass = () => {
    if (currentMatch) {
      setSwipeDirection('pass');
      setTimeout(() => {
        handleInteraction(currentMatch.user_id, 'pass');
        setSwipeDirection(null);
      }, 300);
    }
  };

  const handleSuperLike = () => {
    if (currentMatch) {
      setSwipeDirection('super');
      setTimeout(() => {
        handleInteraction(currentMatch.user_id, 'super_like');
        setSwipeDirection(null);
      }, 300);
    }
  };

  const currentMatch = potentialMatches[currentMatchIndex];

  // Match score color helper
  const getMatchScoreColor = (score) => {
    if (score >= 60) return 'text-green-600 bg-green-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Match label color helper
  const getMatchLabelColor = (label) => {
    if (label === 'Great Fit') return 'text-green-600 bg-green-100';
    if (label === 'Worth Exploring') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-simples-cloud to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-simples-ocean mx-auto mb-4"></div>
          <p className="text-simples-storm">Finding your perfect connections...</p>
        </div>
      </div>
    );
  }

  if (!currentMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-simples-cloud to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Heart className="w-16 h-16 text-simples-storm mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-simples-midnight mb-4">No More Matches</h2>
          <p className="text-simples-storm mb-6">
            You've seen all available matches! Check back later for new connections or update your profile preferences.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-simples-cloud to-white">
      <div className="container mx-auto px-4 py-6 max-w-md">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-simples-midnight">Discover</h1>
          <div className="text-sm text-simples-storm">
            {currentMatchIndex + 1} of {potentialMatches.length}
          </div>
        </div>

        {/* Match Card */}
        <div className={`relative bg-white rounded-3xl shadow-lg overflow-hidden transition-transform duration-300 ${
          swipeDirection === 'like' ? 'transform rotate-12 translate-x-full' :
          swipeDirection === 'pass' ? 'transform -rotate-12 -translate-x-full' :
          swipeDirection === 'super' ? 'transform scale-105' :
          swipeDirection === 'match' ? 'transform scale-105 ring-4 ring-green-400' : ''
        }`}>
          
          {/* Profile Image */}
          <div className="relative h-96 bg-gradient-to-br from-simples-ocean to-simples-sky">
            {currentMatch.profile_picture_url ? (
              <img 
                src={currentMatch.profile_picture_url} 
                alt={currentMatch.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Users className="w-24 h-24 text-white" />
              </div>
            )}
            
            {/* Match Score Badge */}
            <div className="absolute top-4 right-4">
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${getMatchScoreColor(currentMatch.match_score)}`}>
                {currentMatch.match_score}% Match
              </div>
            </div>

            {/* Match Label */}
            <div className="absolute top-4 left-4">
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${getMatchLabelColor(currentMatch.match_label)}`}>
                {currentMatch.match_label}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-simples-midnight">
                {currentMatch.full_name}
              </h2>
              {currentMatch.location && (
                <div className="flex items-center gap-1 text-simples-storm mt-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{currentMatch.location}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {currentMatch.bio && (
              <p className="text-simples-storm mb-4 leading-relaxed">
                {currentMatch.bio}
              </p>
            )}

            {/* Connection Intentions */}
            {currentMatch.intentions && currentMatch.intentions.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-simples-midnight mb-2">Looking for:</h3>
                <div className="flex flex-wrap gap-2">
                  {currentMatch.intentions.map((intention) => (
                    <span key={intention} className="px-3 py-1 bg-simples-lavender/20 text-simples-lavender rounded-full text-xs font-medium capitalize">
                      {intention.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Vibe & Life Phase */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {currentMatch.vibe && (
                <div>
                  <h4 className="text-sm font-semibold text-simples-midnight mb-1">Vibe</h4>
                  <span className="px-3 py-1 bg-simples-tropical/20 text-simples-tropical rounded-full text-xs font-medium capitalize">
                    {currentMatch.vibe}
                  </span>
                </div>
              )}
              {currentMatch.life_phase && (
                <div>
                  <h4 className="text-sm font-semibold text-simples-midnight mb-1">Life Phase</h4>
                  <span className="px-3 py-1 bg-simples-rose/20 text-simples-rose rounded-full text-xs font-medium capitalize">
                    {currentMatch.life_phase.replace('_', ' ')}
                  </span>
                </div>
              )}
            </div>

            {/* Shared Interests */}
            {currentMatch.shared_interests && currentMatch.shared_interests.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-simples-midnight mb-2">Shared Interests:</h3>
                <div className="flex flex-wrap gap-2">
                  {currentMatch.shared_interests.map((interest) => (
                    <span key={interest} className="px-3 py-1 bg-simples-ocean/20 text-simples-ocean rounded-full text-xs font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Communication Style */}
            {currentMatch.communication_style && currentMatch.communication_style.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-simples-midnight mb-2">Communication:</h3>
                <div className="flex flex-wrap gap-2">
                  {currentMatch.communication_style.map((style) => (
                    <span key={style} className="px-3 py-1 bg-simples-sky/20 text-simples-sky rounded-full text-xs font-medium capitalize">
                      {style.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-6 mt-8">
          {/* Pass Button */}
          <button
            onClick={handlePass}
            className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-red-500 hover:shadow-xl transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Super Like Button */}
          <button
            onClick={handleSuperLike}
            className="w-12 h-12 bg-gradient-to-r from-simples-lavender to-simples-tropical rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-200"
          >
            <Star className="w-5 h-5" />
          </button>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className="w-14 h-14 bg-gradient-to-r from-simples-rose to-simples-tropical rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-200"
          >
            <Heart className="w-6 h-6" />
          </button>
        </div>

        {/* Match Notification */}
        {swipeDirection === 'match' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
              <div className="w-16 h-16 bg-gradient-to-r from-simples-rose to-simples-tropical rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-simples-midnight mb-2">It's a Match!</h3>
              <p className="text-simples-storm mb-4">
                You and {currentMatch.full_name} liked each other!
              </p>
              <button 
                onClick={() => navigate('/messages', {
                  state: {
                    selectedMatch: {
                      id: currentMatch.user_id,
                      matchId: null, // Will be resolved from the match that was just created
                      name: currentMatch.full_name,
                      photo: currentMatch.profile_picture_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=150&h=150&fit=crop',
                      userId: currentMatch.user_id,
                      otherUserId: currentMatch.user_id
                    }
                  }
                })}
                className="btn-primary w-full"
              >
                Send Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedMatching; 