// src/components/common/Header.jsx
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Settings, LogOut, Menu, X, User, Users, BookOpen, Bell, Camera, Search, LogIn, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, signOut } = useAuth();
  const { unreadCount } = useMessages();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Navigation items for authenticated users
  const authenticatedNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Heart },
    { name: 'Discover', path: '/discover', icon: Heart },
    { name: 'Matches', path: '/matches', icon: Users },
    { name: 'Resources', path: '/resources', icon: BookOpen },
  ];

  // Navigation items for non-authenticated users
  const publicNavItems = [
    { name: 'Resources', path: '/resources', icon: BookOpen },
  ];

  // Use appropriate nav items based on authentication status
  const mainNavItems = user ? authenticatedNavItems : publicNavItems;

  const isActivePath = (path) => location.pathname === path;

  // Check if user is admin
  const checkAdminStatus = async () => {
    if (user) {
      try {
        console.log('Checking admin status for user:', user.id, user.email);
        
        // Temporary: Auto-grant admin for presheja@gmail.com while database is being set up
        if (user.email === 'presheja@gmail.com') {
          console.log('Temporary admin access granted for presheja@gmail.com');
          setIsAdmin(true);
          return;
        }
        
        const { data: adminUser, error } = await supabase
          .from('admin_users')
          .select('admin_level, is_active')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        console.log('Admin check result:', { adminUser, error });
        
        if (adminUser && !error) {
          setIsAdmin(true);
          console.log('User is admin with level:', adminUser.admin_level);
        } else {
          setIsAdmin(false);
          console.log('User is not admin or error occurred:', error?.message);
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        // Fallback for presheja@gmail.com if database isn't ready
        if (user.email === 'presheja@gmail.com') {
          console.log('Fallback admin access for presheja@gmail.com');
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
    } else {
      setIsAdmin(false);
    }
  };

  // Fetch user profile data for profile picture
  const fetchUserProfile = async () => {
    if (user) {
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('full_name, profile_picture_url, email')
          .eq('id', user.id)
          .single();

        if (!error && profileData) {
          setUserProfile(profileData);
          setImageLoadError(false); // Reset image error when profile updates
        }
        
        // Also check admin status
        await checkAdminStatus();
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    } else {
      setUserProfile(null);
      setImageLoadError(false);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  // Force refresh admin status - for debugging
  const forceRefreshAdminStatus = async () => {
    console.log('Force refreshing admin status...');
    await checkAdminStatus();
  };

  // Listen for profile updates
  useEffect(() => {
    if (user) {
      const channel = supabase
        .channel('profile_changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`
          },
          () => {
            // Refresh profile data when it's updated
            fetchUserProfile();
          }
        )
        .subscribe((status) => {
          console.log('Profile subscription status:', status);
          if (status === 'CHANNEL_ERROR') {
            console.warn('Profile realtime subscription error - profile updates may be delayed');
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-simples-silver/50 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-simples-ocean to-simples-sky bg-clip-text text-transparent">
              Simples Connect
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-12">
            {mainNavItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`text-lg font-medium transition-all duration-300 hover:text-simples-ocean relative group py-2 ${
                  isActivePath(item.path) ? 'text-simples-ocean' : 'text-simples-storm'
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {/* Active indicator */}
                {isActivePath(item.path) && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full" />
                )}
                {/* Hover effect */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6">
            {/* Messages Icon - Only show for authenticated users */}
            {user && (
              <button
                onClick={() => navigate('/messages')}
                className={`relative p-3 rounded-xl transition-all duration-300 ${
                  isActivePath('/messages') 
                    ? 'bg-simples-ocean/20 text-simples-ocean' 
                    : 'text-simples-storm hover:text-simples-ocean hover:bg-simples-cloud/50'
                }`}
              >
                <MessageCircle className="w-6 h-6" />
                {/* Message notification badge */}
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-simples-rose rounded-full flex items-center justify-center px-1">
                    <span className="text-xs text-white font-bold">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  </div>
                )}
              </button>
            )}

            {/* User Profile - Only show for authenticated users */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-4 bg-white/80 hover:bg-white/90 px-4 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-simples-silver/50"
                >
                  {userProfile?.profile_picture_url && !imageLoadError ? (
                    <img
                      src={userProfile.profile_picture_url}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                      onError={() => setImageLoadError(true)}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="hidden md:inline font-medium text-simples-midnight">
                    {userProfile?.full_name || user?.user_metadata?.full_name || 'User'}
                  </span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-simples-silver/50 py-3 z-50">
                    <div className="px-4 py-3 border-b border-simples-silver/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-simples-midnight">
                            {userProfile?.full_name || user?.user_metadata?.full_name || 'User'}
                          </p>
                          <p className="text-sm text-simples-storm">{userProfile?.email || user?.email}</p>
                        </div>
                        {/* Debug controls - remove after testing */}
                        <div className="flex items-center gap-2">
                          {isAdmin && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                              ADMIN
                            </span>
                          )}
                          <button
                            onClick={forceRefreshAdminStatus}
                            className="text-xs text-gray-400 hover:text-gray-600 p-1"
                            title="Refresh admin status"
                          >
                            🔄
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigate('/edit-profile');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-simples-storm hover:text-simples-midnight hover:bg-simples-cloud/50 transition-all duration-200 flex items-center gap-3"
                    >
                      <Camera className="w-5 h-5" />
                      Change Photo
                    </button>
                    <button
                      onClick={() => {
                        navigate(`/profile/${user.id}`);
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-simples-storm hover:text-simples-midnight hover:bg-simples-cloud/50 transition-all duration-200 flex items-center gap-3"
                    >
                      <User className="w-5 h-5" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-simples-storm hover:text-simples-midnight hover:bg-simples-cloud/50 transition-all duration-200 flex items-center gap-3"
                    >
                      <Settings className="w-5 h-5" />
                      Settings
                    </button>
                    
                    {/* Admin Navigation - Only show for admin users */}
                    {isAdmin && (
                      <>
                        <div className="border-t border-simples-silver/50 my-2"></div>
                        <button
                          onClick={() => {
                            navigate('/admin');
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center gap-3 font-semibold rounded-lg mx-2"
                        >
                          <Shield className="w-5 h-5" />
                          Admin Dashboard
                        </button>
                        <div className="border-t border-simples-silver/50 my-2"></div>
                      </>
                    )}
                    
                    <button
                      onClick={() => {
                        navigate('/discover');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-simples-storm hover:text-simples-midnight hover:bg-simples-cloud/50 transition-all duration-200 flex items-center gap-3"
                    >
                      <Search className="w-5 h-5" />
                      Browse
                    </button>
                    <button
                      onClick={() => {
                        navigate('/matches');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-simples-storm hover:text-simples-midnight hover:bg-simples-cloud/50 transition-all duration-200 flex items-center gap-3"
                    >
                      <Users className="w-5 h-5" />
                      Matches
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-3"
                    >
                      <LogOut className="w-5 h-5" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Login button for non-authenticated users
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-3 bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <LogIn className="w-5 h-5" />
                <span className="hidden md:inline">Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-simples-storm hover:text-simples-ocean transition-colors p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-6 border-t border-simples-silver/50">
            {mainNavItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 py-4 font-medium transition-all duration-200 ${
                  isActivePath(item.path) ? 'text-simples-ocean' : 'text-simples-storm hover:text-simples-midnight'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </button>
            ))}
            
            {/* Show different mobile menu items based on authentication */}
            {user ? (
              <>
                <hr className="my-4 border-simples-silver/50" />
                <button
                  onClick={() => {
                    navigate('/messages');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 py-4 font-medium transition-all duration-200 ${
                    isActivePath('/messages') ? 'text-simples-ocean' : 'text-simples-storm hover:text-simples-midnight'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  Messages
                </button>
                <button
                  onClick={() => {
                    navigate('/edit-profile');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-4 py-4 text-simples-storm hover:text-simples-midnight transition-all duration-200 font-medium"
                >
                  <User className="w-5 h-5" />
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-4 py-4 text-simples-storm hover:text-simples-midnight transition-all duration-200 font-medium"
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-4 py-4 text-red-500 hover:text-red-600 transition-all duration-200 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <hr className="my-4 border-simples-silver/50" />
                <button
                  onClick={() => {
                    navigate('/');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-4 py-4 text-simples-ocean hover:text-simples-sky transition-all duration-200 font-medium"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;