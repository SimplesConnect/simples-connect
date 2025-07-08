// src/components/RealMatchingComponent.jsx
import React, { useState } from 'react';
import { Heart, MapPin, Sparkles, RefreshCw, User, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMatching } from '../hooks/useMatching';
import MatchNotification from './MatchNotification';

const RealMatchingComponent = () => {
  const navigate = useNavigate();
  const {
    currentProfile,
    hasMoreProfiles,
    loading,
    error,
    handleLike,
    handlePass,
    fetchPotentialMatches,
    profilesRemaining
  } = useMatching();

  const [matchData, setMatchData] = useState(null);

  const handleLikeClick = async () => {
    if (currentProfile) {
      const result = await handleLike(currentProfile.id);
      if (result.isMatch && result.matchData) {
        setMatchData(result.matchData);
      }
    }
  };

  const handlePassClick = async () => {
    if (currentProfile) {
      await handlePass(currentProfile.id);
    }
  };

  const handleCloseMatchNotification = () => {
    setMatchData(null);
  };

  const handleSendMessage = (match) => {
    // Navigate to messages with the matched user
    navigate('/messages', { 
      state: { 
        selectedMatch: {
          id: match.id,
          matchId: match.id,
          name: match.other_user?.full_name || match.user1_profile?.full_name || match.user2_profile?.full_name,
          photo: match.other_user?.profile_picture_url || match.user1_profile?.profile_picture_url || match.user2_profile?.profile_picture_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=150&h=150&fit=crop',
          userId: match.other_user?.id || match.user1_profile?.id || match.user2_profile?.id
        }
      } 
    });
  };

  const handleRefresh = () => {
    fetchPotentialMatches();
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-br from-simples-cloud via-simples-silver to-simples-light px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-xl text-simples-ocean font-semibold mb-2">Finding your perfect matches...</p>
          <p className="text-simples-storm">Please wait while we discover amazing people for you! 💙</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-br from-simples-cloud via-simples-silver to-simples-light px-4">
        <div className="text-center">
          <div className="text-4xl mb-4 text-simples-rose">😞</div>
          <div className="text-xl font-bold text-simples-ocean mb-2">Oops! Something went wrong</div>
          <div className="text-simples-storm mb-6">{error}</div>
          <button
            className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentProfile || !hasMoreProfiles) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-br from-simples-cloud via-simples-silver to-simples-light px-4">
        <div className="text-center">
          <div className="text-6xl mb-6 text-simples-ocean">🎉</div>
          <div className="text-2xl font-bold text-simples-ocean mb-3">You're all caught up!</div>
          <div className="text-simples-storm mb-8 max-w-md">
            No more potential matches right now. Check back later for more amazing people, or try expanding your preferences!
          </div>
          <button
            className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all mb-4"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-5 h-5 inline mr-2" />
            Look for New Matches
          </button>
          <p className="text-sm text-simples-storm">
            💡 Tip: Complete your profile and be active to discover more people!
          </p>
        </div>
      </div>
    );
  }

  const profilePicture = currentProfile.profile_picture_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=400&h=400&fit=crop&crop=face';
  const interests = Array.isArray(currentProfile.interests) 
    ? currentProfile.interests 
    : (typeof currentProfile.interests === 'string' 
        ? currentProfile.interests.split(',').map(i => i.trim()) 
        : []);

  // Calculate age from birthdate
  const getAgeFromBirthdate = (birthdate) => {
    if (!birthdate) return null;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const displayAge = getAgeFromBirthdate(currentProfile.birthdate);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-br from-simples-cloud via-simples-silver to-simples-light px-4 py-6">
      {/* Profiles remaining indicator */}
      <div className="mb-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
          <Sparkles className="w-4 h-4 text-simples-ocean" />
          <span className="text-sm font-medium text-simples-midnight">
            {profilesRemaining} potential matches remaining
          </span>
        </div>
      </div>

      {/* Profile Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Profile Image */}
        <div className="relative h-96 bg-gradient-to-br from-simples-cloud to-simples-silver">
          <img
            src={profilePicture}
            alt={currentProfile.full_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=400&h=400&fit=crop&crop=face';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Basic Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-2xl font-bold mb-1">
              {currentProfile.full_name}{displayAge && `, ${displayAge}`}
            </h2>
            {currentProfile.location && (
              <div className="flex items-center gap-1 text-white/90">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{currentProfile.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          {/* Bio */}
          {currentProfile.bio && (
            <div className="mb-4">
              <p className="text-simples-storm text-center leading-relaxed">
                "{currentProfile.bio}"
              </p>
            </div>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {interests.slice(0, 6).map((interest, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-simples-ocean/10 to-simples-sky/10 text-simples-ocean px-3 py-1 rounded-full text-sm font-medium border border-simples-ocean/20"
                  >
                    {interest}
                  </span>
                ))}
                {interests.length > 6 && (
                  <span className="bg-simples-cloud text-simples-storm px-3 py-1 rounded-full text-sm">
                    +{interests.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              className="flex-1 bg-simples-silver hover:bg-simples-cloud text-simples-ocean px-6 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
              onClick={handlePassClick}
            >
              Pass
            </button>
            <button
              className="bg-simples-cloud hover:bg-simples-silver text-simples-ocean px-4 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center"
              onClick={() => navigate(`/profile/${currentProfile.id}`)}
              title="View full profile"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              className="flex-1 bg-gradient-to-r from-simples-ocean to-simples-sky hover:from-simples-ocean/90 hover:to-simples-sky/90 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
              onClick={handleLikeClick}
            >
              <Heart className="w-5 h-5" />
              Like
            </button>
          </div>

          {/* Additional Info */}
          {(currentProfile.gender || currentProfile.looking_for) && (
            <div className="mt-4 pt-4 border-t border-simples-silver/50">
              <div className="flex justify-center gap-6 text-sm text-simples-storm">
                {currentProfile.gender && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span className="capitalize">{currentProfile.gender}</span>
                  </div>
                )}
                {currentProfile.looking_for && (
                  <div>
                    <span>Looking for: </span>
                    <span className="capitalize font-medium">{currentProfile.looking_for}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute left-1/4 top-1/3 text-4xl animate-pulse select-none opacity-30" style={{color: "#3b82f6"}}>💙</div>
        <div className="absolute right-1/4 top-2/3 text-3xl animate-bounce select-none opacity-30" style={{color: "#8b5cf6"}}>🦋</div>
        <div className="absolute left-1/2 bottom-20 text-5xl animate-pulse select-none opacity-30" style={{color: "#06b6d4"}}>💙</div>
        <div className="absolute right-1/6 top-1/4 text-2xl animate-bounce select-none opacity-30" style={{color: "#f59e0b"}}>✨</div>
      </div>

      {/* Match Notification */}
      <MatchNotification
        match={matchData}
        onClose={handleCloseMatchNotification}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default RealMatchingComponent;