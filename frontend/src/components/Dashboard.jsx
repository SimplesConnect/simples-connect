// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Heart, Play, ThumbsUp, Share2, MessageCircle, Users, Sparkles, Video, Calendar, Coffee, BookOpen, User, Edit, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [likedVideo, setLikedVideo] = useState(false);
  const [profileComplete, setProfileComplete] = useState(true); // Start as true to avoid flickering
  const [profileLoading, setProfileLoading] = useState(true);
  const [videoStats, setVideoStats] = useState({
    likes: 1247,
    views: 15420,
    comments: 89
  });
  
  // New states for live data
  const [dashboardStats, setDashboardStats] = useState({
    newMatches: 0,
    messages: 0,
    likes: 0,
    superLikes: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_profile_complete, full_name, birthdate, bio, interests, gender, looking_for')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
            return;
          }

          if (profile) {
            // Check if all required fields are present
            const requiredFields = ['full_name', 'birthdate', 'bio', 'gender', 'looking_for'];
            const hasRequiredFields = requiredFields.every(field => profile[field] && profile[field].toString().trim());
            const hasInterests = profile.interests && (
              Array.isArray(profile.interests) ? profile.interests.length > 0 : 
              (typeof profile.interests === 'string' && profile.interests.trim().length > 0)
            );
            
            const isComplete = hasRequiredFields && hasInterests;
            setProfileComplete(isComplete);
          } else {
            setProfileComplete(false);
          }
        } catch (err) {
          console.error('Error checking profile completion:', err);
        } finally {
          setProfileLoading(false);
        }
      }
    };

    checkProfileCompletion();
  }, [user]);

  // Check for profile completion or subscription success message
  useEffect(() => {
    if (location.state?.profileCompleted && location.state?.message) {
      setSuccessMessage(location.state.message);
      setShowSuccessMessage(true);
      
      // Clear the location state to prevent showing message on refresh
      navigate(location.pathname, { replace: true });
      
      // Auto-hide message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
    

  }, [location.state, navigate, location.pathname]);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/users/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${user.access_token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setDashboardStats(data.stats);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, [user]);

  // Fetch recent activity
  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/users/recent-activity', {
          headers: {
            'Authorization': `Bearer ${user.access_token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setRecentActivity(data.activities);
          }
        }
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setLoadingActivity(false);
      }
    };

    fetchRecentActivity();
  }, [user]);

  const handleLikeVideo = () => {
    setLikedVideo(!likedVideo);
    setVideoStats(prev => ({
      ...prev,
      likes: likedVideo ? prev.likes - 1 : prev.likes + 1
    }));
  };

  // Helper function to format time
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  };

  // Helper function to get icon component
  const getActivityIcon = (iconType) => {
    switch (iconType) {
      case 'heart':
        return <Heart className="w-5 h-5 text-simples-rose" />;
      case 'users':
        return <Users className="w-5 h-5 text-simples-lavender" />;
      case 'message-circle':
        return <MessageCircle className="w-5 h-5 text-simples-tropical" />;
      default:
        return <Heart className="w-5 h-5 text-simples-rose" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <main className="px-4 md:px-6 py-6 max-w-6xl mx-auto">
        {/* Success Message Banner */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-green-800 font-medium">{successMessage}</p>
                <p className="text-sm text-green-600">Start exploring and find your perfect match!</p>
              </div>
            </div>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-simples-midnight">
                  Welcome back, {user?.user_metadata?.full_name || 'Friend'}! 💙
                </h1>
                <p className="text-simples-storm">Ready to find your perfect match today?</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div 
                className="text-center p-4 bg-simples-cloud/50 rounded-xl cursor-pointer hover:bg-simples-cloud/70 transition-colors"
                onClick={() => navigate('/matches')}
              >
                <Users className="w-6 h-6 text-simples-ocean mx-auto mb-2" />
                <p className="text-2xl font-bold text-simples-midnight">
                  {loadingStats ? '...' : dashboardStats.newMatches}
                </p>
                <p className="text-sm text-simples-storm">New Matches</p>
              </div>
              <div 
                className="text-center p-4 bg-simples-cloud/50 rounded-xl cursor-pointer hover:bg-simples-cloud/70 transition-colors"
                onClick={() => navigate('/messages')}
              >
                <MessageCircle className="w-6 h-6 text-simples-tropical mx-auto mb-2" />
                <p className="text-2xl font-bold text-simples-midnight">
                  {loadingStats ? '...' : dashboardStats.messages}
                </p>
                <p className="text-sm text-simples-storm">Messages</p>
              </div>
              <div 
                className="text-center p-4 bg-simples-cloud/50 rounded-xl cursor-pointer hover:bg-simples-cloud/70 transition-colors"
                onClick={() => navigate('/discover')}
              >
                <Heart className="w-6 h-6 text-simples-rose mx-auto mb-2" />
                <p className="text-2xl font-bold text-simples-midnight">
                  {loadingStats ? '...' : dashboardStats.likes}
                </p>
                <p className="text-sm text-simples-storm">Likes</p>
              </div>
              <div 
                className="text-center p-4 bg-simples-cloud/50 rounded-xl cursor-pointer hover:bg-simples-cloud/70 transition-colors"
                onClick={() => navigate('/discover')}
              >
                <Sparkles className="w-6 h-6 text-simples-lavender mx-auto mb-2" />
                <p className="text-2xl font-bold text-simples-midnight">
                  {loadingStats ? '...' : dashboardStats.superLikes}
                </p>
                <p className="text-sm text-simples-storm">Super Likes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion Reminder - Only show if profile is incomplete */}
        {!profileLoading && !profileComplete && (
          <div className="mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-simples-lavender to-simples-rose rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-simples-midnight mb-1">Complete Your Profile</h3>
                    <p className="text-simples-storm">Add more details to attract better matches and boost your visibility!</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/profile/${user.id}`)}
                    className="flex items-center gap-2 bg-simples-silver hover:bg-simples-cloud text-simples-ocean px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <User className="w-4 h-4" />
                    View Profile
                  </button>
                  <button
                    onClick={() => navigate('/edit-profile')}
                    className="flex items-center gap-2 bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Events, Lounge, Resources Section */}
        <div className="mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Events Card */}
            <div 
              className="card group hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/events')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-simples-midnight mb-2">
                  Events
                </h3>
                <p className="text-simples-storm mb-4">
                  Join exclusive events and meetups to connect with other singles.
                </p>
                <button className="btn-primary w-full">
                  View Events
                </button>
              </div>
            </div>

            {/* Lounge Card */}
            <div 
              className="card group hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/lounge')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-simples-tropical to-simples-lavender rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Coffee className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-simples-midnight mb-2">
                  Lounge
                </h3>
                <p className="text-simples-storm mb-4">
                  Discover music, share stories, and connect with the community.
                </p>
                <button className="btn-secondary w-full">
                  Enter Lounge
                </button>
              </div>
            </div>

            {/* Resources Card */}
            <div 
              className="card group hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/resources')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-simples-rose to-simples-sky rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-simples-midnight mb-2">
                  Resources
                </h3>
                <p className="text-simples-storm mb-4">
                  Access dating tips, relationship advice, and community guides.
                </p>
                <button className="btn-secondary w-full">
                  Browse Resources
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Ads Section */}
        <div className="mb-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Video className="w-6 h-6 text-simples-ocean" />
              <h2 className="text-xl md:text-2xl font-bold text-simples-midnight">
                Featured Content
              </h2>
            </div>

            {/* Main Video */}
            <div className="bg-black rounded-2xl overflow-hidden mb-6">
              <div className="relative aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/Wj5oH-Rxmis"
                  title="Featured Video"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              {/* Video Info */}
              <div className="p-4 bg-white">
                <h3 className="font-bold text-simples-midnight mb-2">
                  Finding Love in the Digital Age: A Ugandan Perspective
                </h3>
                <p className="text-simples-storm text-sm mb-4">
                  Discover how modern technology is bringing Ugandan hearts together across the globe. 
                  Learn about authentic connections and meaningful relationships in today's world.
                </p>
                
                {/* Video Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={handleLikeVideo}
                      className={`flex items-center gap-2 transition-colors ${
                        likedVideo 
                          ? 'text-simples-rose' 
                          : 'text-simples-storm hover:text-simples-rose'
                      }`}
                    >
                      <ThumbsUp className={`w-5 h-5 ${likedVideo ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{videoStats.likes}</span>
                    </button>
                    
                    <div className="flex items-center gap-2 text-simples-storm">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{videoStats.comments}</span>
                    </div>
                    
                    <button className="flex items-center gap-2 text-simples-storm hover:text-simples-ocean transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                  
                  <div className="text-sm text-simples-storm">
                    {videoStats.views.toLocaleString()} views
                  </div>
                </div>
              </div>
            </div>

            {/* Subscribe Section */}
            <div className="bg-gradient-to-r from-simples-ocean/10 to-simples-sky/10 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-simples-midnight mb-2">
                Love the Content?
              </h3>
              <p className="text-simples-storm mb-4">
                Subscribe to our channel for more dating tips, success stories, and relationship advice.
              </p>
              <button className="btn-primary">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Start Matching */}
          <div className="card group hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-simples-rose to-simples-lavender rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-simples-midnight mb-2">
                Start Matching
              </h3>
              <p className="text-simples-storm mb-4">
                Discover amazing people who share your interests and values.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/discover')}
                  className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <Heart className="w-4 h-4" />
                  Discover
                </button>
                <button 
                  onClick={() => navigate('/matches')}
                  className="bg-gradient-to-r from-simples-tropical to-simples-sky text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <Users className="w-4 h-4" />
                  My Matches
                </button>
              </div>
            </div>
          </div>

          {/* View Messages */}
          <div className="card group hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-simples-tropical to-simples-sky rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-simples-midnight mb-2">
                Your Messages
              </h3>
              <p className="text-simples-storm mb-4">
                Continue conversations with your matches and build connections.
              </p>
              <button 
                onClick={() => navigate('/messages')}
                className="btn-secondary w-full"
              >
                View Messages
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="card">
            <h2 className="text-xl font-bold text-simples-midnight mb-6">
              Recent Activity
            </h2>
            
            {loadingActivity ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-simples-cloud/30 rounded-xl animate-pulse">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-4 bg-simples-cloud/30 rounded-xl hover:bg-simples-cloud/50 transition-colors cursor-pointer"
                    onClick={() => {
                      // Handle click based on activity type
                      if (activity.type === 'message') {
                        navigate('/messages');
                      } else if (activity.type === 'matches') {
                        navigate('/matches');
                      } else if (activity.type === 'likes') {
                        navigate('/matches');
                      }
                    }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.icon === 'heart' ? 'bg-simples-rose/20' :
                      activity.icon === 'users' ? 'bg-simples-lavender/20' :
                      'bg-simples-tropical/20'
                    }`}>
                      {getActivityIcon(activity.icon)}
                    </div>
                    <div className="flex-1">
                      <p className="text-simples-midnight font-medium">
                        {activity.message}
                      </p>
                      {activity.preview && (
                        <p className="text-sm text-simples-storm italic mt-1">
                          "{activity.preview}"
                        </p>
                      )}
                      <p className="text-sm text-simples-storm">
                        {formatTimeAgo(activity.time)}
                      </p>
                    </div>
                    {activity.count && activity.count > 1 && (
                      <div className="w-6 h-6 bg-simples-ocean text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {activity.count}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-simples-cloud/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-simples-storm" />
                </div>
                <p className="text-simples-storm mb-2">No recent activity</p>
                <p className="text-sm text-simples-storm">
                  Start matching with people to see your activity here!
                </p>
                <button 
                  onClick={() => navigate('/discover')}
                  className="mt-4 btn-primary"
                >
                  Start Matching
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;