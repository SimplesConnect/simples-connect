import React from 'react';
import { ArrowLeft, Shield, AlertTriangle, Eye, EyeOff, Settings, UserX, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlockingReportingControl = () => {
  const navigate = useNavigate();

  const safetyTools = [
    {
      tool: "Blocking Users",
      icon: UserX,
      color: "from-red-500 to-red-600",
      description: "Completely prevents someone from contacting or interacting with you",
      whenToUse: [
        "Someone is harassing, threatening, or making you uncomfortable",
        "Persistent unwanted contact after you've asked them to stop",
        "Inappropriate sexual advances or explicit content",
        "Someone trying to scam or manipulate you financially",
        "Any behavior that makes you feel unsafe or anxious"
      ],
      howItWorks: [
        "They can no longer see your profile or content",
        "They cannot send you messages or interact with your posts",
        "You won't see their content or profile",
        "Existing conversations are hidden from both parties",
        "The block is immediate and complete"
      ]
    },
    {
      tool: "Reporting Violations",
      icon: Flag,
      color: "from-orange-500 to-orange-600",
      description: "Alerts our moderation team about behavior that violates community guidelines",
      whenToUse: [
        "Harassment, threats, or abusive language",
        "Fake profiles or identity theft",
        "Spam, scams, or fraudulent activity",
        "Inappropriate sexual content or advances",
        "Discrimination based on race, gender, religion, etc."
      ],
      howItWorks: [
        "Reports are reviewed by trained moderation staff",
        "Evidence is preserved even if the user deletes content",
        "Actions range from warnings to permanent bans",
        "You're notified of the outcome when appropriate",
        "Reports help protect the entire community"
      ]
    },
    {
      tool: "Privacy Controls",
      icon: Eye,
      color: "from-blue-500 to-blue-600",
      description: "Manage who can see your information and how others can contact you",
      whenToUse: [
        "You want to limit who can find and contact you",
        "You're concerned about privacy or safety",
        "You want to control your online visibility",
        "You're taking a break but not leaving the platform",
        "You want to test your comfort level with different settings"
      ],
      howItWorks: [
        "Adjust profile visibility (public, members only, private)",
        "Control who can message you first",
        "Manage who sees your activity status",
        "Filter message requests from non-connections",
        "Hide specific information from your profile"
      ]
    },
    {
      tool: "Activity Management",
      icon: EyeOff,
      color: "from-green-500 to-green-600",
      description: "Control what information you share about your online activity",
      whenToUse: [
        "You want to browse privately without social pressure",
        "You don't want others to know when you're online",
        "You want to avoid unwanted messages during active times",
        "You're managing multiple conversations at your own pace",
        "You want to maintain professional boundaries"
      ],
      howItWorks: [
        "Hide your online status from others",
        "Control read receipts for messages",
        "Manage notification settings",
        "Set up 'do not disturb' modes",
        "Control what activities appear in your feed"
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
              Blocking, Reporting & Controlling Your Experience
            </h1>
            <p className="text-xl opacity-90 mb-4">
              Complete guide to our safety features and how to create boundaries that work for you.
            </p>
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span>5 min read</span>
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
              Your safety and comfort on Simples Connect are non-negotiable. As a platform designed for meaningful connections within the Ugandan diaspora community, we provide comprehensive tools to help you control your experience and protect yourself from unwanted interactions.
            </p>
            <p className="text-lg text-simples-storm leading-relaxed mb-6">
              Using these safety features isn't about being antisocial or paranoid—it's about creating an environment where you can be your authentic self while maintaining appropriate boundaries. This guide will show you exactly how to use each tool effectively.
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-800">Your Safety, Your Control</span>
              </div>
              <p className="text-red-700">
                You have the right to feel safe and comfortable in every interaction. Don't hesitate to use these tools whenever you need them.
              </p>
            </div>
          </div>

          {/* Safety Tools */}
          <div className="space-y-8">
            {safetyTools.map((tool, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className={`bg-gradient-to-r ${tool.color} text-white rounded-2xl p-6 mb-6`}>
                  <div className="flex items-center gap-4">
                    <tool.icon className="w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-bold">{tool.tool}</h2>
                      <p className="opacity-90">{tool.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-amber-700 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      When to Use This Tool
                    </h3>
                    <ul className="space-y-2">
                      {tool.whenToUse.map((situation, sIndex) => (
                        <li key={sIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-simples-storm text-sm">{situation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      How It Works
                    </h3>
                    <ul className="space-y-2">
                      {tool.howItWorks.map((mechanism, mIndex) => (
                        <li key={mIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-simples-storm text-sm">{mechanism}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Step-by-Step Guides */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-12">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Step-by-Step: How to Use Each Feature</h2>
            
            <div className="space-y-8">
              <div className="border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4">🚫 How to Block Someone</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-simples-midnight mb-2">From Their Profile:</h4>
                    <ol className="text-simples-storm text-sm space-y-1 list-decimal list-inside">
                      <li>Visit their profile page</li>
                      <li>Click the three dots menu (⋯)</li>
                      <li>Select "Block User"</li>
                      <li>Confirm your decision</li>
                      <li>Block takes effect immediately</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold text-simples-midnight mb-2">From a Message:</h4>
                    <ol className="text-simples-storm text-sm space-y-1 list-decimal list-inside">
                      <li>Open the conversation</li>
                      <li>Click the settings icon</li>
                      <li>Select "Block and Report"</li>
                      <li>Choose block reason (optional)</li>
                      <li>Confirm to block immediately</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-800 mb-4">🚩 How to Report Someone</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-simples-midnight mb-2">Reporting Process:</h4>
                    <ol className="text-simples-storm text-sm space-y-2 list-decimal list-inside">
                      <li><strong>Choose Report Type:</strong> Harassment, spam, fake profile, inappropriate content, etc.</li>
                      <li><strong>Provide Details:</strong> Specific description of what happened and when</li>
                      <li><strong>Include Evidence:</strong> Screenshots, message copies, or other documentation</li>
                      <li><strong>Submit Report:</strong> Our team reviews within 24-48 hours</li>
                      <li><strong>Follow Up:</strong> You'll receive updates on significant actions taken</li>
                    </ol>
                  </div>
                  <div className="bg-orange-50 rounded p-4">
                    <p className="text-orange-800 text-sm">
                      <strong>Tip:</strong> You can report someone without blocking them if you want our team to review their behavior but still receive their messages.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">👁️ How to Adjust Privacy Settings</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-simples-midnight mb-2">Privacy Dashboard (Settings → Privacy):</h4>
                    <ul className="text-simples-storm text-sm space-y-2">
                      <li>• <strong>Profile Visibility:</strong> Who can see your full profile vs. basic info</li>
                      <li>• <strong>Search Visibility:</strong> Whether you appear in search results</li>
                      <li>• <strong>Message Settings:</strong> Who can message you first</li>
                      <li>• <strong>Activity Status:</strong> Whether others see when you're online</li>
                      <li>• <strong>Photo Privacy:</strong> Who can see your additional photos</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 rounded p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Recommendation:</strong> Start with more restrictive settings and gradually open up as you become comfortable with the platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Common Scenarios */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Common Scenarios: What Tool to Use When</h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-3">🚨 Immediate Safety Concerns</h3>
                  <div className="text-red-700 text-sm space-y-2">
                    <p><strong>Scenario:</strong> Someone is threatening you or making you feel unsafe</p>
                    <p><strong>Action:</strong> Block immediately + Report + Screenshot evidence</p>
                    <p><strong>Why:</strong> Stops further contact while alerting our safety team</p>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-800 mb-3">📢 Persistent Unwanted Contact</h3>
                  <div className="text-orange-700 text-sm space-y-2">
                    <p><strong>Scenario:</strong> Someone keeps messaging after you've said no</p>
                    <p><strong>Action:</strong> Send clear boundary message → Block if continued</p>
                    <p><strong>Why:</strong> Gives them one chance to respect boundaries</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-3">🤔 Uncomfortable but Not Dangerous</h3>
                  <div className="text-yellow-700 text-sm space-y-2">
                    <p><strong>Scenario:</strong> Someone's messages make you uncomfortable but aren't threatening</p>
                    <p><strong>Action:</strong> Adjust privacy settings + Consider gentle boundary</p>
                    <p><strong>Why:</strong> Prevents similar situations without blocking</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-3">🔍 Suspicious or Fake Profiles</h3>
                  <div className="text-blue-700 text-sm space-y-2">
                    <p><strong>Scenario:</strong> Profile seems fake or user seems to be scamming</p>
                    <p><strong>Action:</strong> Report (don't engage) + Block to protect yourself</p>
                    <p><strong>Why:</strong> Helps protect other community members</p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-3">🌟 General Privacy Management</h3>
                  <div className="text-green-700 text-sm space-y-2">
                    <p><strong>Scenario:</strong> You want more control over your experience</p>
                    <p><strong>Action:</strong> Adjust privacy settings + Activity controls</p>
                    <p><strong>Why:</strong> Proactive safety without blocking specific people</p>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-3">⏱️ Need a Break</h3>
                  <div className="text-purple-700 text-sm space-y-2">
                    <p><strong>Scenario:</strong> Feeling overwhelmed and need space</p>
                    <p><strong>Action:</strong> Hide activity status + Limit message settings</p>
                    <p><strong>Why:</strong> Gives you control over your availability</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cultural Considerations */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Cultural Considerations for Ugandans Abroad</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3">You Don't Owe Anyone Access</h3>
                <ul className="space-y-2 opacity-90 text-sm">
                  <li>• Being Ugandan doesn't mean you must be accessible to everyone</li>
                  <li>• Politeness doesn't require tolerating discomfort or disrespect</li>
                  <li>• Your safety matters more than avoiding "rudeness"</li>
                  <li>• Cultural respect goes both ways—others should respect your boundaries</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3">Community Doesn't Mean Compromise</h3>
                <ul className="space-y-2 opacity-90 text-sm">
                  <li>• A healthy community protects its members from harmful behavior</li>
                  <li>• Using safety tools helps protect others, not just yourself</li>
                  <li>• Setting boundaries models healthy behavior for the community</li>
                  <li>• Your comfort contributes to everyone's positive experience</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What Happens After */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">What Happens After You Take Action</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">After Blocking Someone:</h3>
                <ul className="text-simples-storm space-y-2">
                  <li>• The block is immediate and complete—they cannot contact you</li>
                  <li>• You can unblock them later if you change your mind</li>
                  <li>• Your previous conversations remain hidden but not deleted</li>
                  <li>• Neither of you will see each other in search results or suggestions</li>
                  <li>• The blocked person is not notified that they've been blocked</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">After Reporting Someone:</h3>
                <ul className="text-simples-storm space-y-2">
                  <li>• Our moderation team reviews the report within 24-48 hours</li>
                  <li>• Evidence is preserved even if the user tries to delete it</li>
                  <li>• Actions may include warnings, temporary suspension, or permanent ban</li>
                  <li>• You're notified if significant action is taken</li>
                  <li>• Your report helps us identify patterns and protect other users</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">After Adjusting Privacy Settings:</h3>
                <ul className="text-simples-storm space-y-2">
                  <li>• Changes take effect immediately</li>
                  <li>• You can adjust settings anytime as your comfort level changes</li>
                  <li>• More restrictive settings may limit some discoverability</li>
                  <li>• You can always test different levels to find what works</li>
                  <li>• Your existing connections are usually not affected</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Getting Additional Help */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">When You Need Additional Help</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">Contact Our Support Team If:</h3>
                <ul className="text-simples-storm space-y-2 text-sm">
                  <li>• You're experiencing ongoing harassment despite blocking</li>
                  <li>• Someone is creating new accounts to contact you</li>
                  <li>• You need help interpreting whether behavior violates guidelines</li>
                  <li>• You're unsure which safety tool is best for your situation</li>
                  <li>• You want to report something but aren't sure how</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">External Resources:</h3>
                <ul className="text-simples-storm space-y-2 text-sm">
                  <li>• Local police if you receive threats of physical harm</li>
                  <li>• Cybercrime units for financial scams or identity theft</li>
                  <li>• Mental health professionals if the experience affects your wellbeing</li>
                  <li>• Trusted friends or family for emotional support</li>
                  <li>• Legal advice if someone threatens to harm your reputation or career</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Safety is Our Priority</h2>
            <p className="text-lg opacity-90 mb-4">
              These tools exist to ensure that your experience on Simples Connect is positive, safe, and under your control. Don't hesitate to use them whenever you need to protect yourself or enhance your comfort level.
            </p>
            <p className="text-lg opacity-90">
              Remember: using safety features is a sign of wisdom, not weakness. You're helping create a safer community for everyone.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center mt-8">
            <h3 className="text-xl font-bold text-simples-midnight mb-4">Take Control of Your Experience</h3>
            <p className="text-simples-storm mb-6">
              Explore your privacy settings and familiarize yourself with these safety tools. Your comfort and security are worth the few minutes it takes to set them up properly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/settings')}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Review Privacy Settings
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

export default BlockingReportingControl; 