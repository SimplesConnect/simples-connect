import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Calendar, MapPin, Users, X, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const MatchesView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadMatches();
    loadStats();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      
      // Get the current session to get the access token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch('/api/matching/matches', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load matches');
      }

      const data = await response.json();
      setMatches(data.matches || []);
    } catch (error) {
      console.error('Error loading matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Get the current session to get the access token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/matching/stats', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleStartConversation = (match) => {
    // Navigate to messages with the match pre-selected
    navigate('/messages', { 
      state: { 
        selectedMatch: {
          id: match.id,
          matchId: match.id,
          name: match.other_user.full_name,
          photo: match.other_user.profile_picture_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=150&h=150&fit=crop',
          userId: match.other_user.id
        }
      }
    });
  };

  const handleUnmatch = async (matchId) => {
    if (!confirm('Are you sure you want to unmatch? This action cannot be undone.')) {
      return;
    }

    try {
      // Get the current session to get the access token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch('/api/matching/unmatch', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ match_id: matchId })
      });

      if (!response.ok) {
        throw new Error('Failed to unmatch');
      }

      // Remove the match from the list
      setMatches(prev => prev.filter(match => match.id !== matchId));
      setSelectedMatch(null);
    } catch (error) {
      console.error('Error unmatching:', error);
      alert('Failed to unmatch. Please try again.');
    }
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return 'Unknown';
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatMatchDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-simples-sky mx-auto mb-4"></div>
          <p className="text-simples-storm">Loading your matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-simples-silver">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-simples-midnight">Your Matches</h1>
                <p className="text-simples-storm mt-1">
                  {matches.length > 0 
                    ? `${matches.length} ${matches.length === 1 ? 'match' : 'matches'} found`
                    : 'No matches yet'
                  }
                </p>
              </div>
              {stats && (
                <div className="flex items-center gap-6 text-sm text-simples-storm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-simples-sky">{stats.matches}</div>
                    <div>Matches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-simples-tropical">{stats.likes_given}</div>
                    <div>Likes Given</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-simples-rose">{stats.likes_received}</div>
                    <div>Likes Received</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {matches.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-simples-storm mb-6">
              <Heart className="w-24 h-24 mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-2xl font-semibold text-simples-midnight mb-2">No matches yet</h3>
            <p className="text-simples-storm mb-8 max-w-md mx-auto">
              Start swiping to find your perfect match! The more you engage, the better your matches will be.
            </p>
            <button
              onClick={() => navigate('/matches')}
              className="bg-simples-sky text-white px-8 py-3 rounded-full hover:bg-simples-light-sky transition-colors font-medium"
            >
              Start Matching
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-2xl shadow-sm border border-simples-silver overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                {/* Profile Image */}
                <div className="relative">
                  <img
                    src={match.other_user.profile_picture_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=400&h=400&fit=crop'}
                    alt={match.other_user.full_name}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=400&h=400&fit=crop';
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-xs font-medium text-simples-midnight">
                      {formatMatchDate(match.created_at)}
                    </span>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-simples-midnight">
                      {match.other_user.full_name}
                    </h3>
                    <button
                      onClick={() => setSelectedMatch(match)}
                      className="text-simples-storm hover:text-simples-sky transition-colors"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {match.other_user.bio && (
                    <p className="text-sm text-simples-storm mb-3 line-clamp-2">
                      {match.other_user.bio}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartConversation(match)}
                      className="flex-1 bg-simples-sky text-white px-4 py-2 rounded-full hover:bg-simples-light-sky transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                    <button
                      onClick={() => handleUnmatch(match.id)}
                      className="px-4 py-2 border border-simples-silver text-simples-storm hover:bg-simples-cloud rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Match Details Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedMatch.other_user.profile_picture_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=400&h=400&fit=crop'}
                alt={selectedMatch.other_user.full_name}
                className="w-full h-64 object-cover rounded-t-2xl"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=400&h=400&fit=crop';
                }}
              />
              <button
                onClick={() => setSelectedMatch(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-simples-midnight">
                  {selectedMatch.other_user.full_name}
                </h2>
                <div className="text-simples-storm">
                  <Calendar className="w-5 h-5 inline mr-1" />
                  {calculateAge(selectedMatch.other_user.birthdate)}
                </div>
              </div>

              {selectedMatch.other_user.bio && (
                <div className="mb-4">
                  <h3 className="font-semibold text-simples-midnight mb-2">About</h3>
                  <p className="text-simples-storm">{selectedMatch.other_user.bio}</p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-simples-midnight mb-2">Matched</h3>
                <p className="text-simples-storm">{formatMatchDate(selectedMatch.created_at)}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedMatch(null);
                    handleStartConversation(selectedMatch);
                  }}
                  className="flex-1 bg-simples-sky text-white px-6 py-3 rounded-full hover:bg-simples-light-sky transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Conversation
                </button>
                <button
                  onClick={() => {
                    setSelectedMatch(null);
                    handleUnmatch(selectedMatch.id);
                  }}
                  className="px-6 py-3 border border-simples-silver text-simples-storm hover:bg-simples-cloud rounded-full transition-colors"
                >
                  Unmatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesView; 