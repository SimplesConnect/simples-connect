import React from 'react';
import { ArrowLeft, User, Camera, Heart, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowToSetUpProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-simples-cloud to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/resources')}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </button>
          <div className="max-w-4xl">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold mb-4">
              🟢 Getting Started
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              How to Set Up a Profile That Gets Attention
            </h1>
            <p className="text-xl opacity-90 mb-4">
              Essential tips for creating an authentic profile that represents the real you while attracting meaningful connections.
            </p>
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span>5 min read</span>
              <span>•</span>
              <span>December 28, 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <p className="text-lg text-simples-storm leading-relaxed mb-6">
                Your profile is your digital handshake on Simples Connect. It's the first impression that determines whether someone wants to know more about you or keeps scrolling. For Ugandans in the diaspora, creating an authentic profile that honors your culture while showcasing your personality can feel challenging—but it doesn't have to be.
              </p>
              <p className="text-lg text-simples-storm leading-relaxed">
                Let's walk through how to create a profile that attracts the right people and reflects the amazing person you are.
              </p>
            </div>

            {/* Section 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Camera className="w-8 h-8 text-green-600" />
                <h2 className="text-2xl font-bold text-simples-midnight">Choose Photos That Tell Your Story</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-simples-midnight mb-4">Your Main Photo: Make It Count</h3>
              <p className="text-simples-storm mb-4">
                Your main photo is everything. Choose a recent, high-quality image where your face is clearly visible and you're smiling naturally. Avoid group photos—save those for later slots.
              </p>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Pro Tip</span>
                </div>
                <p className="text-green-700">
                  Natural lighting is your best friend. Take photos near a window during the day, or step outside for that perfect golden hour glow.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-simples-midnight mb-4">Show Your Personality</h3>
              <p className="text-simples-storm mb-4">
                Include 4-6 photos that showcase different aspects of your life:
              </p>
              <ul className="list-disc pl-6 text-simples-storm space-y-2 mb-6">
                <li><strong>A full-body photo:</strong> Shows your style and confidence</li>
                <li><strong>You doing something you love:</strong> Cooking, playing music, hiking, etc.</li>
                <li><strong>Cultural moments:</strong> Traditional wear, family gatherings, cultural events</li>
                <li><strong>Travel or adventure shots:</strong> Show your sense of exploration</li>
                <li><strong>With friends/family:</strong> Demonstrates your social connections (but make it clear which one is you!)</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-8 h-8 text-green-600" />
                <h2 className="text-2xl font-bold text-simples-midnight">Write a Bio That Draws People In</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-simples-midnight mb-4">Start with Who You Are</h3>
              <p className="text-simples-storm mb-4">
                Don't just list facts—tell a mini-story. Instead of "Engineer from Kampala," try "Engineer who still dreams in Luganda but codes in Python. Kampala-born, [Current City]-based."
              </p>

              <h3 className="text-xl font-semibold text-simples-midnight mb-4">Share Your Values and Interests</h3>
              <p className="text-simples-storm mb-4">
                What matters to you? Family? Faith? Building community? Mention these alongside your hobbies and interests.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-blue-900 mb-3">Example Bio:</h4>
                <p className="text-blue-800 italic">
                  "Software engineer by day, aspiring chef by night 👨‍🍳 Kampala-raised, Toronto-based. I make a mean matooke and can explain why pineapple belongs on pizza (fight me). Family-oriented, faith-driven, and always planning my next adventure back home. Looking for someone who gets why I call my mom every Sunday and doesn't mind me switching between three languages mid-conversation 😄"
                </p>
              </div>

              <h3 className="text-xl font-semibold text-simples-midnight mb-4">What You're Looking For</h3>
              <p className="text-simples-storm mb-4">
                Be honest about your intentions. Are you looking for something serious? Wanting to meet new friends? Building your professional network? Clarity attracts the right people.
              </p>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-8 h-8 text-green-600" />
                <h2 className="text-2xl font-bold text-simples-midnight">Embrace Your Cultural Identity</h2>
              </div>
              
              <p className="text-simples-storm mb-4">
                Your Ugandan heritage is part of what makes you unique. Don't hide it—celebrate it! This helps you connect with people who appreciate and understand your background.
              </p>

              <h3 className="text-xl font-semibold text-simples-midnight mb-4">Cultural Touchpoints to Consider</h3>
              <ul className="list-disc pl-6 text-simples-storm space-y-2 mb-6">
                <li>Mention your tribe or region if you're comfortable</li>
                <li>Share what you miss most about Uganda</li>
                <li>Talk about Ugandan traditions you maintain abroad</li>
                <li>Mention your language skills (English, Luganda, etc.)</li>
                <li>Reference cultural events you attend or organize</li>
              </ul>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Remember</span>
                </div>
                <p className="text-amber-700">
                  Authenticity attracts authenticity. The right person will love these details about you, not just tolerate them.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-simples-midnight mb-6">Common Mistakes to Avoid</h2>
              
              <div className="space-y-4">
                <div className="border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Being Too Generic</h4>
                  <p className="text-red-700 text-sm">
                    "I love traveling and trying new foods" could describe anyone. Be specific about where you've traveled or what foods you love.
                  </p>
                </div>
                
                <div className="border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Negative Language</h4>
                  <p className="text-red-700 text-sm">
                    Avoid "no hookups," "tired of games," or lists of what you don't want. Focus on what you do want instead.
                  </p>
                </div>
                
                <div className="border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Outdated Information</h4>
                  <p className="text-red-700 text-sm">
                    Keep your profile current. Update your job, location, and interests as they change.
                  </p>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Your Profile, Your Story</h2>
              <p className="text-lg opacity-90 mb-4">
                Creating an attractive profile isn't about being perfect—it's about being authentically you. Show your personality, embrace your heritage, and be clear about what you're looking for.
              </p>
              <p className="text-lg opacity-90">
                Remember: the goal isn't to attract everyone. It's to attract the right people who will appreciate the wonderful, complex, culturally-rich person you are.
              </p>
            </div>

            {/* Call to Action */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <h3 className="text-xl font-bold text-simples-midnight mb-4">Ready to Update Your Profile?</h3>
              <p className="text-simples-storm mb-6">
                Take these tips and make your profile shine. Your perfect connections are waiting to meet the real you.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Go to My Profile
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToSetUpProfile; 