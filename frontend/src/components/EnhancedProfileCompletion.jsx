// Enhanced Profile Completion with Personality Matching
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Check, Heart, Users, Sparkles, Target, MessageCircle, Clock, Globe, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const EnhancedProfileCompletion = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [matchingOptions, setMatchingOptions] = useState({});
  const [profile, setProfile] = useState({
    // Basic info
    full_name: '',
    birthdate: '',
    bio: '',
    interests: [],
    location: '',
    gender: '',
    looking_for: '',
    
    // Enhanced matching fields
    intentions: [],
    vibe: '',
    life_phase: '',
    communication_style: [],
    emotional_availability: '',
    region_preference: [],
    timezone_overlap_score: 5,
    value_alignment_score: 5
  });
  
  const [interestInput, setInterestInput] = useState('');

  const steps = [
    { label: 'About You', icon: '👋', description: 'Basic information' },
    { label: 'Your Story', icon: '📖', description: 'Tell us about yourself' },
    { label: 'Interests', icon: '✨', description: 'What you love' },
    { label: 'Intentions', icon: '🎯', description: 'What you\'re looking for' },
    { label: 'Your Vibe', icon: '🌟', description: 'Your personality' },
    { label: 'Life Phase', icon: '🚀', description: 'Where you are now' },
    { label: 'Communication', icon: '💬', description: 'How you connect' },
    { label: 'Preferences', icon: '⚙️', description: 'Fine-tune matching' },
    { label: 'Done!', icon: '🎉', description: 'Ready to match!' }
  ];

  // Fetch matching options from database
  useEffect(() => {
    const fetchMatchingOptions = async () => {
      try {
        const { data, error } = await supabase.rpc('get_matching_options');
        if (error) throw error;
        setMatchingOptions(data || {});
      } catch (error) {
        console.error('Error fetching matching options:', error);
        // Fallback options
        setMatchingOptions({
          intentions: ['friendship', 'dating', 'networking', 'cultural_exchange', 'mentorship', 'business_partnership', 'travel_buddy', 'activity_partner'],
          vibes: ['deep', 'light', 'funny', 'quiet', 'adventurous', 'chill', 'intellectual', 'spiritual'],
          life_phases: ['student', 'new parent', 'relocating', 'hustle season', 'career transition', 'settling down', 'exploring', 'established'],
          communication_styles: ['text', 'voice', 'memes', 'long_chats', 'video_calls', 'voice_notes', 'emojis', 'formal'],
          emotional_availability: ['guarded', 'open', 'healing', 'selective', 'ready'],
          regions: ['north_america', 'europe', 'middle_east', 'australia', 'asia', 'africa', 'south_america']
        });
      }
    };

    fetchMatchingOptions();
  }, []);

  const popularInterests = [
    'Travel', 'Cooking', 'Music', 'Hiking', 'Reading', 'Photography', 
    'Dancing', 'Sports', 'Art', 'Movies', 'Gaming', 'Yoga', 
    'Coffee', 'Wine', 'Fashion', 'Technology', 'Nature', 'Fitness',
    'Writing', 'Singing', 'Swimming', 'Running', 'Cycling', 'Meditation'
  ];

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const addInterest = (interest) => {
    const trimmedInterest = interest.trim();
    if (trimmedInterest && !profile.interests.includes(trimmedInterest)) {
      setProfile({ 
        ...profile, 
        interests: [...profile.interests, trimmedInterest] 
      });
      setInterestInput('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter(interest => interest !== interestToRemove)
    });
  };

  const toggleArrayItem = (field, item) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].includes(item) 
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleInterestKeyPress = (e) => {
    if (e.key === 'Enter' && interestInput.trim()) {
      e.preventDefault();
      addInterest(interestInput);
    }
  };

  const calculateProgress = () => {
    return Math.round((step / (steps.length - 1)) * 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Validate required fields
      const requiredFields = ['full_name', 'birthdate', 'bio', 'gender', 'looking_for'];
      const hasRequiredFields = requiredFields.every(field => profile[field] && profile[field].toString().trim());
      const hasInterests = profile.interests && profile.interests.length >= 3;
      const hasIntentions = profile.intentions && profile.intentions.length > 0;
      
      if (!hasRequiredFields || !hasInterests || !hasIntentions) {
        throw new Error('Please complete all required fields');
      }

      // Validate age
      const today = new Date();
      const birthDate = new Date(profile.birthdate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        throw new Error('You must be at least 18 years old to use this service');
      }

      const isComplete = hasRequiredFields && hasInterests && hasIntentions;
      
      const updateData = {
        ...profile,
        is_profile_complete: isComplete,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(
          { id: user.id, ...updateData },
          { onConflict: 'id' }
        );

      if (error) throw error;

      // Navigate to dashboard with success state
      navigate('/dashboard', { 
        state: { 
          profileCompleted: true,
          message: 'Enhanced profile created! You\'ll get much better matches now!' 
        }
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(error.message || 'Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getVibeDescription = (vibe) => {
    const descriptions = {
      deep: 'Meaningful conversations and profound connections',
      light: 'Fun, easygoing, and positive vibes',
      funny: 'Love to laugh and make others smile',
      quiet: 'Thoughtful and introspective nature',
      adventurous: 'Always up for new experiences',
      chill: 'Relaxed and go-with-the-flow attitude',
      intellectual: 'Enjoy stimulating discussions and learning',
      spiritual: 'Value inner growth and mindfulness'
    };
    return descriptions[vibe] || '';
  };

  const getLifePhaseDescription = (phase) => {
    const descriptions = {
      student: 'Focusing on education and personal growth',
      'new parent': 'Navigating the journey of parenthood',
      relocating: 'Moving to a new place or settling in',
      'hustle season': 'Building career and chasing goals',
      'career transition': 'Changing paths or advancing professionally',
      'settling down': 'Looking for stability and long-term plans',
      exploring: 'Discovering new interests and possibilities',
      established: 'Comfortable and looking to share experiences'
    };
    return descriptions[phase] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-simples-cloud via-simples-silver to-simples-light flex flex-col items-center px-2 py-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 mt-4">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Profile completion</span>
            <span>{calculateProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-simples-ocean to-simples-sky transition-all duration-500"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Step Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{steps[step].icon}</div>
          <h2 className="text-3xl font-bold text-simples-midnight mb-2">{steps[step].label}</h2>
          <p className="text-simples-storm text-lg">{steps[step].description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  value={profile.full_name}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-simples-silver focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                  required
                />
                <input
                  type="date"
                  name="birthdate"
                  value={profile.birthdate}
                  onChange={handleChange}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  className="w-full p-4 rounded-xl border border-simples-silver focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-simples-silver focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="man">Man</option>
                  <option value="woman">Woman</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
                
                <select
                  name="looking_for"
                  value={profile.looking_for}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-simples-silver focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                  required
                >
                  <option value="">Looking For</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="everyone">Everyone</option>
                </select>
              </div>
              
              <input
                type="text"
                name="location"
                placeholder="Location (City, Country)"
                value={profile.location}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-simples-silver focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
              />
            </div>
          )}

          {/* Step 1: Bio */}
          {step === 1 && (
            <div>
              <textarea
                name="bio"
                placeholder="Tell us your story! What makes you unique? What are you passionate about?"
                value={profile.bio}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-simples-silver focus:ring-2 focus:ring-simples-ocean focus:border-transparent resize-none"
                rows={8}
                required
              />
              <p className="text-sm text-simples-storm mt-2">
                {profile.bio.length}/500 characters • Be authentic and let your personality shine!
              </p>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add an interest and press Enter"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyPress={handleInterestKeyPress}
                  className="flex-1 p-4 rounded-xl border border-simples-silver focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => addInterest(interestInput)}
                  disabled={!interestInput.trim()}
                  className="px-6 py-4 bg-gradient-to-r from-simples-ocean to-simples-sky text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Plus size={20} />
                </button>
              </div>

              {profile.interests.length > 0 && (
                <div className="space-y-3">
                  <p className="font-medium text-simples-midnight">Your interests ({profile.interests.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-simples-ocean/10 to-simples-sky/10 text-simples-ocean rounded-full font-medium border border-simples-ocean/20"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeInterest(interest)}
                          className="hover:bg-simples-ocean/20 rounded-full p-1 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <p className="font-medium text-simples-midnight">Popular interests:</p>
                <div className="flex flex-wrap gap-2">
                  {popularInterests
                    .filter(interest => !profile.interests.includes(interest))
                    .slice(0, 12)
                    .map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => addInterest(interest)}
                        className="px-3 py-2 bg-simples-silver hover:bg-simples-cloud text-simples-ocean rounded-full text-sm font-medium transition-colors"
                      >
                        + {interest}
                      </button>
                    ))}
                </div>
              </div>

              {profile.interests.length < 3 && (
                <p className="text-orange-600 font-medium">
                  Add at least 3 interests to help us find your perfect match! ({3 - profile.interests.length} more needed)
                </p>
              )}
            </div>
          )}

          {/* Step 3: Intentions */}
          {step === 3 && (
            <div className="space-y-6">
              <p className="text-simples-storm text-lg text-center mb-6">
                What are you looking for? Select all that apply:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {(matchingOptions.intentions || []).map((intention) => (
                  <button
                    key={intention}
                    type="button"
                    onClick={() => toggleArrayItem('intentions', intention)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      profile.intentions.includes(intention)
                        ? 'border-simples-ocean bg-simples-ocean/10 text-simples-ocean'
                        : 'border-simples-silver hover:border-simples-ocean/50 text-simples-storm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        profile.intentions.includes(intention)
                          ? 'border-simples-ocean bg-simples-ocean'
                          : 'border-simples-silver'
                      }`}>
                        {profile.intentions.includes(intention) && <Check size={14} className="text-white" />}
                      </div>
                      <span className="font-medium capitalize">{intention.replace('_', ' ')}</span>
                    </div>
                  </button>
                ))}
              </div>

              {profile.intentions.length === 0 && (
                <p className="text-orange-600 font-medium text-center">
                  Please select at least one intention to continue
                </p>
              )}
            </div>
          )}

          {/* Step 4: Vibe */}
          {step === 4 && (
            <div className="space-y-6">
              <p className="text-simples-storm text-lg text-center mb-6">
                What's your vibe? Choose the one that best describes you:
              </p>
              
              <div className="space-y-3">
                {(matchingOptions.vibes || []).map((vibe) => (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => setProfile(prev => ({ ...prev, vibe }))}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      profile.vibe === vibe
                        ? 'border-simples-ocean bg-simples-ocean/10 text-simples-ocean'
                        : 'border-simples-silver hover:border-simples-ocean/50 text-simples-storm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        profile.vibe === vibe
                          ? 'border-simples-ocean bg-simples-ocean'
                          : 'border-simples-silver'
                      }`}>
                        {profile.vibe === vibe && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                      <div>
                        <span className="font-medium capitalize">{vibe}</span>
                        <p className="text-sm text-simples-storm">{getVibeDescription(vibe)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Life Phase */}
          {step === 5 && (
            <div className="space-y-6">
              <p className="text-simples-storm text-lg text-center mb-6">
                Where are you in life right now?
              </p>
              
              <div className="space-y-3">
                {(matchingOptions.life_phases || []).map((phase) => (
                  <button
                    key={phase}
                    type="button"
                    onClick={() => setProfile(prev => ({ ...prev, life_phase: phase }))}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      profile.life_phase === phase
                        ? 'border-simples-ocean bg-simples-ocean/10 text-simples-ocean'
                        : 'border-simples-silver hover:border-simples-ocean/50 text-simples-storm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        profile.life_phase === phase
                          ? 'border-simples-ocean bg-simples-ocean'
                          : 'border-simples-silver'
                      }`}>
                        {profile.life_phase === phase && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                      <div>
                        <span className="font-medium capitalize">{phase.replace('_', ' ')}</span>
                        <p className="text-sm text-simples-storm">{getLifePhaseDescription(phase)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Communication Style */}
          {step === 6 && (
            <div className="space-y-6">
              <p className="text-simples-storm text-lg text-center mb-6">
                How do you like to communicate? Select all that apply:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {(matchingOptions.communication_styles || []).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => toggleArrayItem('communication_style', style)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      profile.communication_style.includes(style)
                        ? 'border-simples-ocean bg-simples-ocean/10 text-simples-ocean'
                        : 'border-simples-silver hover:border-simples-ocean/50 text-simples-storm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        profile.communication_style.includes(style)
                          ? 'border-simples-ocean bg-simples-ocean'
                          : 'border-simples-silver'
                      }`}>
                        {profile.communication_style.includes(style) && <Check size={14} className="text-white" />}
                      </div>
                      <span className="font-medium capitalize">{style.replace('_', ' ')}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Preferences */}
          {step === 7 && (
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-medium text-simples-midnight mb-4">
                  Emotional Availability
                </label>
                <div className="space-y-3">
                  {(matchingOptions.emotional_availability || []).map((availability) => (
                    <button
                      key={availability}
                      type="button"
                      onClick={() => setProfile(prev => ({ ...prev, emotional_availability: availability }))}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                        profile.emotional_availability === availability
                          ? 'border-simples-ocean bg-simples-ocean/10 text-simples-ocean'
                          : 'border-simples-silver hover:border-simples-ocean/50 text-simples-storm'
                      }`}
                    >
                      <span className="font-medium capitalize">{availability}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-simples-midnight mb-4">
                  Regional Preferences (Optional)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {(matchingOptions.regions || []).map((region) => (
                    <button
                      key={region}
                      type="button"
                      onClick={() => toggleArrayItem('region_preference', region)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        profile.region_preference.includes(region)
                          ? 'border-simples-ocean bg-simples-ocean/10 text-simples-ocean'
                          : 'border-simples-silver hover:border-simples-ocean/50 text-simples-storm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                          profile.region_preference.includes(region)
                            ? 'border-simples-ocean bg-simples-ocean'
                            : 'border-simples-silver'
                        }`}>
                          {profile.region_preference.includes(region) && <Check size={12} className="text-white" />}
                        </div>
                        <span className="font-medium capitalize">{region.replace('_', ' ')}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Done */}
          {step === 8 && (
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-simples-ocean mb-4">You're All Set!</h3>
              <p className="text-simples-storm text-lg mb-6">
                Your enhanced profile will help us find your perfect matches based on deep compatibility!
              </p>
              
              <div className="bg-gradient-to-r from-simples-ocean/5 to-simples-sky/5 rounded-2xl p-6 text-left">
                <h4 className="font-bold text-simples-midnight mb-4">Your Profile Summary:</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {profile.full_name}</p>
                  <p><strong>Looking for:</strong> {profile.intentions.join(', ')}</p>
                  <p><strong>Vibe:</strong> {profile.vibe}</p>
                  <p><strong>Life Phase:</strong> {profile.life_phase}</p>
                  <p><strong>Interests:</strong> {profile.interests.slice(0, 5).join(', ')}{profile.interests.length > 5 ? '...' : ''}</p>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-simples-ocean to-simples-sky text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {saving ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Your Enhanced Profile...
                  </>
                ) : (
                  <>
                    <Sparkles size={24} />
                    Complete Profile & Start Matching!
                  </>
                )}
              </button>
            </div>
          )}

          {/* Navigation */}
          {step < steps.length - 1 && (
            <div className="flex justify-between items-center pt-6">
              {step > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-simples-silver text-simples-ocean px-6 py-3 rounded-xl font-medium hover:bg-simples-cloud transition-colors"
                >
                  Back
                </button>
              )}
              
              <div className="flex-1 text-center">
                <p className="text-sm text-simples-storm">
                  Step {step + 1} of {steps.length}
                </p>
              </div>
              
              {step < steps.length - 1 && (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (step === 0 && (!profile.full_name || !profile.birthdate || !profile.gender || !profile.looking_for)) ||
                    (step === 1 && !profile.bio.trim()) ||
                    (step === 2 && profile.interests.length < 3) ||
                    (step === 3 && profile.intentions.length === 0) ||
                    (step === 4 && !profile.vibe) ||
                    (step === 5 && !profile.life_phase) ||
                    (step === 6 && profile.communication_style.length === 0) ||
                    (step === 7 && !profile.emotional_availability)
                  }
                  className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EnhancedProfileCompletion;
