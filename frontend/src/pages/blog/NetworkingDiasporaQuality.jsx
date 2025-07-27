import React from 'react';
import { ArrowLeft, Users, Heart, Target, Globe, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NetworkingDiasporaQuality = () => {
  const navigate = useNavigate();

  const networkingLevels = [
    {
      level: "Surface Level",
      description: "Collecting contacts without meaningful connection",
      characteristics: [
        "Business card exchanges with no follow-up",
        "Generic LinkedIn connections",
        "Attending events just to 'be seen'",
        "Focusing on what others can do for you"
      ],
      outcome: "Large network with little actual support or opportunities"
    },
    {
      level: "Meaningful Level", 
      description: "Building genuine relationships based on mutual value",
      characteristics: [
        "Understanding others' goals and challenges",
        "Regular, valuable interactions beyond networking events",
        "Offering help before asking for favors",
        "Building trust through consistency and authenticity"
      ],
      outcome: "Smaller network with strong, supportive relationships"
    },
    {
      level: "Strategic Level",
      description: "Intentional relationship-building aligned with your values and goals",
      characteristics: [
        "Connecting with people who share your values",
        "Building relationships that advance mutual goals",
        "Creating value for your network regularly",
        "Becoming a connector for others in your network"
      ],
      outcome: "Powerful network that creates opportunities and lasting impact"
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
              Networking in the Diaspora: Quality Over Quantity
            </h1>
            <p className="text-xl opacity-90 mb-4">
              How to build meaningful professional relationships that advance your career and community.
            </p>
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span>9 min read</span>
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
              As a Ugandan professional abroad, you've probably heard "it's not what you know, it's who you know" more times than you can count. But here's what that advice often misses: it's not just about knowing people—it's about the quality of those relationships and how genuinely they support each other.
            </p>
            <p className="text-lg text-simples-storm leading-relaxed mb-6">
              When you're building a career in the diaspora, your network isn't just professional currency—it's your support system, your cultural bridge, and often your pathway to opportunities that aren't publicly advertised. Quality networking isn't just better than quantity networking; for diaspora professionals, it's essential.
            </p>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
              <p className="text-purple-800 font-semibold">
                The goal isn't to know everyone—it's to build meaningful relationships with people who genuinely support your success, and who you genuinely support in return.
              </p>
            </div>
          </div>

          {/* Why Quality Matters More in the Diaspora */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Why Quality Matters More for Diaspora Professionals</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">Unique Challenges We Face</h3>
                <ul className="space-y-3 text-simples-storm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Credibility Building:</strong> We often start with less professional credibility and need advocates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Cultural Navigation:</strong> Understanding unwritten professional rules requires insider guidance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Limited Family Networks:</strong> Can't rely on family connections for professional opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Bias and Stereotypes:</strong> Need allies who see past assumptions about our capabilities</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">What Quality Relationships Provide</h3>
                <ul className="space-y-3 text-simples-storm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Cultural Translation:</strong> Help understanding professional norms and expectations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Advocacy:</strong> People who speak up for you when you're not in the room</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Hidden Opportunities:</strong> Access to unadvertised positions and projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Emotional Support:</strong> Understanding the unique challenges of diaspora professionals</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Networking Levels */}
          <div className="space-y-8">
            {networkingLevels.map((level, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-red-100' : index === 1 ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    <div className={`w-6 h-6 rounded-full ${
                      index === 0 ? 'bg-red-500' : index === 1 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-simples-midnight">{level.level}</h2>
                    <p className="text-simples-storm">{level.description}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-simples-midnight mb-4">Characteristics</h3>
                    <ul className="space-y-2">
                      {level.characteristics.map((char, cIndex) => (
                        <li key={cIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-simples-storm text-sm">{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-simples-midnight mb-4">Typical Outcome</h3>
                    <div className={`border rounded-lg p-4 ${
                      index === 0 ? 'border-red-200 bg-red-50' : 
                      index === 1 ? 'border-yellow-200 bg-yellow-50' : 
                      'border-green-200 bg-green-50'
                    }`}>
                      <p className={`text-sm ${
                        index === 0 ? 'text-red-700' : 
                        index === 1 ? 'text-yellow-700' : 
                        'text-green-700'
                      }`}>{level.outcome}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Building Quality Relationships */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-12">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">How to Build Quality Professional Relationships</h2>
            
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-6 h-6 text-red-600" />
                    <h3 className="text-lg font-semibold text-simples-midnight">Start with Genuine Interest</h3>
                  </div>
                  <ul className="space-y-2 text-simples-storm text-sm">
                    <li>• Ask about their challenges and goals, not just their title</li>
                    <li>• Listen to understand, not to find immediate opportunities</li>
                    <li>• Remember personal details they share</li>
                    <li>• Follow up on previous conversations</li>
                    <li>• Show interest in their success without expecting immediate returns</li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-simples-midnight">Provide Value First</h3>
                  </div>
                  <ul className="space-y-2 text-simples-storm text-sm">
                    <li>• Share relevant opportunities, articles, or resources</li>
                    <li>• Make introductions when it benefits both parties</li>
                    <li>• Offer your skills or expertise when helpful</li>
                    <li>• Celebrate their achievements publicly</li>
                    <li>• Support their initiatives and causes</li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-simples-midnight">Leverage Cultural Connections</h3>
                  </div>
                  <ul className="space-y-2 text-simples-storm text-sm">
                    <li>• Connect with other African professionals who understand your journey</li>
                    <li>• Join diaspora professional organizations</li>
                    <li>• Attend cultural events with professional networking components</li>
                    <li>• Share insights about working across cultures</li>
                    <li>• Bridge cultural gaps for others in your network</li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-simples-midnight">Be Consistently Valuable</h3>
                  </div>
                  <ul className="space-y-2 text-simples-storm text-sm">
                    <li>• Maintain regular contact beyond when you need something</li>
                    <li>• Become known for specific expertise or insights</li>
                    <li>• Be reliable and follow through on commitments</li>
                    <li>• Share your unique perspective and experiences</li>
                    <li>• Help solve problems with creative, culturally-informed solutions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Networking for Diaspora Professionals */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Strategic Networking for Maximum Impact</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Target These Key Relationships</h3>
                <ul className="space-y-3 opacity-90">
                  <li>• <strong>Cultural Bridges:</strong> People who understand both your background and local professional culture</li>
                  <li>• <strong>Industry Insiders:</strong> Established professionals in your field who can provide guidance</li>
                  <li>• <strong>Fellow Diaspora:</strong> Other immigrants who've successfully navigated similar challenges</li>
                  <li>• <strong>Decision Makers:</strong> People with hiring or promotion authority in organizations you're interested in</li>
                  <li>• <strong>Connectors:</strong> Well-networked individuals who enjoy making introductions</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-4">Networking Strategies That Work</h3>
                <ul className="space-y-3 opacity-90">
                  <li>• <strong>Quality over Quantity:</strong> 5 strong relationships beat 50 weak ones</li>
                  <li>• <strong>Depth over Breadth:</strong> Invest time in developing fewer, deeper connections</li>
                  <li>• <strong>Give Before You Get:</strong> Lead with how you can help, not what you need</li>
                  <li>• <strong>Be Authentic:</strong> Share your genuine story and challenges</li>
                  <li>• <strong>Long-term Thinking:</strong> Build relationships for years, not months</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Networking Scenarios */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Real-World Networking Scenarios</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">Scenario 1: Industry Conference</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">❌ Quantity Approach</h4>
                    <p className="text-red-700 text-sm">
                      "Collect as many business cards as possible, mention you're looking for opportunities, ask everyone what they can do for you."
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Quality Approach</h4>
                    <p className="text-green-700 text-sm">
                      "Have meaningful conversations with 3-5 people, ask about their challenges, share relevant insights from your unique perspective, follow up with personalized messages."
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">Scenario 2: Professional Association Meeting</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">❌ Quantity Approach</h4>
                    <p className="text-red-700 text-sm">
                      "Attend sporadically, sit quietly, leave immediately after presentations, don't participate in discussions."
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Quality Approach</h4>
                    <p className="text-green-700 text-sm">
                      "Attend regularly, ask thoughtful questions, volunteer for committees, offer to share your expertise, build relationships with core members over time."
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">Scenario 3: LinkedIn Outreach</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">❌ Quantity Approach</h4>
                    <p className="text-red-700 text-sm">
                      "Send generic connection requests to everyone in your industry, immediately pitch your services, add people to promotional email lists."
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Quality Approach</h4>
                    <p className="text-green-700 text-sm">
                      "Research people before connecting, send personalized messages referencing their work, engage with their content meaningfully, offer value before asking for anything."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Maintaining Your Network */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Maintaining Quality Relationships Long-term</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-simples-midnight mb-3">Regular Check-ins</h3>
                <ul className="text-simples-storm text-sm space-y-2">
                  <li>• Monthly personal messages to key contacts</li>
                  <li>• Quarterly coffee meetings or video calls</li>
                  <li>• Annual holiday or birthday greetings</li>
                  <li>• Immediate congratulations on achievements</li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-simples-midnight mb-3">Value Creation</h3>
                <ul className="text-simples-storm text-sm space-y-2">
                  <li>• Share relevant articles and opportunities</li>
                  <li>• Make strategic introductions</li>
                  <li>• Offer expertise and advice when needed</li>
                  <li>• Support their initiatives publicly</li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-simples-midnight mb-3">Authentic Engagement</h3>
                <ul className="text-simples-storm text-sm space-y-2">
                  <li>• Remember personal details and follow up</li>
                  <li>• Be genuinely interested in their success</li>
                  <li>• Share your own challenges and victories</li>
                  <li>• Build friendships, not just professional contacts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Measuring Success */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">How to Measure Quality Networking Success</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-3">Signs Your Network is High-Quality</h3>
                <ul className="grid md:grid-cols-2 gap-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-simples-storm text-sm">People reach out to you for advice and opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-simples-storm text-sm">You hear about opportunities before they're publicly posted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-simples-storm text-sm">Your contacts advocate for you when you're not present</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-simples-storm text-sm">You regularly make valuable connections for others</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-simples-storm text-sm">People remember you and your expertise months later</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-simples-storm text-sm">Your network actively supports your career advancement</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Network is Your Net Worth—and Your Lifeline</h2>
            <p className="text-lg opacity-90 mb-4">
              For Ugandans building careers abroad, a strong professional network isn't just nice to have—it's essential for navigating challenges, accessing opportunities, and creating the support system you need to thrive.
            </p>
            <p className="text-lg opacity-90">
              Focus on building genuine, mutually beneficial relationships. The quality of your network will determine not just your professional success, but also how fulfilling and supported your career journey feels.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center mt-8">
            <h3 className="text-xl font-bold text-simples-midnight mb-4">Ready to Build Quality Professional Relationships?</h3>
            <p className="text-simples-storm mb-6">
              Connect with other ambitious Ugandan professionals who understand the importance of strategic, authentic networking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/discover')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Start Networking Quality
              </button>
              <button
                onClick={() => navigate('/resources')}
                className="border border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Read More Career Tips
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NetworkingDiasporaQuality; 