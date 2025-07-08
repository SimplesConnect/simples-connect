// src/components/ProfileCompletion.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Check } from 'lucide-react';

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    bio: '',
    interests: [],
  });
  
  // For interests section
  const [interestInput, setInterestInput] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Popular interests suggestions
  const popularInterests = [
    'Travel', 'Cooking', 'Music', 'Hiking', 'Reading', 'Photography', 
    'Dancing', 'Sports', 'Art', 'Movies', 'Gaming', 'Yoga', 
    'Coffee', 'Wine', 'Fashion', 'Technology', 'Nature', 'Fitness',
    'Writing', 'Singing', 'Swimming', 'Running', 'Cycling', 'Meditation'
  ];

  const steps = [
    { label: 'About You', icon: '🦋' },
    { label: 'Your Story', icon: '💙' },
    { label: 'Interests', icon: '✨' },
    { label: 'Done!', icon: '🎉' },
  ];

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  // Add interest from input or suggestion
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

  // Remove interest
  const removeInterest = (interestToRemove) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter(interest => interest !== interestToRemove)
    });
  };

  // Handle interest input
  const handleInterestKeyPress = (e) => {
    if (e.key === 'Enter' && interestInput.trim()) {
      e.preventDefault();
      addInterest(interestInput);
    }
  };

  // Save profile function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // TODO: Save profile to Supabase
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to dashboard with success state
      navigate('/dashboard', { 
        state: { 
          profileCompleted: true,
          message: 'Profile saved successfully! Welcome to Simples Connect!' 
        }
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-simples-cloud via-simples-silver to-simples-light flex flex-col items-center px-2 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 mt-8">
        {/* Stepper */}
        <div className="flex justify-between items-center mb-6">
          {steps.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full text-2xl font-bold
                ${i === step ? 'bg-simples-ocean text-white' : 'bg-simples-silver text-simples-ocean'}`}>
                {s.icon}
              </div>
              <span className={`text-xs mt-1 ${i === step ? 'text-simples-ocean font-bold' : 'text-simples-storm'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: About You */}
          {step === 0 && (
            <>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={profile.first_name}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-simples-silver mb-2"
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={profile.last_name}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-simples-silver mb-2"
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={profile.age}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-simples-silver mb-2"
                min={18}
                max={100}
                required
              />
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-simples-silver"
                required
              >
                <option value="">Select Gender</option>
                <option value="man">Man</option>
                <option value="woman">Woman</option>
                <option value="other">Other</option>
              </select>
            </>
          )}

          {/* Step 2: Your Story */}
          {step === 1 && (
            <textarea
              name="bio"
              placeholder="Tell us your story! (What makes you, you?)"
              value={profile.bio}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-simples-silver"
              rows={4}
              required
            />
          )}

          {/* Step 3: Interests */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    What are you passionate about?
                  </label>
                  <div className="text-sm text-gray-500">
                    {profile.interests.length}/3 minimum
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Profile completion</span>
                    <span>{Math.min(100, Math.round((profile.interests.length / 3) * 100))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        profile.interests.length >= 3 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(100, (profile.interests.length / 3) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Interest Input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Type an interest and press Enter"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyPress={handleInterestKeyPress}
                    className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => addInterest(interestInput)}
                    disabled={!interestInput.trim()}
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                {/* Selected Interests Chips */}
                {profile.interests.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Your interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
                        >
                          <span>{interest}</span>
                          <button
                            type="button"
                            onClick={() => removeInterest(interest)}
                            className="ml-1 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Interests Suggestions */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Popular interests:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularInterests
                      .filter(interest => !profile.interests.includes(interest))
                      .slice(0, 12)
                      .map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => addInterest(interest)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 border border-gray-300 transition-colors"
                        >
                          + {interest}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Minimum interests requirement */}
                {profile.interests.length < 3 && (
                  <p className="text-sm text-orange-600 mt-2">
                    Add at least 3 interests to help us find your perfect match!
                  </p>
                )}

                {/* Complete Profile Button - Show when user has enough interests */}
                {profile.interests.length >= 3 && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <p className="text-green-800 font-medium">Great! You're ready to complete your profile.</p>
                    </div>
                    <p className="text-sm text-green-700 mb-4">
                      You've added {profile.interests.length} interests. Click below to save your profile and start matching!
                    </p>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Check size={20} />
                      Complete Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {step === 3 && (
            <div className="text-center">
              <div className="text-5xl mb-2">🎉</div>
              <div className="text-lg text-simples-ocean font-bold mb-2">You're all set!</div>
              <div className="text-simples-storm mb-4">Ready to find your butterflies and blues?</div>
              
              {/* Profile Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                <h3 className="font-semibold text-gray-800 mb-2">Profile Summary:</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
                  <p><strong>Age:</strong> {profile.age}</p>
                  <p><strong>Gender:</strong> {profile.gender}</p>
                  <p><strong>Interests:</strong> {profile.interests.join(', ')}</p>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-simples-ocean to-simples-sky text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving Profile...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Save Profile & Go to Dashboard
                  </>
                )}
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            {step > 0 && step < steps.length - 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-simples-silver text-simples-ocean px-4 py-2 rounded-lg font-semibold hover:bg-simples-cloud transition-colors"
              >
                Back
              </button>
            )}
            {step < steps.length - 2 && step !== 2 && (
              <button
                type="button"
                onClick={nextStep}
                className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-4 py-2 rounded-lg font-semibold ml-auto hover:opacity-90 transition-opacity"
              >
                Next
              </button>
            )}
            {/* Show a different message for interests step */}
            {step === 2 && profile.interests.length < 3 && (
              <div className="ml-auto text-right">
                <p className="text-sm text-orange-600 font-medium">
                  Add {3 - profile.interests.length} more interest{3 - profile.interests.length > 1 ? 's' : ''} to continue
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletion;