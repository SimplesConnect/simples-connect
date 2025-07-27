// Matching Preferences Component for Enhanced Social Networking
import React, { useState, useEffect } from 'react';
import { Save, Heart, Users, MessageCircle, Globe, Clock, Zap, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const MatchingPreferences = ({ onSave, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    intentions: [],
    vibe: '',
    life_phase: '',
    timezone_overlap_score: 5,
    value_alignment_score: 5,
    communication_style: [],
    emotional_availability: '',
    region_preference: [],
    conversation_boundaries: ''
  });

  const matchingOptions = {
    intentions: [
      { value: 'friendship', label: 'Friendship', icon: Users, description: 'Building meaningful friendships' },
      { value: 'dating', label: 'Dating', icon: Heart, description: 'Romantic connections' },
      { value: 'networking', label: 'Networking', icon: Target, description: 'Professional connections' },
      { value: 'cultural_exchange', label: 'Cultural Exchange', icon: Globe, description: 'Sharing cultural experiences' },
      { value: 'mentorship', label: 'Mentorship', icon: Zap, description: 'Learning and teaching' },
      { value: 'business_partnership', label: 'Business', icon: Target, description: 'Business partnerships' },
      { value: 'travel_buddy', label: 'Travel', icon: Globe, description: 'Travel companions' },
      { value: 'activity_partner', label: 'Activities', icon: Users, description: 'Activity partners' }
    ],
    vibes: [
      { value: 'deep', label: 'Deep & Thoughtful', emoji: '🧠' },
      { value: 'light', label: 'Light & Fun', emoji: '✨' },
      { value: 'funny', label: 'Funny & Witty', emoji: '😄' },
      { value: 'quiet', label: 'Quiet & Peaceful', emoji: '🕯️' },
      { value: 'adventurous', label: 'Adventurous', emoji: '🚀' },
      { value: 'chill', label: 'Chill & Relaxed', emoji: '😌' },
      { value: 'intellectual', label: 'Intellectual', emoji: '📚' },
      { value: 'spiritual', label: 'Spiritual', emoji: '🙏' }
    ],
    life_phases: [
      { value: 'student', label: 'Student Life', emoji: '🎓' },
      { value: 'new_parent', label: 'New Parent', emoji: '👶' },
      { value: 'relocating', label: 'Relocating', emoji: '📦' },
      { value: 'hustle_season', label: 'Hustle Season', emoji: '💪' },
      { value: 'career_transition', label: 'Career Transition', emoji: '🔄' },
      { value: 'settling_down', label: 'Settling Down', emoji: '🏠' },
      { value: 'exploring', label: 'Exploring Life', emoji: '🌍' },
      { value: 'established', label: 'Established', emoji: '🌳' }
    ],
    communication_styles: [
      { value: 'text', label: 'Text Messages', emoji: '💬' },
      { value: 'voice', label: 'Voice Calls', emoji: '📞' },
      { value: 'video_calls', label: 'Video Calls', emoji: '📹' },
      { value: 'voice_notes', label: 'Voice Notes', emoji: '🎤' },
      { value: 'memes', label: 'Memes & GIFs', emoji: '😂' },
      { value: 'long_chats', label: 'Long Conversations', emoji: '💭' },
      { value: 'emojis', label: 'Emojis & Reactions', emoji: '👍' },
      { value: 'formal', label: 'Formal Communication', emoji: '📝' }
    ],
    emotional_availability: [
      { value: 'open', label: 'Open & Ready', emoji: '🤗', description: 'Ready for deep connections' },
      { value: 'selective', label: 'Selective', emoji: '🤔', description: 'Choosy about connections' },
      { value: 'healing', label: 'Healing Journey', emoji: '🌱', description: 'Working on personal growth' },
      { value: 'guarded', label: 'Guarded', emoji: '🛡️', description: 'Taking things slow' },
      { value: 'ready', label: 'Ready to Connect', emoji: '🚀', description: 'Excited for new connections' }
    ],
    regions: [
      { value: 'north_america', label: 'North America', emoji: '🇺🇸' },
      { value: 'europe', label: 'Europe', emoji: '🇪🇺' },
      { value: 'middle_east', label: 'Middle East', emoji: '🕌' },
      { value: 'australia', label: 'Australia/Oceania', emoji: '🇦🇺' },
      { value: 'asia', label: 'Asia', emoji: '🌏' },
      { value: 'africa', label: 'Africa', emoji: '🌍' },
      { value: 'south_america', label: 'South America', emoji: '🇧🇷' }
    ]
  };

  // Load existing preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select(`
            intentions, vibe, life_phase, timezone_overlap_score,
            value_alignment_score, communication_style, emotional_availability,
            region_preference, conversation_boundaries
          `)
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setPreferences({
            intentions: profile.intentions || [],
            vibe: profile.vibe || '',
            life_phase: profile.life_phase || '',
            timezone_overlap_score: profile.timezone_overlap_score || 5,
            value_alignment_score: profile.value_alignment_score || 5,
            communication_style: profile.communication_style || [],
            emotional_availability: profile.emotional_availability || '',
            region_preference: profile.region_preference || [],
            conversation_boundaries: profile.conversation_boundaries || ''
          });
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  const handleArrayToggle = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSingleSelect = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSliderChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: parseInt(value)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(preferences)
        .eq('id', user.id);

      if (error) throw error;

      console.log('Preferences saved successfully');
      if (onSave) onSave(preferences);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Error saving preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-simples-ocean mx-auto mb-4"></div>
            <p className="text-simples-storm">Loading your preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-simples-midnight">Matching Preferences</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-simples-storm mt-2">
            Help us find your perfect connections by sharing your preferences
          </p>
        </div>

        <div className="p-6 space-y-8">

          {/* Connection Intentions */}
          <div>
            <h3 className="text-lg font-semibold text-simples-midnight mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              What are you looking for? (Select all that apply)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matchingOptions.intentions.map((intention) => {
                const Icon = intention.icon;
                return (
                  <div
                    key={intention.value}
                    onClick={() => handleArrayToggle('intentions', intention.value)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      preferences.intentions.includes(intention.value)
                        ? 'border-simples-ocean bg-simples-ocean/10'
                        : 'border-gray-200 hover:border-simples-ocean/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-simples-ocean" />
                      <div>
                        <div className="font-medium">{intention.label}</div>
                        <div className="text-sm text-gray-600">{intention.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vibe Selection */}
          <div>
            <h3 className="text-lg font-semibold text-simples-midnight mb-4">
              What's your vibe?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {matchingOptions.vibes.map((vibe) => (
                <div
                  key={vibe.value}
                  onClick={() => handleSingleSelect('vibe', vibe.value)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                    preferences.vibe === vibe.value
                      ? 'border-simples-tropical bg-simples-tropical/10'
                      : 'border-gray-200 hover:border-simples-tropical/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{vibe.emoji}</div>
                  <div className="font-medium text-sm">{vibe.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Life Phase */}
          <div>
            <h3 className="text-lg font-semibold text-simples-midnight mb-4">
              Current life phase
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {matchingOptions.life_phases.map((phase) => (
                <div
                  key={phase.value}
                  onClick={() => handleSingleSelect('life_phase', phase.value)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                    preferences.life_phase === phase.value
                      ? 'border-simples-rose bg-simples-rose/10'
                      : 'border-gray-200 hover:border-simples-rose/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{phase.emoji}</div>
                  <div className="font-medium text-sm">{phase.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Communication Style */}
          <div>
            <h3 className="text-lg font-semibold text-simples-midnight mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              How do you like to communicate?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {matchingOptions.communication_styles.map((style) => (
                <div
                  key={style.value}
                  onClick={() => handleArrayToggle('communication_style', style.value)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                    preferences.communication_style.includes(style.value)
                      ? 'border-simples-sky bg-simples-sky/10'
                      : 'border-gray-200 hover:border-simples-sky/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{style.emoji}</div>
                  <div className="font-medium text-sm">{style.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Emotional Availability */}
          <div>
            <h3 className="text-lg font-semibold text-simples-midnight mb-4">
              Emotional availability
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matchingOptions.emotional_availability.map((emotional) => (
                <div
                  key={emotional.value}
                  onClick={() => handleSingleSelect('emotional_availability', emotional.value)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    preferences.emotional_availability === emotional.value
                      ? 'border-simples-lavender bg-simples-lavender/10'
                      : 'border-gray-200 hover:border-simples-lavender/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{emotional.emoji}</div>
                    <div>
                      <div className="font-medium">{emotional.label}</div>
                      <div className="text-sm text-gray-600">{emotional.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-simples-midnight mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Regional connections (optional)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {matchingOptions.regions.map((region) => (
                <div
                  key={region.value}
                  onClick={() => handleArrayToggle('region_preference', region.value)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                    preferences.region_preference.includes(region.value)
                      ? 'border-simples-ocean bg-simples-ocean/10'
                      : 'border-gray-200 hover:border-simples-ocean/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{region.emoji}</div>
                  <div className="font-medium text-sm">{region.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Score Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timezone Overlap Importance
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={preferences.timezone_overlap_score}
                  onChange={(e) => handleSliderChange('timezone_overlap_score', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Not Important</span>
                  <span className="font-semibold">{preferences.timezone_overlap_score}/10</span>
                  <span>Very Important</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Value Alignment Importance
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={preferences.value_alignment_score}
                  onChange={(e) => handleSliderChange('value_alignment_score', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Not Important</span>
                  <span className="font-semibold">{preferences.value_alignment_score}/10</span>
                  <span>Very Important</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conversation Boundaries */}
          <div>
            <h3 className="text-lg font-semibold text-simples-midnight mb-4">
              Conversation boundaries (optional)
            </h3>
            <textarea
              value={preferences.conversation_boundaries}
              onChange={(e) => setPreferences(prev => ({ ...prev, conversation_boundaries: e.target.value }))}
              placeholder="e.g., 'I prefer to keep conversations light and positive' or 'I'm comfortable discussing deeper topics'"
              className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
              rows="3"
            />
          </div>

        </div>

        {/* Save Button */}
        <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-2xl">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all ${
              saving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-simples-ocean to-simples-sky text-white hover:shadow-lg'
            }`}
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchingPreferences; 