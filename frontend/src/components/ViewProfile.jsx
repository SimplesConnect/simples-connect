import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Calendar, User, Edit, ArrowLeft, MessageCircle, Flag, Image as ImageIcon, Video as VideoIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const ViewProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  useEffect(() => {
    if (userId && user) {
      setIsOwnProfile(userId === user.id);
      fetchProfile();
    }
  }, [userId, user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      if (!profileData) {
        setError('Profile not found');
        return;
      }

      setProfile(profileData);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleSendMessage = () => {
    navigate('/messages', { 
      state: { 
        targetUserId: userId,
        targetUser: profile 
      } 
    });
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    alert('Report functionality will be implemented');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-simples-cloud via-simples-silver to-simples-light">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <p className="text-xl text-simples-ocean font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-simples-cloud via-simples-silver to-simples-light px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">😞</div>
          <h2 className="text-xl font-bold text-simples-ocean mb-2">Profile Not Found</h2>
          <p className="text-simples-storm mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-6 py-3 rounded-xl font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const profilePicture = profile.profile_picture_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=600&h=600&fit=crop&crop=face';
  const interests = Array.isArray(profile.interests) 
    ? profile.interests 
    : (typeof profile.interests === 'string' 
        ? profile.interests.split(',').map(i => i.trim()) 
        : []);

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

  const displayAge = getAgeFromBirthdate(profile.birthdate);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-simples-cloud via-simples-silver to-simples-light">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-simples-silver/50 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-simples-ocean hover:text-simples-midnight transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            {!isOwnProfile && (
              <>
                <button
                  onClick={handleSendMessage}
                  className="flex items-center gap-2 bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
                <button
                  onClick={handleReport}
                  className="p-2 text-simples-storm hover:text-simples-rose transition-colors"
                  title="Report user"
                >
                  <Flag className="w-5 h-5" />
                </button>
              </>
            )}
            
            {isOwnProfile && (
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-2 bg-simples-silver hover:bg-simples-cloud text-simples-ocean px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Cover Photo Section */}
          <div className="relative h-64 bg-gradient-to-br from-simples-ocean to-simples-sky">
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-8">
              <img
                src={profilePicture}
                alt={profile.full_name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=600&h=600&fit=crop&crop=face';
                }}
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            {/* Basic Info */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-simples-midnight mb-2">
                {profile.full_name}
                {displayAge && <span className="text-simples-storm">, {displayAge}</span>}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-simples-storm mb-4">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                {profile.gender && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span className="capitalize">{profile.gender}</span>
                  </div>
                )}
                
                {profile.created_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="bg-simples-cloud/30 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-simples-midnight mb-3">About</h3>
                  <p className="text-simples-storm leading-relaxed">{profile.bio}</p>
                </div>
              )}
            </div>

            {/* Interests */}
            {interests.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">Interests</h3>
                <div className="flex flex-wrap gap-3">
                  {interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-simples-ocean/10 to-simples-sky/10 text-simples-ocean px-4 py-2 rounded-full font-medium border border-simples-ocean/20"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Looking For */}
            {profile.looking_for && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">Looking For</h3>
                <div className="bg-simples-cloud/30 rounded-2xl p-4">
                  <span className="text-simples-storm capitalize">{profile.looking_for}</span>
                </div>
              </div>
            )}

            {/* Gallery */}
            {((profile.gallery_images && profile.gallery_images.length > 0) || profile.gallery_video) && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Gallery
                </h3>
                
                <div className="space-y-6">
                  {/* Gallery Images */}
                  {profile.gallery_images && profile.gallery_images.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-simples-midnight mb-3">Photos</h4>
                      
                      {profile.gallery_images.length === 1 ? (
                        // Single image display
                        <div className="relative">
                          <img
                            src={profile.gallery_images[0]}
                            alt="Gallery photo"
                            className="w-full max-w-2xl h-80 object-cover rounded-xl shadow-lg"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=800&h=600&fit=crop';
                            }}
                          />
                        </div>
                      ) : (
                        // Multiple images carousel
                        <div className="relative">
                          <div className="overflow-hidden rounded-xl shadow-lg">
                            <div 
                              className="flex transition-transform duration-300 ease-in-out"
                              style={{ transform: `translateX(-${currentGalleryIndex * 100}%)` }}
                            >
                              {profile.gallery_images.map((imageUrl, index) => (
                                <div key={index} className="w-full flex-shrink-0">
                                  <img
                                    src={imageUrl}
                                    alt={`Gallery photo ${index + 1}`}
                                    className="w-full max-w-2xl h-80 object-cover"
                                    onError={(e) => {
                                      e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=800&h=600&fit=crop';
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Carousel Controls */}
                          {profile.gallery_images.length > 1 && (
                            <>
                              <button
                                onClick={() => setCurrentGalleryIndex(prev => 
                                  prev === 0 ? profile.gallery_images.length - 1 : prev - 1
                                )}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </button>
                              
                              <button
                                onClick={() => setCurrentGalleryIndex(prev => 
                                  prev === profile.gallery_images.length - 1 ? 0 : prev + 1
                                )}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                              
                              {/* Dots indicator */}
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {profile.gallery_images.map((_, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setCurrentGalleryIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                      index === currentGalleryIndex 
                                        ? 'bg-white' 
                                        : 'bg-white/50'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Gallery Video */}
                  {profile.gallery_video && (
                    <div>
                      <h4 className="text-md font-medium text-simples-midnight mb-3 flex items-center gap-2">
                        <VideoIcon className="w-4 h-4" />
                        Video
                      </h4>
                      <div className="relative">
                        <video
                          src={profile.gallery_video}
                          controls
                          className="w-full max-w-2xl h-80 object-cover rounded-xl shadow-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Completion Status */}
            <div className="bg-gradient-to-r from-simples-ocean/5 to-simples-sky/5 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-simples-midnight mb-2">Profile Status</h3>
                  <p className="text-simples-storm">
                    {profile.is_profile_complete ? 
                      '✅ Profile is complete and visible to others' : 
                      '⚠️ Profile needs completion to be visible in matching'
                    }
                  </p>
                </div>
                {profile.is_profile_complete && (
                  <div className="w-16 h-16 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              
              {isOwnProfile && !profile.is_profile_complete && (
                <button
                  onClick={handleEditProfile}
                  className="mt-4 bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Complete Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile; 