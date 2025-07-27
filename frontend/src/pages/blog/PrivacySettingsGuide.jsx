import React from 'react';
import { ArrowLeft, Shield, Eye, EyeOff, Users, Lock, Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacySettingsGuide = () => {
  const navigate = useNavigate();

  const privacyLevels = [
    {
      level: "Public",
      icon: Users,
      description: "Anyone can see your profile and content",
      bestFor: "Building a wide network, promoting business",
      considerations: "Less privacy, more exposure"
    },
    {
      level: "Members Only", 
      icon: Eye,
      description: "Only registered users can see your profile",
      bestFor: "Connecting within the community while maintaining some privacy",
      considerations: "Balanced approach between privacy and accessibility"
    },
    {
      level: "Private",
      icon: Lock,
      description: "Only approved friends/followers can view your profile",
      bestFor: "Maximum privacy, selective connections",
      considerations: "Limits discoverability, requires active networking"
    }
  ];

  const safetyFeatures = [
    {
      feature: "Block Users",
      description: "Completely prevents someone from contacting or seeing you",
      whenToUse: "When someone makes you uncomfortable or violates boundaries"
    },
    {
      feature: "Report Users",
      description: "Alerts our moderation team about problematic behavior",
      whenToUse: "For harassment, inappropriate content, or policy violations"
    },
    {
      feature: "Hide Online Status",
      description: "Others can't see when you're active on the platform",
      whenToUse: "When you want to browse privately without pressure to respond"
    },
    {
      feature: "Message Filtering",
      description: "Automatically filters messages from non-connections",
      whenToUse: "To reduce unwanted messages from strangers"
    }
  ];

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
              Understanding Privacy Settings and Safety Features
            </h1>
            <p className="text-xl opacity-90 mb-4">
              Learn how to control who sees your profile and how to use our safety tools effectively.
            </p>
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span>6 min read</span>
              <span>•</span>
              <span>December 28, 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Introduction */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <p className="text-lg text-simples-storm leading-relaxed mb-6">
              Your privacy and safety are fundamental to having a positive experience on Simples Connect. As a member of the Ugandan diaspora, you're already navigating complex cultural and social dynamics—your online interactions should feel secure and under your control.
            </p>
            <p className="text-lg text-simples-storm leading-relaxed">
              This guide will walk you through all the privacy settings and safety features available to you, helping you create boundaries that feel comfortable while still allowing for meaningful connections.
            </p>
          </div>

          {/* Privacy Levels */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl font-bold text-simples-midnight">Choose Your Privacy Level</h2>
            </div>
            
            <p className="text-simples-storm mb-8">
              Your privacy level determines who can see your profile and interact with you. Choose the option that aligns with your comfort level and networking goals.
            </p>

            <div className="space-y-6">
              {privacyLevels.map((level, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <level.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-simples-midnight mb-2">{level.level}</h3>
                      <p className="text-simples-storm mb-4">{level.description}</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2">Best for:</h4>
                          <p className="text-sm text-simples-storm">{level.bestFor}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-amber-700 mb-2">Consider:</h4>
                          <p className="text-sm text-simples-storm">{level.considerations}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Recommendation</span>
              </div>
              <p className="text-blue-800">
                Most users find "Members Only" to be the sweet spot—it keeps your profile within the community while maintaining reasonable privacy. You can always adjust this later as you get more comfortable.
              </p>
            </div>
          </div>

          {/* Profile Visibility Controls */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Fine-Tune What People See</h2>
            
            <p className="text-simples-storm mb-6">
              Beyond your overall privacy level, you can control specific aspects of your profile visibility:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-simples-midnight mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-green-600" />
                  Always Visible
                </h3>
                <ul className="space-y-2 text-sm text-simples-storm">
                  <li>• Your name and main photo</li>
                  <li>• Basic location (city/country)</li>
                  <li>• Age range</li>
                  <li>• "About me" summary (first 100 characters)</li>
                </ul>
              </div>

              <div className="border border-amber-200 rounded-lg p-6">
                <h3 className="font-bold text-simples-midnight mb-4 flex items-center gap-2">
                  <EyeOff className="w-5 h-5 text-amber-600" />
                  You Can Hide
                </h3>
                <ul className="space-y-2 text-sm text-simples-storm">
                  <li>• Additional photos</li>
                  <li>• Detailed bio information</li>
                  <li>• Professional information</li>
                  <li>• Connection/friend lists</li>
                  <li>• Activity status</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-6">
              <h4 className="font-semibold text-green-800 mb-2">Cultural Consideration</h4>
              <p className="text-green-700 text-sm">
                For Ugandans in the diaspora, consider what level of cultural information you're comfortable sharing publicly. Details about your tribe, family traditions, or home region can help you connect with others from similar backgrounds, but share only what feels safe.
              </p>
            </div>
          </div>

          {/* Safety Features */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-red-600" />
              <h2 className="text-2xl font-bold text-simples-midnight">Essential Safety Features</h2>
            </div>
            
            <p className="text-simples-storm mb-8">
              These tools help you maintain control over your interactions and create a safe space for authentic connections.
            </p>

            <div className="space-y-6">
              {safetyFeatures.map((feature, index) => (
                <div key={index} className="border border-red-100 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-simples-midnight mb-2">{feature.feature}</h3>
                  <p className="text-simples-storm mb-3">{feature.description}</p>
                  <div className="bg-red-50 rounded-lg p-3">
                    <h4 className="font-semibold text-red-800 text-sm mb-1">When to use:</h4>
                    <p className="text-red-700 text-sm">{feature.whenToUse}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Privacy Best Practices</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-4">✅ Do This</h3>
                <ul className="space-y-3 text-sm text-simples-storm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Regularly review and update your privacy settings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Start conservative and gradually open up as you get comfortable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Trust your instincts about people and interactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Use the block feature liberally if someone makes you uncomfortable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Keep personal information (phone, address) private until you're ready</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-4">❌ Avoid This</h3>
                <ul className="space-y-3 text-sm text-simples-storm">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>Sharing financial information or sending money to strangers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>Giving out your address or workplace location publicly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>Ignoring red flags because someone shares your background</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>Using the same password as other accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>Feeling pressured to share more than you're comfortable with</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cultural Safety */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Cultural Safety in the Diaspora</h2>
            
            <p className="text-lg opacity-90 mb-6">
              As Ugandans abroad, we face unique privacy considerations. Here's how to protect yourself while still connecting authentically:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3">Protecting Your Identity</h3>
                <ul className="space-y-2 opacity-90 text-sm">
                  <li>• Be mindful of sharing tribal or regional details publicly</li>
                  <li>• Consider how much family information to include</li>
                  <li>• Think about immigration status references</li>
                  <li>• Balance cultural authenticity with privacy</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3">Professional Considerations</h3>
                <ul className="space-y-2 opacity-90 text-sm">
                  <li>• Keep work details general rather than specific</li>
                  <li>• Be cautious about networking with work colleagues initially</li>
                  <li>• Consider separate accounts for personal vs. professional networking</li>
                  <li>• Understand your company's social media policies</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Setup Guide */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Quick Privacy Setup (5 Minutes)</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-simples-midnight">Choose Your Privacy Level</h3>
                  <p className="text-simples-storm text-sm">Go to Settings → Privacy → Profile Visibility. Start with "Members Only" if unsure.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-simples-midnight">Set Message Preferences</h3>
                  <p className="text-simples-storm text-sm">Decide who can message you first: Everyone, Members Only, or Connections Only.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-simples-midnight">Configure Activity Status</h3>
                  <p className="text-simples-storm text-sm">Choose whether others can see when you're online and active.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-simples-midnight">Review Profile Information</h3>
                  <p className="text-simples-storm text-sm">Check what's visible in your public preview vs. full profile.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-simples-midnight">Test Your Settings</h3>
                  <p className="text-simples-storm text-sm">View your profile as others would see it to ensure you're comfortable with what's visible.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Safety, Your Control</h2>
            <p className="text-lg opacity-90 mb-4">
              Privacy and safety settings aren't just technical features—they're tools that help you build trust and feel confident in your interactions. The goal is to create an environment where you can be authentically yourself while maintaining appropriate boundaries.
            </p>
            <p className="text-lg opacity-90">
              Remember: these settings can be adjusted anytime. Start with what feels comfortable and gradually open up as you build trust within the community.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <h3 className="text-xl font-bold text-simples-midnight mb-4">Ready to Secure Your Profile?</h3>
            <p className="text-simples-storm mb-6">
              Take 5 minutes now to review and adjust your privacy settings. Your future self will thank you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/settings')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Go to Privacy Settings
              </button>
              <button
                onClick={() => navigate('/resources')}
                className="border border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Read More Guides
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsGuide; 