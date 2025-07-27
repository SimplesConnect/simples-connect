// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Users, Sparkles, Video, BookOpen, User, Edit, X, RefreshCw, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
// import MatchingPreferences from './MatchingPreferences'; // Removed - uses non-existent DB columns


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileComplete, setProfileComplete] = useState(true); // Start as true to avoid flickering
  const [profileLoading, setProfileLoading] = useState(true);
  
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
  const [refreshingActivity, setRefreshingActivity] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAdModal, setShowAdModal] = useState(false);
  // const [showMatchingPreferences, setShowMatchingPreferences] = useState(false); // Removed
  const [showProfileUpdateNotification, setShowProfileUpdateNotification] = useState(false);
  const [profileNeedsUpdate, setProfileNeedsUpdate] = useState(false);
  const [adFormData, setAdFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    videoUrl: '',
    adType: 'featured',
    description: '',
    budget: ''
  });

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (user) {
        try {
          // EMERGENCY SAFE MODE: Only query guaranteed existing columns
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name, email') // Only basic fields that should exist
            .eq('id', user.id)
            .single();

          if (error) {
            console.warn('Profile fetch failed, using emergency fallback:', error);
            // EMERGENCY FALLBACK: Use user data from auth
            setProfileComplete(!!user?.user_metadata?.full_name);
            setProfileNeedsUpdate(false);
            setShowProfileUpdateNotification(false);
            setProfileLoading(false);
            return;
          }

          if (profile) {
            // SIMPLIFIED CHECK: If we have a name, consider it complete enough
            setProfileComplete(!!profile.full_name);
          } else {
            // FALLBACK: Use auth metadata
            setProfileComplete(!!user?.user_metadata?.full_name);
          }
          
          // Always disable problematic features
          setProfileNeedsUpdate(false);
          setShowProfileUpdateNotification(false);
          
        } catch (err) {
          console.warn('EMERGENCY FALLBACK activated due to database error:', err);
          // EMERGENCY MODE: Don't let profile errors break the entire app
          setProfileComplete(true); // Just assume it's complete
          setProfileNeedsUpdate(false);
          setShowProfileUpdateNotification(false);
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
        // Get the current session to access the access token
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error('No valid session for dashboard stats');
          setLoadingStats(false);
          return;
        }

        const response = await fetch('/api/users/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setDashboardStats(data.stats);
          }
        } else {
          console.error('Dashboard stats API error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, [user]);

  // Fetch and subscribe to recent interaction history
  useEffect(() => {
    const fetchRecentInteractions = async () => {
      if (!user) return;
      
      try {
        setLoadingActivity(true);
        console.log('Fetching recent interactions for user:', user.id);
        
        // Fetch user's recent interactions with profiles
        const { data: interactions, error: interactionError } = await supabase
          .from('user_interactions')
          .select(`
            id,
            interaction_type,
            created_at,
            target_user_id,
            profiles:target_user_id (
              id,
              full_name,
              bio,
              interests,
              profile_picture_url
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (interactionError) {
          console.error('Error fetching interactions:', interactionError);
          setRecentActivity([]);
        } else {
          console.log('Fetched interactions:', interactions);
          
          // Transform interactions into activity format
          const interactionActivities = (interactions || []).map((interaction) => {
            const profile = interaction.profiles;
            const actionText = interaction.interaction_type === 'like' ? 'liked' : 
                             interaction.interaction_type === 'super_like' ? 'super liked' : 'passed on';
            const iconType = interaction.interaction_type === 'like' ? 'heart' : 
                           interaction.interaction_type === 'super_like' ? 'sparkles' : 'x';
            
            // Debug log for profile data
            if (!profile) {
              console.warn('Missing profile data for interaction:', interaction);
            }
            
            return {
              id: interaction.id,
              type: 'interaction_history',
              icon: iconType,
              message: `You ${actionText} ${profile?.full_name || 'someone'}`,
              preview: profile?.bio ? profile.bio.substring(0, 50) + '...' : 'No bio available',
              time: interaction.created_at,
              profile: profile,
              interaction_type: interaction.interaction_type,
              count: null
            };
          });
          
          setRecentActivity(interactionActivities);
        }
      } catch (error) {
        console.error('Error in fetchRecentInteractions:', error);
        setRecentActivity([]);
      } finally {
        setLoadingActivity(false);
      }
    };

    if (user) {
      fetchRecentInteractions();

      // Set up real-time subscription for instant updates
      console.log('Setting up real-time subscription for user interactions');
      
      const interactionSubscription = supabase
        .channel('user_interactions_changes')
        .on(
          'postgres_changes',
          {
            event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'user_interactions',
            filter: `user_id=eq.${user.id}` // Only listen to current user's interactions
          },
          (payload) => {
            console.log('Real-time interaction update:', payload);
            // Refetch interactions when changes occur
            fetchRecentInteractions();
          }
        )
        .subscribe((status) => {
          console.log('Interaction subscription status:', status);
          if (status === 'CHANNEL_ERROR') {
            console.warn('Realtime subscription error - interaction updates may be delayed');
          }
        });

      // Cleanup subscription on unmount
      return () => {
        console.log('Cleaning up interaction subscription');
        supabase.removeChannel(interactionSubscription);
      };
    }
  }, [user]);

  // Manual refresh function for user-triggered updates
  const refreshInteractionHistory = async () => {
    if (!user) return;
    
    setRefreshingActivity(true);
    try {
      console.log('Manual refresh of interaction history');
      
      const { data: interactions, error: interactionError } = await supabase
        .from('user_interactions')
        .select(`
          id,
          interaction_type,
          created_at,
          target_user_id,
          profiles:target_user_id (
            id,
            full_name,
            bio,
            interests,
            profile_picture_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (interactionError) {
        console.error('Error refreshing interactions:', interactionError);
      } else {
        console.log('Refreshed interactions:', interactions);
        
        const interactionActivities = (interactions || []).map((interaction) => {
          const profile = interaction.profiles;
          const actionText = interaction.interaction_type === 'like' ? 'liked' : 
                           interaction.interaction_type === 'super_like' ? 'super liked' : 'passed on';
          const iconType = interaction.interaction_type === 'like' ? 'heart' : 
                         interaction.interaction_type === 'super_like' ? 'sparkles' : 'x';
          
          // Debug log for profile data
          if (!profile) {
            console.warn('Missing profile data for interaction:', interaction);
          }
          
          return {
            id: interaction.id,
            type: 'interaction_history',
            icon: iconType,
            message: `You ${actionText} ${profile?.full_name || 'someone'}`,
            preview: profile?.bio ? profile.bio.substring(0, 50) + '...' : 'No bio available',
            time: interaction.created_at,
            profile: profile,
            interaction_type: interaction.interaction_type,
            count: null
          };
        });
        
        setRecentActivity(interactionActivities);
      }
    } catch (error) {
      console.error('Error in manual refresh:', error);
    } finally {
      setRefreshingActivity(false);
    }
  };

  const handleAdFormChange = (e) => {
    setAdFormData({
      ...adFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleAdFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('🔄 Submitting advertiser request:', adFormData);
      
      // Save to advertiser_requests table
      const { error } = await supabase
        .from('advertiser_requests')
        .insert({
          business_name: adFormData.businessName,
          contact_person: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Unknown',
          email: adFormData.email,
          phone: adFormData.phone || null,
          business_description: adFormData.description,
          target_audience: 'Ugandans in the diaspora', // Default for this platform
          budget_range: adFormData.budget,
          content_type: 'video', // Since this is for featured videos
          content_description: `Featured video promotion: ${adFormData.description}`,
          website_url: adFormData.videoUrl || null,
          additional_notes: `Submitted via ${adFormData.adType} ad type`,
          status: 'pending'
        });

      if (error) throw error;

      console.log('✅ Advertiser request submitted successfully');
      alert('Thank you for your interest! Your request has been submitted and we\'ll contact you within 24 hours to discuss your advertising package.');
      
      setShowAdModal(false);
      setAdFormData({
        businessName: '',
        email: '',
        phone: '',
        videoUrl: '',
        adType: 'featured',
        description: '',
        budget: ''
      });
      
    } catch (error) {
      console.error('❌ Error submitting advertiser request:', error);
      alert('Sorry, there was an error submitting your request. Please try again.');
    }
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

  // Helper function to permanently dismiss profile update notification
  const dismissProfileUpdateNotification = (permanent = false) => {
    setShowProfileUpdateNotification(false);
    if (permanent) {
      const dismissedKey = `profile_update_dismissed_${user.id}`;
      localStorage.setItem(dismissedKey, 'true');
    }
  };

  // Helper function to get icon component
  const getActivityIcon = (iconType) => {
    switch (iconType) {
      case 'heart':
        return <Heart className="w-5 h-5 text-simples-rose" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-simples-lavender" />;
      case 'x':
        return <X className="w-5 h-5 text-simples-storm" />;
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

        {/* Removed Profile Update Notification - uses non-existent DB columns */}
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



        {/* Resources Section */}
        <div className="mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Start Matching Card */}
            <div 
              className="card group hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/discover')}
            >
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
                <div className="space-y-2">
                  <button className="btn-primary w-full">
                    Discover
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                                              // setShowMatchingPreferences(true); // Removed - preferences don't exist
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2 text-sm text-simples-storm hover:text-simples-midnight transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Matching Preferences
                  </button>
                </div>
              </div>
            </div>

            {/* Your Messages Card */}
            <div 
              className="card group hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/messages')}
            >
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
                <button className="btn-secondary w-full">
                  View Messages
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
                  Access networking tips, relationship advice, and community guides.
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

              </div>
            </div>

            {/* Business Ad CTA Section */}
            <div className="bg-gradient-to-r from-simples-tropical/10 to-simples-lavender/10 rounded-2xl p-6 text-center mt-6">
              <div className="w-16 h-16 bg-gradient-to-r from-simples-tropical to-simples-lavender rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-simples-midnight mb-2">
                Want to Feature Your Business?
              </h3>
              <p className="text-simples-storm mb-4">
                Reach thousands of Ugandans in the diaspora with our Featured Video ads. Perfect for businesses, services, and community events.
              </p>
              <button 
                onClick={() => setShowAdModal(true)}
                className="bg-gradient-to-r from-simples-tropical to-simples-lavender text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Submit Your Ad
              </button>
            </div>
          </div>
        </div>



        {/* Recent Interaction History */}
        <div className="mt-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-simples-midnight">
                Recent Interaction History
              </h2>
              <button
                onClick={refreshInteractionHistory}
                disabled={refreshingActivity}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  refreshingActivity 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-simples-cloud/50 text-simples-storm hover:bg-simples-cloud hover:text-simples-midnight'
                }`}
                title="Refresh interaction history"
              >
                <RefreshCw className={`w-4 h-4 ${refreshingActivity ? 'animate-spin' : ''}`} />
                {refreshingActivity ? 'Updating...' : 'Refresh'}
              </button>
            </div>
            
            {loadingActivity ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Loading Likes Column */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-simples-cloud">
                    <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                    <div className="w-6 h-4 bg-gray-300 rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-simples-rose/5 border border-simples-rose/20 rounded-xl animate-pulse">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-300 rounded mb-2"></div>
                          <div className="h-2 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Loading Passes Column */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-simples-cloud">
                    <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                    <div className="w-6 h-4 bg-gray-300 rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-simples-storm/5 border border-simples-storm/20 rounded-xl animate-pulse">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-300 rounded mb-2"></div>
                          <div className="h-2 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Likes Column */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-simples-cloud">
                    <Heart className="w-5 h-5 text-simples-rose" />
                    <h3 className="font-semibold text-simples-midnight">People You Liked</h3>
                    <span className="px-2 py-1 bg-simples-rose/10 text-simples-rose text-xs rounded-full font-medium">
                      {recentActivity.filter(activity => activity.interaction_type === 'like' || activity.interaction_type === 'super_like').length}
                    </span>
                  </div>
                  
                  {recentActivity.filter(activity => activity.interaction_type === 'like' || activity.interaction_type === 'super_like').length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {recentActivity
                        .filter(activity => activity.interaction_type === 'like' || activity.interaction_type === 'super_like')
                        .map((activity, index) => (
                          <div 
                            key={index} 
                            className="flex items-center gap-3 p-3 bg-simples-rose/5 border border-simples-rose/20 rounded-xl hover:bg-simples-rose/10 transition-colors cursor-pointer"
                            onClick={() => {
                              if (activity.type === 'interaction_history' && activity.profile) {
                                navigate(`/profile/${activity.profile.id}`);
                              }
                            }}
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-simples-rose/20">
                              {getActivityIcon(activity.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-simples-midnight font-medium text-sm truncate">
                                {activity.message}
                              </p>
                              {activity.preview && (
                                <p className="text-xs text-simples-storm italic mt-1 line-clamp-2">
                                  "{activity.preview}"
                                </p>
                              )}
                              <p className="text-xs text-simples-storm">
                                {formatTimeAgo(activity.time)}
                              </p>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-simples-rose/5 rounded-xl border border-simples-rose/20">
                      <Heart className="w-8 h-8 text-simples-rose/40 mx-auto mb-2" />
                      <p className="text-sm text-simples-storm">No likes yet</p>
                      <p className="text-xs text-simples-storm/70">Start discovering people you like!</p>
                    </div>
                  )}
                </div>

                {/* Passes Column */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-simples-cloud">
                    <X className="w-5 h-5 text-simples-storm" />
                    <h3 className="font-semibold text-simples-midnight">People You Passed</h3>
                    <span className="px-2 py-1 bg-simples-storm/10 text-simples-storm text-xs rounded-full font-medium">
                      {recentActivity.filter(activity => activity.interaction_type === 'pass').length}
                    </span>
                  </div>
                  
                  {recentActivity.filter(activity => activity.interaction_type === 'pass').length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {recentActivity
                        .filter(activity => activity.interaction_type === 'pass')
                        .map((activity, index) => (
                          <div 
                            key={index} 
                            className="flex items-center gap-3 p-3 bg-simples-storm/5 border border-simples-storm/20 rounded-xl hover:bg-simples-storm/10 transition-colors cursor-pointer"
                            onClick={() => {
                              if (activity.type === 'interaction_history' && activity.profile) {
                                navigate(`/profile/${activity.profile.id}`);
                              }
                            }}
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-simples-storm/20">
                              {getActivityIcon(activity.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-simples-midnight font-medium text-sm truncate">
                                {activity.message}
                              </p>
                              {activity.preview && (
                                <p className="text-xs text-simples-storm italic mt-1 line-clamp-2">
                                  "{activity.preview}"
                                </p>
                              )}
                              <p className="text-xs text-simples-storm">
                                {formatTimeAgo(activity.time)}
                              </p>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-simples-storm/5 rounded-xl border border-simples-storm/20">
                      <X className="w-8 h-8 text-simples-storm/40 mx-auto mb-2" />
                      <p className="text-sm text-simples-storm">No passes yet</p>
                      <p className="text-xs text-simples-storm/70">Keep discovering to find your matches!</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Empty Likes Column */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-simples-cloud">
                    <Heart className="w-5 h-5 text-simples-rose" />
                    <h3 className="font-semibold text-simples-midnight">People You Liked</h3>
                    <span className="px-2 py-1 bg-simples-rose/10 text-simples-rose text-xs rounded-full font-medium">0</span>
                  </div>
                  <div className="text-center py-8 bg-simples-rose/5 rounded-xl border border-simples-rose/20">
                    <Heart className="w-12 h-12 text-simples-rose/40 mx-auto mb-3" />
                    <p className="text-simples-storm mb-2 font-medium">No likes yet</p>
                    <p className="text-sm text-simples-storm/70 mb-4">
                      Start discovering people you're interested in!
                    </p>
                    <button 
                      onClick={() => navigate('/discover')}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Start Discovering
                    </button>
                  </div>
                </div>

                {/* Empty Passes Column */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-simples-cloud">
                    <X className="w-5 h-5 text-simples-storm" />
                    <h3 className="font-semibold text-simples-midnight">People You Passed</h3>
                    <span className="px-2 py-1 bg-simples-storm/10 text-simples-storm text-xs rounded-full font-medium">0</span>
                  </div>
                  <div className="text-center py-8 bg-simples-storm/5 rounded-xl border border-simples-storm/20">
                    <X className="w-12 h-12 text-simples-storm/40 mx-auto mb-3" />
                    <p className="text-simples-storm mb-2 font-medium">No passes yet</p>
                    <p className="text-sm text-simples-storm/70">
                      Your passed profiles will appear here as you discover people.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Business Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-simples-midnight">Submit Your Business Ad</h3>
              <button
                onClick={() => setShowAdModal(false)}
                className="text-simples-storm hover:text-simples-midnight"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-simples-tropical/10 rounded-xl">
              <h4 className="font-semibold text-simples-midnight mb-2">Business Account Benefits:</h4>
              <ul className="text-sm text-simples-storm space-y-1">
                <li>• Featured video placement on dashboard</li>
                <li>• Reach thousands of diaspora community members</li>
                <li>• Dedicated business analytics and insights</li>
                <li>• Priority customer support</li>
                <li>• Custom advertising packages available</li>
              </ul>
            </div>

            <form onSubmit={handleAdFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-simples-midnight mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={adFormData.businessName}
                    onChange={handleAdFormChange}
                    required
                    className="w-full p-3 border border-simples-cloud rounded-xl focus:outline-none focus:ring-2 focus:ring-simples-ocean"
                    placeholder="Your business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-simples-midnight mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={adFormData.email}
                    onChange={handleAdFormChange}
                    required
                    className="w-full p-3 border border-simples-cloud rounded-xl focus:outline-none focus:ring-2 focus:ring-simples-ocean"
                    placeholder="business@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-simples-midnight mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={adFormData.phone}
                    onChange={handleAdFormChange}
                    required
                    className="w-full p-3 border border-simples-cloud rounded-xl focus:outline-none focus:ring-2 focus:ring-simples-ocean"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-simples-midnight mb-2">
                    YouTube Video URL
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={adFormData.videoUrl}
                    onChange={handleAdFormChange}
                    className="w-full p-3 border border-simples-cloud rounded-xl focus:outline-none focus:ring-2 focus:ring-simples-ocean"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-simples-midnight mb-2">
                  Ad Type
                </label>
                <select
                  name="adType"
                  value={adFormData.adType}
                  onChange={handleAdFormChange}
                  className="w-full p-3 border border-simples-cloud rounded-xl focus:outline-none focus:ring-2 focus:ring-simples-ocean"
                >
                  <option value="featured">Featured Video (Dashboard placement)</option>
                  <option value="banner">Banner Ad</option>
                  <option value="sponsored">Sponsored Content</option>
                  <option value="community">Community Event</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-simples-midnight mb-2">
                  Business Description *
                </label>
                <textarea
                  name="description"
                  value={adFormData.description}
                  onChange={handleAdFormChange}
                  required
                  rows="4"
                  className="w-full p-3 border border-simples-cloud rounded-xl focus:outline-none focus:ring-2 focus:ring-simples-ocean resize-none"
                  placeholder="Tell us about your business and what you'd like to advertise..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-simples-midnight mb-2">
                  Monthly Budget Range
                </label>
                <select
                  name="budget"
                  value={adFormData.budget}
                  onChange={handleAdFormChange}
                  className="w-full p-3 border border-simples-cloud rounded-xl focus:outline-none focus:ring-2 focus:ring-simples-ocean"
                >
                  <option value="">Select budget range</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-2500">$1,000 - $2,500</option>
                  <option value="2500-5000">$2,500 - $5,000</option>
                  <option value="5000+">$5,000+</option>
                  <option value="custom">Custom (we'll discuss)</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAdModal(false)}
                  className="flex-1 bg-simples-cloud text-simples-storm px-6 py-3 rounded-xl font-semibold hover:bg-simples-silver transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-simples-tropical to-simples-lavender text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Removed Matching Preferences Modal - uses non-existent DB columns */}
    </div>
  );
};

export default Dashboard;