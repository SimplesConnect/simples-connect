import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Bell, 
  Shield, 
  Eye, 
  MessageSquare, 
  Heart, 
  User, 
  Globe, 
  Smartphone,
  Mail,
  Volume2,
  Moon,
  Sun,
  Lock,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    whatsappNotifications: false,
    whatsappNumber: '',
    matchNotifications: true,
    messageNotifications: true,
    likeNotifications: true,
    soundEnabled: true,
    
    // Privacy Settings
    profileVisibility: 'public', // public, friends, private
    showOnlineStatus: true,
    showLastSeen: true,
    allowMessagesFrom: 'everyone', // everyone, matches, nobody
    showAge: true,
    showLocation: true,
    
    // App Settings
    theme: 'light', // light, dark, system
    language: 'en',
    autoDeleteMatches: false,
    autoDeleteDays: 30,
    
    // Matching Preferences
    maxDistance: 50,
    ageRangeMin: 18,
    ageRangeMax: 35,
    showMeIn: 'both' // men, women, both
  });

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

      if (settingsData) {
        setSettings(prev => ({
          ...prev,
          ...settingsData.settings
        }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Validate WhatsApp number if notifications are enabled
      if (settings.whatsappNotifications && !settings.whatsappNumber.trim()) {
        throw new Error('WhatsApp number is required when WhatsApp notifications are enabled');
      }

      const { error: upsertError } = await supabase
        .from('user_settings')
        .upsert(
          { 
            user_id: user.id, 
            settings: settings,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id' }
        );

      if (upsertError) throw upsertError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      
      // Delete user profile and related data
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (deleteError) throw deleteError;

      // Sign out and redirect
      await signOut();
      navigate('/');
      
    } catch (err) {
      console.error('Error deleting account:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading && settings.emailNotifications === undefined) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-simples-cloud via-simples-silver to-simples-light">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <p className="text-xl text-simples-ocean font-semibold">Loading settings...</p>
        </div>
      </div>
    );
  }

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
          
          <h1 className="text-xl font-bold text-simples-midnight">Settings</h1>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-800">✅ Settings saved successfully!</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800">❌ {error}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Notification Settings */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6 flex items-center gap-3">
              <Bell className="w-6 h-6" />
              Notification Settings
            </h2>
            
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-simples-ocean" />
                  <div>
                    <h3 className="font-semibold text-simples-midnight">Email Notifications</h3>
                    <p className="text-sm text-simples-storm">Receive notifications via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-simples-ocean/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-simples-ocean"></div>
                </label>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-simples-ocean" />
                  <div>
                    <h3 className="font-semibold text-simples-midnight">Push Notifications</h3>
                    <p className="text-sm text-simples-storm">Receive push notifications on your device</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-simples-ocean/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-simples-ocean"></div>
                </label>
              </div>

              {/* WhatsApp Notifications */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-simples-midnight">WhatsApp Notifications</h3>
                      <p className="text-sm text-simples-storm">Receive important notifications via WhatsApp</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.whatsappNotifications}
                      onChange={(e) => updateSetting('whatsappNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                
                {settings.whatsappNotifications && (
                  <div className="ml-8">
                    <label className="block text-sm font-medium text-simples-midnight mb-2">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      value={settings.whatsappNumber}
                      onChange={(e) => updateSetting('whatsappNumber', e.target.value)}
                      placeholder="+1234567890"
                      className="w-full max-w-xs p-3 border border-simples-silver rounded-lg focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                    />
                    <p className="text-xs text-simples-storm mt-1">Include country code (e.g., +1 for US)</p>
                  </div>
                )}
              </div>

              <hr className="border-simples-silver" />

              {/* Specific Notification Types */}
              <div className="space-y-4">
                <h4 className="font-semibold text-simples-midnight">Notification Types</h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-simples-rose" />
                      <span className="text-simples-midnight">Match Notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.matchNotifications}
                        onChange={(e) => updateSetting('matchNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-simples-ocean/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-simples-ocean"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-simples-ocean" />
                      <span className="text-simples-midnight">Message Notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.messageNotifications}
                        onChange={(e) => updateSetting('messageNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-simples-ocean/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-simples-ocean"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-simples-sky" />
                      <span className="text-simples-midnight">Like Notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.likeNotifications}
                        onChange={(e) => updateSetting('likeNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-simples-ocean/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-simples-ocean"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-simples-ocean" />
                      <span className="text-simples-midnight">Sound Effects</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.soundEnabled}
                        onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-simples-ocean/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-simples-ocean"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6" />
              Privacy & Safety
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-simples-midnight mb-2">
                  Profile Visibility
                </label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => updateSetting('profileVisibility', e.target.value)}
                  className="w-full p-3 border border-simples-silver rounded-lg focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                >
                  <option value="public">Public - Visible to everyone</option>
                  <option value="matches">Matches Only - Only visible to matches</option>
                  <option value="private">Private - Hidden from discovery</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-simples-midnight mb-2">
                  Allow Messages From
                </label>
                <select
                  value={settings.allowMessagesFrom}
                  onChange={(e) => updateSetting('allowMessagesFrom', e.target.value)}
                  className="w-full p-3 border border-simples-silver rounded-lg focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                >
                  <option value="everyone">Everyone</option>
                  <option value="matches">Matches Only</option>
                  <option value="nobody">Nobody</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-simples-midnight">Show Online Status</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showOnlineStatus}
                      onChange={(e) => updateSetting('showOnlineStatus', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-simples-ocean/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-simples-ocean"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-simples-midnight">Show Last Seen</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showLastSeen}
                      onChange={(e) => updateSetting('showLastSeen', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-simples-ocean/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-simples-ocean"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-simples-midnight">Show Age</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showAge}
                      onChange={(e) => updateSetting('showAge', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-simples-ocean/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-simples-ocean"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-simples-midnight">Show Location</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showLocation}
                      onChange={(e) => updateSetting('showLocation', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-simples-ocean/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-simples-ocean"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* App Preferences */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6 flex items-center gap-3">
              <Globe className="w-6 h-6" />
              App Preferences
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-simples-midnight mb-2">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => updateSetting('theme', e.target.value)}
                  className="w-full p-3 border border-simples-silver rounded-lg focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                  <option value="system">Follow System</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-simples-midnight mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value)}
                  className="w-full p-3 border border-simples-silver rounded-lg focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="pt">Português</option>
                </select>
              </div>
            </div>
          </div>

          {/* Matching Preferences */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6 flex items-center gap-3">
              <Heart className="w-6 h-6" />
              Matching Preferences
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-simples-midnight mb-2">
                  Maximum Distance: {settings.maxDistance} km
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={settings.maxDistance}
                  onChange={(e) => updateSetting('maxDistance', parseInt(e.target.value))}
                  className="w-full h-2 bg-simples-silver rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-simples-midnight mb-2">
                    Minimum Age: {settings.ageRangeMin}
                  </label>
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={settings.ageRangeMin}
                    onChange={(e) => updateSetting('ageRangeMin', parseInt(e.target.value))}
                    className="w-full h-2 bg-simples-silver rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-simples-midnight mb-2">
                    Maximum Age: {settings.ageRangeMax}
                  </label>
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={settings.ageRangeMax}
                    onChange={(e) => updateSetting('ageRangeMax', parseInt(e.target.value))}
                    className="w-full h-2 bg-simples-silver rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6 flex items-center gap-3">
              <Lock className="w-6 h-6" />
              Account Management
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-yellow-800">Auto-Delete Old Matches</h3>
                    <p className="text-sm text-yellow-700">Automatically remove inactive matches after specified days</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoDeleteMatches}
                    onChange={(e) => updateSetting('autoDeleteMatches', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                </label>
              </div>

              {settings.autoDeleteMatches && (
                <div className="ml-4">
                  <label className="block text-sm font-medium text-simples-midnight mb-2">
                    Delete after {settings.autoDeleteDays} days
                  </label>
                  <input
                    type="range"
                    min="7"
                    max="90"
                    value={settings.autoDeleteDays}
                    onChange={(e) => updateSetting('autoDeleteDays', parseInt(e.target.value))}
                    className="w-full max-w-xs h-2 bg-simples-silver rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}

              <hr className="border-simples-silver" />

              {/* Delete Account */}
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-center gap-3 mb-3">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-800">Delete Account</h3>
                </div>
                <p className="text-sm text-red-700 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving Settings...' : 'Save All Settings'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-simples-midnight mb-2">Delete Account?</h3>
              <p className="text-simples-storm mb-6">
                This will permanently delete your account, profile, matches, and messages. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-simples-silver hover:bg-simples-cloud text-simples-ocean px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 