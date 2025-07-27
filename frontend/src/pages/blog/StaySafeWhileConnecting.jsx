import React from 'react';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Eye, Phone, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaySafeWhileConnecting = () => {
  const navigate = useNavigate();

  const safetyPhases = [
    {
      phase: "Initial Contact",
      icon: MessageCircle,
      color: "from-blue-500 to-blue-600",
      guidelines: [
        "Keep conversations on the platform initially",
        "Be cautious of overly eager or pushy communication",
        "Trust your instincts about red flags",
        "Don't share personal details immediately"
      ],
      redFlags: [
        "Asking for money or financial information",
        "Pressuring you to move to private messaging quickly",
        "Stories that don't add up or change",
        "Avoiding video calls or phone conversations"
      ]
    },
    {
      phase: "Building Trust",
      icon: Eye,
      color: "from-green-500 to-green-600", 
      guidelines: [
        "Video chat before meeting in person",
        "Verify their identity through multiple channels",
        "Share gradually, not all at once",
        "Introduce them to friends or family virtually"
      ],
      redFlags: [
        "Refusing to video chat with various excuses",
        "Photos that look too professional or inconsistent",
        "Avoiding questions about work, family, or background",
        "Creating drama or urgency around meeting"
      ]
    },
    {
      phase: "Meeting in Person",
      icon: Shield,
      color: "from-red-500 to-red-600",
      guidelines: [
        "Always meet in public places first",
        "Tell someone where you're going and when you'll check in",
        "Drive yourself or arrange your own transportation",
        "Stay sober and aware of your surroundings"
      ],
      redFlags: [
        "Insisting on picking you up or meeting at private locations",
        "Getting angry if you want to meet in public first",
        "Showing up with friends without warning",
        "Any behavior that makes you uncomfortable"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-simples-cloud to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-12">
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
              🔒 Safety & Support
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              How to Stay Safe While Making New Connections
            </h1>
            <p className="text-xl opacity-90 mb-4">
              Essential safety tips for meeting new people online and taking relationships offline safely.
            </p>
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span>10 min read</span>
              <span>•</span>
              <span>December 26, 2024</span>
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
              Meeting new people online can lead to wonderful friendships, meaningful relationships, and valuable professional connections. But as a member of the Ugandan diaspora, you might face unique safety considerations—from cultural misunderstandings to people who might target you specifically because of your background.
            </p>
            <p className="text-lg text-simples-storm leading-relaxed mb-6">
              This guide will help you navigate online connections safely while still being open to authentic relationships. The goal isn't to make you paranoid—it's to give you the tools to trust your instincts and protect yourself.
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-800">Your Safety First</span>
              </div>
              <p className="text-red-700">
                No connection, no matter how promising, is worth compromising your safety. Trust your instincts—they're usually right.
              </p>
            </div>
          </div>

          {/* Safety Phases */}
          <div className="space-y-8">
            {safetyPhases.map((phase, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className={`bg-gradient-to-r ${phase.color} text-white rounded-2xl p-6 mb-6`}>
                  <div className="flex items-center gap-4">
                    <phase.icon className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">{phase.phase}</h2>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Safety Guidelines
                    </h3>
                    <ul className="space-y-3">
                      {phase.guidelines.map((guideline, gIndex) => (
                        <li key={gIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-simples-storm">{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Red Flags to Watch
                    </h3>
                    <ul className="space-y-3">
                      {phase.redFlags.map((flag, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-simples-storm">{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cultural Considerations */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-12">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Special Considerations for Ugandans Abroad</h2>
            
            <p className="text-simples-storm mb-6">
              As a Ugandan in the diaspora, you might encounter specific challenges that require extra awareness:
            </p>

            <div className="space-y-6">
              <div className="border border-amber-200 rounded-lg p-6">
                <h3 className="font-semibold text-amber-800 mb-3">Cultural Fetishization</h3>
                <p className="text-amber-700 text-sm mb-3">
                  Be wary of people who seem overly fascinated by your "exotic" background or make assumptions about your culture, personality, or availability based on stereotypes.
                </p>
                <div className="bg-amber-50 rounded p-3">
                  <p className="text-amber-800 text-sm">
                    <strong>Watch for:</strong> Comments about your accent being "sexy," assumptions about your family situation, or people who seem more interested in your Ugandan identity than you as a person.
                  </p>
                </div>
              </div>

              <div className="border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-3">Financial Targeting</h3>
                <p className="text-blue-700 text-sm mb-3">
                  Unfortunately, some scammers specifically target people from certain countries, assuming they send money home or have family obligations that can be exploited.
                </p>
                <div className="bg-blue-50 rounded p-3">
                  <p className="text-blue-800 text-sm">
                    <strong>Never:</strong> Send money, gift cards, or financial information to someone you've only met online, regardless of their story or emergency.
                  </p>
                </div>
              </div>

              <div className="border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-3">Professional Boundaries</h3>
                <p className="text-green-700 text-sm mb-3">
                  Be cautious about networking connections that quickly become personal, especially if the person knows details about your work, visa status, or professional situation.
                </p>
                <div className="bg-green-50 rounded p-3">
                  <p className="text-green-800 text-sm">
                    <strong>Keep separate:</strong> Professional networking and personal connections until you're certain of someone's intentions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Safety */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Digital Safety Essentials</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">Protect Your Information</h3>
                <ul className="space-y-3 text-simples-storm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Use platform messaging initially rather than personal phone/email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Be vague about specific workplace, address, or routine details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Don't share financial information, including bank details or income</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Keep immigration status and visa details private initially</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">Verify Identity</h3>
                <ul className="space-y-3 text-simples-storm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Request video calls before meeting—voice calls can be deceiving</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Cross-reference their social media profiles for consistency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Google their name, photos, or specific details they've shared</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Ask specific questions about their location, work, or interests</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Meeting Safely */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">The Safe First Meeting Checklist</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3">Before You Go</h3>
                <ul className="space-y-2 opacity-90">
                  <li>• Tell a friend exactly where you're going and when</li>
                  <li>• Share the person's profile and contact information</li>
                  <li>• Plan your own transportation there and back</li>
                  <li>• Charge your phone and bring a portable charger</li>
                  <li>• Have a safety call scheduled during the date</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3">During the Meeting</h3>
                <ul className="space-y-2 opacity-90">
                  <li>• Stay in public places with good lighting and crowds</li>
                  <li>• Don't leave drinks unattended or accept drinks from them</li>
                  <li>• Trust your gut—leave if anything feels off</li>
                  <li>• Keep your own transportation and don't go to secondary locations</li>
                  <li>• Check in with your safety contact as planned</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Trust Your Instincts */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Learning to Trust Your Instincts</h2>
            
            <p className="text-simples-storm mb-6">
              Your instincts are shaped by years of reading people and situations. In the context of online connections, here's what to pay attention to:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-3">Listen to Your Body</h3>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Feeling tense during conversations</li>
                  <li>• Stomach discomfort when reading their messages</li>
                  <li>• Difficulty sleeping after interactions</li>
                  <li>• Feeling like you need to be "on guard"</li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-amber-800 mb-3">Notice Your Thoughts</h3>
                <ul className="text-amber-700 text-sm space-y-1">
                  <li>• Making excuses for their behavior</li>
                  <li>• Feeling like you need to convince yourself they're good</li>
                  <li>• Worrying about what friends/family would think</li>
                  <li>• Questioning your own judgment repeatedly</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3">Positive Signs</h3>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Feeling relaxed and genuine in conversations</li>
                  <li>• Excitement about sharing with friends/family</li>
                  <li>• Consistent behavior across different situations</li>
                  <li>• Respecting your boundaries and pace</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Community Support */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">When Things Go Wrong: Getting Support</h2>
            
            <p className="text-simples-storm mb-6">
              If you encounter harassment, threats, or dangerous behavior, you're not alone and it's not your fault. Here's how to get help:
            </p>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">On the Platform</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Use block and report features immediately</li>
                  <li>• Screenshot evidence before blocking</li>
                  <li>• Contact platform support with detailed information</li>
                  <li>• Don't engage further with the person</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">In Your Community</h3>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Reach out to trusted friends or family</li>
                  <li>• Contact local Ugandan community leaders if appropriate</li>
                  <li>• Share experiences to warn others if you feel comfortable</li>
                  <li>• Consider professional counseling if the experience was traumatic</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">Legal/Emergency</h3>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Contact local police if threatened or stalked</li>
                  <li>• Document all evidence of harassment or threats</li>
                  <li>• Know your local emergency numbers and resources</li>
                  <li>• Consider restraining orders for serious situations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Safety Enables Authentic Connection</h2>
            <p className="text-lg opacity-90 mb-4">
              Being safety-conscious doesn't mean being closed off or paranoid. When you feel secure and protected, you're actually more able to be authentic, vulnerable, and open to real connections.
            </p>
            <p className="text-lg opacity-90">
              The right people will respect your boundaries and safety measures. Anyone who doesn't isn't someone you want in your life anyway.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center mt-8">
            <h3 className="text-xl font-bold text-simples-midnight mb-4">Ready to Connect Safely?</h3>
            <p className="text-simples-storm mb-6">
              Use these guidelines to build meaningful connections while protecting yourself. Your safety and peace of mind are worth more than any potential connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/discover')}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Start Connecting Safely
              </button>
              <button
                onClick={() => navigate('/resources')}
                className="border border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Read More Safety Tips
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StaySafeWhileConnecting; 