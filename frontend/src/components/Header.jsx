// src/components/common/Header.jsx
import React, { useState } from 'react';
import { Heart, MessageCircle, Settings, LogOut, Menu, X, User, Users, Calendar, Coffee, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Heart },
    { name: 'Discover', path: '/discover', icon: Heart },
    { name: 'Matches', path: '/matches', icon: Users },
    { name: 'Messages', path: '/messages', icon: MessageCircle },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Lounge', path: '/lounge', icon: Coffee },
    { name: 'Resources', path: '/resources', icon: BookOpen },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-white/50 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold gradient-text">
              Simples Connect
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2 text-simples-storm hover:text-simples-ocean transition-colors font-medium"
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </button>
              );
            })}

          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 hover:bg-simples-cloud/50 rounded-lg transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-simples-midnight">
                  {user?.user_metadata?.full_name || 'User'}
                </span>
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-simples-silver py-2">
                  <div className="px-4 py-2 border-b border-simples-silver">
                    <p className="text-sm font-medium text-simples-midnight">
                      {user?.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-simples-storm">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate(`/profile/${user.id}`);
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-simples-storm hover:bg-simples-cloud/50 transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/edit-profile');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-simples-storm hover:bg-simples-cloud/50 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-simples-storm hover:bg-simples-cloud/50 transition-colors"
                  >
                    Settings
                  </button>

                  <hr className="my-2 border-simples-silver" />
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-simples-storm hover:text-simples-ocean transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-simples-silver py-4">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-simples-storm hover:text-simples-ocean hover:bg-simples-cloud/50 rounded-lg transition-all text-left"
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </button>
                );
              })}
              
              <hr className="my-2 border-simples-silver" />
              
              <button
                onClick={() => {
                  navigate('/settings');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-simples-storm hover:text-simples-ocean hover:bg-simples-cloud/50 rounded-lg transition-all text-left"
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>
              
              <button
                onClick={() => {
                  navigate(`/profile/${user.id}`);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-simples-storm hover:text-simples-ocean hover:bg-simples-cloud/50 rounded-lg transition-all text-left"
              >
                <User className="w-5 h-5" />
                View Profile
              </button>
              
              <button
                onClick={() => {
                  navigate('/edit-profile');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-simples-storm hover:text-simples-ocean hover:bg-simples-cloud/50 rounded-lg transition-all text-left"
              >
                <User className="w-5 h-5" />
                Edit Profile
              </button>
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all text-left"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </nav>
            
            {/* User Info */}
            <div className="mt-4 pt-4 border-t border-simples-silver px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-simples-midnight">
                    {user?.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-simples-storm">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;