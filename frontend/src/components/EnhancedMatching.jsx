// Enhanced Matching Component for Multi-Purpose Social Networking
import React, { useState, useEffect } from 'react';
import { Heart, Users, MessageCircle, Sparkles, Clock, MapPin, Target, Zap, X, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useEnhancedMatching } from '../hooks/useEnhancedMatching';

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

  // Use enhanced matching hook
  const {
    currentProfile: currentMatch,
    hasMoreProfiles,
    loading: matchingLoading,
    error: matchingError,
    handleLike: handleLikeAction,
    handlePass: handlePassAction,
    handleSuperLike: handleSuperLikeAction,
    fetchPotentialMatches,
    profilesRemaining
  } = useEnhancedMatching();

  // Override loading state
  useEffect(() => {
    setLoading(matchingLoading);
  }, [matchingLoading]);

  // Set potential matches from hook
  useEffect(() => {
    if (currentMatch) {
      setPotentialMatches([currentMatch]);
      setCurrentMatchIndex(0);
    } else {
      setPotentialMatches([]);
    }
  }, [currentMatch]);

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

  const handleLike = async () => {
    if (currentMatch) {
      setSwipeDirection('like');
      const result = await handleLikeAction(currentMatch.user_id);
      if (result.isMatch) {
        setSwipeDirection('match');
        setTimeout(() => setSwipeDirection(null), 2000);
      } else {
        setTimeout(() => setSwipeDirection(null), 300);
      }
    }
  };

  const handlePass = async () => {
    if (currentMatch) {
      setSwipeDirection('pass');
      await handlePassAction(currentMatch.user_id);
      setTimeout(() => setSwipeDirection(null), 300);
    }
  };

  const handleSuperLike = async () => {
    if (currentMatch) {
      setSwipeDirection('super');
      const result = await handleSuperLikeAction(currentMatch.user_id);
      if (result.isMatch) {
        setSwipeDirection('match');
        setTimeout(() => setSwipeDirection(null), 2000);
      } else {
        setTimeout(() => setSwipeDirection(null), 300);
      }
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
          <h1 className="text-2xl font-bold text-simples-midnight">Enhanced Discover</h1>
          <div className="text-sm text-simples-storm">
            {profilesRemaining} profiles remaining
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

            {/* Enhanced Profile Fields */}
            
            {/* Vibe & Life Phase */}
            <div className="mb-4 flex flex-wrap gap-2">
              {currentMatch.vibe && (
                <div className="flex items-center gap-1 px-3 py-1 bg-simples-sky/20 text-simples-sky rounded-full text-xs font-medium">
                  <Zap size={12} />
                  <span className="capitalize">{currentMatch.vibe}</span>
                </div>
              )}
              {currentMatch.life_phase && (
                <div className="flex items-center gap-1 px-3 py-1 bg-simples-lavender/20 text-simples-lavender rounded-full text-xs font-medium">
                  <Target size={12} />
                  <span className="capitalize">{currentMatch.life_phase.replace('_', ' ')}</span>
                </div>
              )}
              {currentMatch.emotional_availability && (
                <div className="flex items-center gap-1 px-3 py-1 bg-simples-rose/20 text-simples-rose rounded-full text-xs font-medium">
                  <Heart size={12} />
                  <span className="capitalize">{currentMatch.emotional_availability}</span>
                </div>
              )}
            </div>

            {/* Shared Intentions */}
            {currentMatch.shared_intentions && currentMatch.shared_intentions.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-simples-midnight mb-2 flex items-center gap-1">
                  <Target size={14} />
                  You both want:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentMatch.shared_intentions.map((intention) => (
                    <span key={intention} className="px-3 py-1 bg-gradient-to-r from-simples-ocean/20 to-simples-sky/20 text-simples-ocean rounded-full text-xs font-medium border border-simples-ocean/30">
                      {intention.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Shared Interests */}
            {currentMatch.shared_interests && currentMatch.shared_interests.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-simples-midnight mb-2 flex items-center gap-1">
                  <Sparkles size={14} />
                  Shared interests:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentMatch.shared_interests.map((interest) => (
                    <span key={interest} className="px-3 py-1 bg-simples-tropical/20 text-simples-tropical rounded-full text-xs font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Communication Style */}
            {currentMatch.communication_style && currentMatch.communication_style.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-simples-midnight mb-2 flex items-center gap-1">
                  <MessageCircle size={14} />
                  Communication style:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentMatch.communication_style.map((style) => (
                    <span key={style} className="px-3 py-1 bg-simples-silver text-simples-storm rounded-full text-xs font-medium">
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