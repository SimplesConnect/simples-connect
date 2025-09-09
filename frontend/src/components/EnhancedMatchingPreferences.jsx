// Enhanced Matching Preferences Component
import React, { useState, useEffect } from 'react';
import { X, Check, Save, Settings, Target, MessageCircle, Globe, Zap, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const EnhancedMatchingPreferences = ({ onSave, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [matchingOptions, setMatchingOptions] = useState({});
  const [preferences, setPreferences] = useState({
    intentions: [],
    vibe: '',
    life_phase: '',
    communication_style: [],
    emotional_availability: '',
    region_preference: [],
    timezone_overlap_score: 5,
    value_alignment_score: 5
  });

  // Fetch current preferences and available options
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch matching options
        const { data: options, error: optionsError } = await supabase.rpc('get_matching_options');
        if (optionsError) throw optionsError;
        setMatchingOptions(options || {});

        // Fetch current user preferences
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('intentions, vibe, life_phase, communication_style, emotional_availability, region_preference, timezone_overlap_score, value_alignment_score')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') throw profileError;

        if (profile) {
          setPreferences({
            intentions: profile.intentions || [],
            vibe: profile.vibe || '',
            life_phase: profile.life_phase || '',
            communication_style: profile.communication_style || [],
            emotional_availability: profile.emotional_availability || '',
            region_preference: profile.region_preference || [],
            timezone_overlap_score: profile.timezone_overlap_score || 5,
            value_alignment_score: profile.value_alignment_score || 5
          });
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
        // Set fallback options
        setMatchingOptions({
          intentions: ['friendship', 'dating', 'networking', 'cultural_exchange', 'mentorship', 'business_partnership', 'travel_buddy', 'activity_partner'],
          vibes: ['deep', 'light', 'funny', 'quiet', 'adventurous', 'chill', 'intellectual', 'spiritual'],
          life_phases: ['student', 'new parent', 'relocating', 'hustle season', 'career transition', 'settling down', 'exploring', 'established'],
          communication_styles: ['text', 'voice', 'memes', 'long_chats', 'video_calls', 'voice_notes', 'emojis', 'formal'],
          emotional_availability: ['guarded', 'open', 'healing', 'selective', 'ready'],
          regions: ['north_america', 'europe', 'middle_east', 'australia', 'asia', 'africa', 'south_america']
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const toggleArrayItem = (field, item) => {
    setPreferences(prev => ({
      ...prev,
      [field]: prev[field].includes(item) 
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('profiles')
        .update(preferences)
        .eq('id', user.id);

      if (error) throw error;

      onSave?.(preferences);
      onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-simples-ocean mx-auto mb-4"></div>
            <p className="text-simples-storm">Loading your preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-simples-ocean" />
              <h2 className="text-2xl font-bold text-simples-midnight">Matching Preferences</h2>
            </div>
            <button
              onClick={onClose}
              className="text-simples-storm hover:text-simples-midnight transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-simples-storm mt-2">
            Fine-tune your matching preferences to find more compatible connections
          </p>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Intentions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-simples-ocean" />
              <h3 className="text-lg font-semibold text-simples-midnight">What are you looking for?</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {(matchingOptions.intentions || []).map((intention) => (
                <button
                  key={intention}
                  type="button"
                  onClick={() => toggleArrayItem('intentions', intention)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    preferences.intentions.includes(intention)
                      ? 'border-simples-ocean bg-simples-ocean/10 text-simples-ocean'
                      : 'border-simples-silver hover:border-simples-ocean/50 text-simples-storm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      preferences.intentions.includes(intention)
                        ? 'border-simples-ocean bg-simples-ocean'
                        : 'border-simples-silver'
                    }`}>
                      {preferences.intentions.includes(intention) && <Check size={12} className="text-white" />}
                    </div>
                    <span className="font-medium capitalize">{intention.replace('_', ' ')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Vibe */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-simples-ocean" />
              <h3 className="text-lg font-semibold text-simples-midnight">Your Vibe</h3>
            </div>
            <div className="space-y-2">
              {(matchingOptions.vibes || []).map((vibe) => (
                <button
                  key={vibe}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, vibe }))}
                  className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                    preferences.vibe === vibe
                      ? 'border-simples-ocean bg-simples-ocean/10 text-simples-ocean'
                      : 'border-simples-silver hover:border-simples-ocean/50 text-simples-storm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      preferences.vibe === vibe
                        ? 'border-simples-ocean bg-simples-ocean'
                        : 'border-simples-silver'
                    }`}>
                      {preferences.vibe === vibe && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="font-medium capitalize">{vibe}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Communication Style */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-simples-ocean" />
              <h3 className="text-lg font-semibold text-simples-midnight">Communication Style</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {(matchingOptions.communication_styles || []).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleArrayItem('communication_style', style)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    preferences.communication_style.includes(style)
                      ? 'border-simples-ocean bg-simples-ocean/10 text-simples-ocean'
                      : 'border-simples-silver hover:border-simples-ocean/50 text-simples-storm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      preferences.communication_style.includes(style)
                        ? 'border-simples-ocean bg-simples-ocean'
                        : 'border-simples-silver'
                    }`}>
                      {preferences.communication_style.includes(style) && <Check size={12} className="text-white" />}
                    </div>
                    <span className="font-medium capitalize">{style.replace('_', ' ')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-simples-silver text-simples-ocean py-3 rounded-xl font-semibold hover:bg-simples-cloud transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || preferences.intentions.length === 0}
              className="flex-1 bg-gradient-to-r from-simples-ocean to-simples-sky text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMatchingPreferences;
