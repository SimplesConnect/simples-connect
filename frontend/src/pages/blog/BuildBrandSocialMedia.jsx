import React from 'react';
import { ArrowLeft, Star, Users, Camera, Heart, TrendingUp, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BuildBrandSocialMedia = () => {
  const navigate = useNavigate();

  const platforms = [
    {
      platform: "LinkedIn",
      icon: Users,
      color: "from-blue-600 to-blue-700",
      bestFor: "Professional networking, B2B services, thought leadership",
      ugandanAdvantage: "Share your unique perspective on international business and cultural competency",
      contentTips: [
        "Share insights about working across cultures",
        "Post about your professional journey from Uganda to abroad",
        "Comment thoughtfully on industry discussions",
        "Share career advice for other diaspora professionals"
      ],
      mistakesToAvoid: [
        "Only posting when you're job hunting",
        "Being too formal and losing personality",
        "Posting political content without professional context"
      ]
    },
    {
      platform: "Instagram",
      icon: Camera,
      color: "from-pink-500 to-purple-600",
      bestFor: "Visual storytelling, lifestyle brands, creative services",
      ugandanAdvantage: "Showcase the beauty of Ugandan culture and your diaspora lifestyle",
      contentTips: [
        "Share beautiful shots of Ugandan food you're cooking",
        "Post about cultural events and celebrations",
        "Show behind-the-scenes of your work or business",
        "Use Stories for real-time updates and personality"
      ],
      mistakesToAvoid: [
        "Only posting perfect, overly-curated content",
        "Using too many hashtags or irrelevant ones",
        "Neglecting to engage with your community's content"
      ]
    },
    {
      platform: "Twitter/X",
      icon: TrendingUp,
      color: "from-blue-400 to-blue-500",
      bestFor: "Thought leadership, real-time commentary, networking",
      ugandanAdvantage: "Provide unique cultural perspective on global conversations",
      contentTips: [
        "Share quick insights about your industry",
        "Engage in conversations about diaspora experiences",
        "Thread your longer thoughts and stories",
        "Support other Ugandans and African voices"
      ],
      mistakesToAvoid: [
        "Getting into heated political arguments",
        "Tweeting controversial opinions without context",
        "Only talking about yourself or your business"
      ]
    },
    {
      platform: "TikTok/YouTube",
      icon: Star,
      color: "from-red-500 to-pink-500",
      bestFor: "Educational content, entertainment, reaching younger audiences",
      ugandanAdvantage: "Share cultural education and diaspora experiences through video",
      contentTips: [
        "Create educational content about Uganda",
        "Share cooking tutorials for traditional foods",
        "Document your diaspora journey and lessons learned",
        "React to misconceptions about Uganda or Africa"
      ],
      mistakesToAvoid: [
        "Following every trend without relevance to your brand",
        "Poor audio quality or lighting",
        "Creating content just for virality without purpose"
      ]
    }
  ];

  const brandingSteps = [
    {
      step: "Define Your Authentic Voice",
      description: "What makes you uniquely you as a Ugandan professional abroad?",
      actions: [
        "Identify your core values and how they show up professionally",
        "Determine what unique perspective you bring to your industry",
        "Decide how much of your personal culture to share",
        "Choose a tone that feels natural and professional"
      ]
    },
    {
      step: "Create Consistent Visual Identity",
      description: "Your brand should be recognizable across platforms",
      actions: [
        "Use the same profile photo across all platforms",
        "Choose 2-3 brand colors that represent you",
        "Create simple templates for quotes or tips",
        "Maintain consistent bio format and key messaging"
      ]
    },
    {
      step: "Develop Content Pillars",
      description: "3-5 topics you'll regularly share content about",
      actions: [
        "Professional expertise and industry insights",
        "Cultural perspective and diaspora experiences",
        "Personal growth and lessons learned",
        "Community support and networking"
      ]
    },
    {
      step: "Build Authentic Engagement",
      description: "Focus on genuine connections rather than follower count",
      actions: [
        "Respond thoughtfully to comments on your posts",
        "Engage meaningfully with others' content",
        "Share and celebrate others' achievements",
        "Ask questions to encourage conversation"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-simples-cloud to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-12">
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
              💼 Hustle & Growth
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Simple Ways to Build Your Brand on Social Media
            </h1>
            <p className="text-xl opacity-90 mb-4">
              Authentic personal branding tips that honor your culture while building professional credibility.
            </p>
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span>7 min read</span>
              <span>•</span>
              <span>December 25, 2024</span>
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
              Building a personal brand on social media as a Ugandan professional abroad isn't about becoming an influencer or creating a fake online persona. It's about strategically sharing your authentic self in ways that build credibility, create opportunities, and connect you with people who value what you bring to the table.
            </p>
            <p className="text-lg text-simples-storm leading-relaxed mb-6">
              Your cultural background, unique perspective, and professional journey are assets—not obstacles—to building a strong personal brand. The key is knowing how to present them authentically and professionally.
            </p>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
              <p className="text-purple-800 font-semibold">
                Remember: Your personal brand isn't what you say about yourself—it's what others say about you after interacting with your content and presence.
              </p>
            </div>
          </div>

          {/* Why Personal Branding Matters for Diaspora Professionals */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Why Personal Branding Matters More for Diaspora Professionals</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">Unique Challenges We Face</h3>
                <ul className="space-y-3 text-simples-storm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Credibility Building:</strong> We often need to prove our expertise more than locally-raised professionals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Network Gaps:</strong> We lack the built-in networks that locals may have</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Cultural Misconceptions:</strong> People may have limited or inaccurate ideas about our background</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Visibility Issues:</strong> Our achievements may be less noticed or celebrated</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">How Personal Branding Helps</h3>
                <ul className="space-y-3 text-simples-storm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Showcase Expertise:</strong> Demonstrate your knowledge and skills proactively</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Build Networks:</strong> Connect with people who value your unique perspective</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Control Narrative:</strong> Share your story before others define it for you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Create Opportunities:</strong> Be discoverable for jobs, collaborations, and partnerships</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Branding Steps */}
          <div className="space-y-8">
            {brandingSteps.map((step, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-simples-midnight">{step.step}</h2>
                    <p className="text-simples-storm mt-2">{step.description}</p>
                  </div>
                </div>
                
                <div className="ml-16">
                  <h3 className="text-lg font-semibold text-purple-700 mb-4">Action Steps:</h3>
                  <ul className="space-y-2">
                    {step.actions.map((action, aIndex) => (
                      <li key={aIndex} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-simples-storm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Platform-Specific Strategies */}
          <div className="space-y-8 mt-12">
            <h2 className="text-3xl font-bold text-simples-midnight text-center">Platform-Specific Strategies</h2>
            
            {platforms.map((platform, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className={`bg-gradient-to-r ${platform.color} text-white rounded-2xl p-6 mb-6`}>
                  <div className="flex items-center gap-4">
                    <platform.icon className="w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-bold">{platform.platform}</h2>
                      <p className="opacity-90">{platform.bestFor}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">🇺🇬 Your Ugandan Advantage:</h3>
                    <p className="text-green-700 text-sm">{platform.ugandanAdvantage}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-blue-700 mb-3">Content Tips:</h3>
                      <ul className="space-y-2">
                        {platform.contentTips.map((tip, tIndex) => (
                          <li key={tIndex} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-simples-storm text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-red-700 mb-3">Mistakes to Avoid:</h3>
                      <ul className="space-y-2">
                        {platform.mistakesToAvoid.map((mistake, mIndex) => (
                          <li key={mIndex} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-simples-storm text-sm">{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content Ideas */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-12">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Content Ideas That Work for Ugandan Professionals</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-3">Professional Insights</h3>
                <ul className="text-blue-700 text-sm space-y-2">
                  <li>• "3 things I learned in my first year working in [country]"</li>
                  <li>• Industry trends from a global perspective</li>
                  <li>• Cross-cultural communication tips</li>
                  <li>• Career pivots and lessons learned</li>
                </ul>
              </div>

              <div className="border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-3">Cultural Bridge Content</h3>
                <ul className="text-green-700 text-sm space-y-2">
                  <li>• "Common misconceptions about Uganda"</li>
                  <li>• Traditional vs. modern Uganda</li>
                  <li>• Language lessons (Luganda phrases)</li>
                  <li>• Cultural celebrations and their meanings</li>
                </ul>
              </div>

              <div className="border border-purple-200 rounded-lg p-6">
                <h3 className="font-semibold text-purple-800 mb-3">Diaspora Journey</h3>
                <ul className="text-purple-700 text-sm space-y-2">
                  <li>• Immigration process tips and lessons</li>
                  <li>• Homesickness and how to cope</li>
                  <li>• Building community abroad</li>
                  <li>• Balancing two cultures</li>
                </ul>
              </div>

              <div className="border border-orange-200 rounded-lg p-6">
                <h3 className="font-semibold text-orange-800 mb-3">Behind the Scenes</h3>
                <ul className="text-orange-700 text-sm space-y-2">
                  <li>• Your workspace setup</li>
                  <li>• Daily routines and productivity tips</li>
                  <li>• Books, podcasts, or resources you love</li>
                  <li>• Projects you're working on</li>
                </ul>
              </div>

              <div className="border border-pink-200 rounded-lg p-6">
                <h3 className="font-semibold text-pink-800 mb-3">Community Support</h3>
                <ul className="text-pink-700 text-sm space-y-2">
                  <li>• Celebrating other Ugandans' achievements</li>
                  <li>• Sharing opportunities and resources</li>
                  <li>• Mentoring advice for newcomers</li>
                  <li>• Highlighting Uganda-positive news</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Personal Growth</h3>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Lessons learned from failures</li>
                  <li>• Skills you're developing</li>
                  <li>• Books or courses that changed your perspective</li>
                  <li>• Goals and accountability updates</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Engagement Strategies */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Building Authentic Engagement</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">Do This:</h3>
                <ul className="space-y-3 text-simples-storm">
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Ask questions to encourage conversation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Respond thoughtfully to comments within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Share and celebrate others' achievements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Engage with others' content before posting your own</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Use storytelling to make your points memorable</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">Avoid This:</h3>
                <ul className="space-y-3 text-simples-storm">
                  <li className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Only engaging when you want something</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Posting controversial content just for attention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Using automated or generic responses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Constantly promoting yourself without adding value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Copying content without adding your unique perspective</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Measuring Success */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">How to Measure Your Personal Brand Success</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3">Quality Indicators</h3>
                <ul className="space-y-2 opacity-90 text-sm">
                  <li>• People reach out for advice or opportunities</li>
                  <li>• You're invited to speak or participate in events</li>
                  <li>• Others share your content regularly</li>
                  <li>• You receive meaningful comments and conversations</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3">Professional Impact</h3>
                <ul className="space-y-2 opacity-90 text-sm">
                  <li>• Job or collaboration opportunities from social media</li>
                  <li>• Increased visibility in your industry</li>
                  <li>• Recognition as a thought leader</li>
                  <li>• Media mentions or interview requests</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3">Community Building</h3>
                <ul className="space-y-2 opacity-90 text-sm">
                  <li>• Other Ugandans seek your advice</li>
                  <li>• You're connecting people within your network</li>
                  <li>• Your content helps others feel less alone</li>
                  <li>• You're contributing to positive representation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Common Personal Branding Mistakes to Avoid</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-red-500 pl-6">
                <h3 className="font-semibold text-red-800 mb-2">Trying to Be Everything to Everyone</h3>
                <p className="text-red-700 text-sm mb-2">
                  Diluting your message by trying to appeal to every possible audience.
                </p>
                <p className="text-red-600 text-xs">
                  <strong>Instead:</strong> Be clear about who you serve and what unique value you provide.
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="font-semibold text-orange-800 mb-2">Inconsistent Presence</h3>
                <p className="text-orange-700 text-sm mb-2">
                  Posting sporadically or disappearing for long periods without explanation.
                </p>
                <p className="text-orange-600 text-xs">
                  <strong>Instead:</strong> Create a sustainable posting schedule and stick to it, even if it's just once a week.
                </p>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-6">
                <h3 className="font-semibold text-yellow-800 mb-2">Hiding Your Culture</h3>
                <p className="text-yellow-700 text-sm mb-2">
                  Trying to blend in by downplaying your Ugandan heritage and unique perspective.
                </p>
                <p className="text-yellow-600 text-xs">
                  <strong>Instead:</strong> Your cultural background is a differentiator, not a limitation. Share it proudly.
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="font-semibold text-blue-800 mb-2">Focusing Only on Self-Promotion</h3>
                <p className="text-blue-700 text-sm mb-2">
                  Making every post about your achievements, services, or accomplishments.
                </p>
                <p className="text-blue-600 text-xs">
                  <strong>Instead:</strong> Follow the 80/20 rule: 80% value-added content, 20% self-promotion.
                </p>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Brand is Your Bridge</h2>
            <p className="text-lg opacity-90 mb-4">
              Building your personal brand on social media isn't about becoming famous—it's about becoming known for the right reasons by the right people. As a Ugandan professional abroad, your brand is a bridge that connects your unique cultural perspective with the opportunities and communities that can benefit from what you offer.
            </p>
            <p className="text-lg opacity-90">
              Start small, be consistent, and always lead with authenticity. Your story, perspective, and professional journey are valuable—share them with confidence.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center mt-8">
            <h3 className="text-xl font-bold text-simples-midnight mb-4">Ready to Build Your Authentic Brand?</h3>
            <p className="text-simples-storm mb-6">
              Connect with other Ugandan professionals who are building their brands and supporting each other's growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/discover')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Join Our Community
              </button>
              <button
                onClick={() => navigate('/resources')}
                className="border border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Read More Growth Tips
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BuildBrandSocialMedia; 