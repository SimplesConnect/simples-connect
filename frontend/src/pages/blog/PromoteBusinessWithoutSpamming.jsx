import React from 'react';
import { ArrowLeft, Briefcase, Heart, Users, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PromoteBusinessWithoutSpamming = () => {
  const navigate = useNavigate();

  const strategies = [
    {
      strategy: "Lead with Value, Not Sales",
      icon: Heart,
      color: "from-purple-500 to-purple-600",
      description: "Focus on helping your community first, sales will follow naturally",
      examples: [
        "Share free tips and insights related to your expertise",
        "Answer questions in community discussions without pitching",
        "Create helpful content that solves real problems",
        "Offer genuine advice even if it doesn't lead to immediate sales"
      ],
      mistake: "Jumping straight into sales pitches without building trust"
    },
    {
      strategy: "Build Authentic Relationships",
      icon: Users,
      color: "from-blue-500 to-blue-600", 
      description: "Genuine connections are more valuable than transactional interactions",
      examples: [
        "Engage with others' content meaningfully before promoting your own",
        "Remember personal details and follow up on previous conversations",
        "Support other businesses in your community",
        "Celebrate others' successes publicly"
      ],
      mistake: "Only engaging with people when you have something to sell"
    },
    {
      strategy: "Share Your Story and Journey",
      icon: Target,
      color: "from-green-500 to-green-600",
      description: "People connect with stories, not just products or services",
      examples: [
        "Share the challenges and wins of building your business abroad",
        "Talk about how your Ugandan background influences your work",
        "Be transparent about your learning process and mistakes",
        "Connect your business to your values and community impact"
      ],
      mistake: "Only showing polished success without authentic struggles"
    },
    {
      strategy: "Provide Social Proof Naturally",
      icon: CheckCircle,
      color: "from-orange-500 to-orange-600",
      description: "Let satisfied customers and genuine results speak for you",
      examples: [
        "Share client testimonials with permission and context",
        "Post case studies that focus on customer success",
        "Feature before/after results that are honest and realistic",
        "Thank customers publicly when they recommend you"
      ],
      mistake: "Making unrealistic claims or using fake testimonials"
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
              How to Promote Your Small Business (Without Being Spammy)
            </h1>
            <p className="text-xl opacity-90 mb-4">
              Ethical networking strategies that build genuine relationships while growing your business.
            </p>
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span>12 min read</span>
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
              As a Ugandan entrepreneur abroad, you're already juggling cultural navigation, building credibility in new markets, and often working with limited networks. The last thing you want is to be seen as "that person" who only shows up to sell something.
            </p>
            <p className="text-lg text-simples-storm leading-relaxed mb-6">
              But here's the truth: ethical business promotion isn't just about being nice—it's about building sustainable success. When you promote your business with authenticity and genuine value, you create customers who become advocates, and advocates who become your biggest marketing asset.
            </p>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
              <p className="text-purple-800 font-semibold">
                The goal isn't to avoid promoting your business—it's to promote it in ways that build trust, add value, and strengthen your community.
              </p>
            </div>
          </div>

          {/* Why This Matters for Ugandans Abroad */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Why This Matters More for Ugandans Abroad</h2>
            
            <p className="text-simples-storm mb-6">
              When you're building a business in the diaspora, you face unique challenges that make authentic promotion even more crucial:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-4">Building Credibility</h3>
                <ul className="text-blue-700 space-y-2 text-sm">
                  <li>• You're often starting without local references or networks</li>
                  <li>• Your qualifications might not be immediately recognized</li>
                  <li>• Cultural differences can affect how your expertise is perceived</li>
                  <li>• Trust-building takes longer when you're seen as an "outsider"</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-4">Community Dynamics</h3>
                <ul className="text-green-700 space-y-2 text-sm">
                  <li>• The Ugandan diaspora community is tight-knit but small</li>
                  <li>• Bad reputation spreads quickly in close communities</li>
                  <li>• Supporting each other is culturally important and expected</li>
                  <li>• Word-of-mouth is powerful but can work against you if mishandled</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
              <p className="text-amber-800">
                <strong>The Bottom Line:</strong> You can't afford to burn bridges or develop a reputation as someone who only cares about sales. Your reputation within the community is one of your most valuable business assets.
              </p>
            </div>
          </div>

          {/* Core Strategies */}
          <div className="space-y-8">
            {strategies.map((strategy, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className={`bg-gradient-to-r ${strategy.color} text-white rounded-2xl p-6 mb-6`}>
                  <div className="flex items-center gap-4">
                    <strategy.icon className="w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-bold">{strategy.strategy}</h2>
                      <p className="opacity-90">{strategy.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      How to Do This
                    </h3>
                    <ul className="space-y-3">
                      {strategy.examples.map((example, eIndex) => (
                        <li key={eIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-simples-storm text-sm">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Avoid This Mistake
                    </h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700 text-sm">{strategy.mistake}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Practical Templates */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-12">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Practical Templates for Authentic Promotion</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-simples-midnight mb-4">Introducing Your Business</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">❌ Spammy Approach</h4>
                    <p className="text-red-700 text-sm italic">
                      "Hi everyone! I'm offering amazing graphic design services. Best prices in town! Contact me now for 50% off! Don't miss this limited time offer!"
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Authentic Approach</h4>
                    <p className="text-green-700 text-sm italic">
                      "After 5 years in corporate design, I've started helping small Ugandan businesses create professional branding that honors our culture while appealing to diverse markets. Happy to share some free tips if anyone's working on their brand identity!"
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-simples-midnight mb-4">Sharing Success Stories</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">❌ Spammy Approach</h4>
                    <p className="text-red-700 text-sm italic">
                      "Another satisfied client! My amazing services increased their sales by 300%! You could be next! DM me for instant results!"
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Authentic Approach</h4>
                    <p className="text-green-700 text-sm italic">
                      "So proud to see Sarah's catering business thriving! When we worked together on her brand strategy, she was nervous about marketing to both the Ugandan community and mainstream clients. Seeing her confidence grow has been the best part of this project."
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-simples-midnight mb-4">Offering Help</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">❌ Spammy Approach</h4>
                    <p className="text-red-700 text-sm italic">
                      "Free consultation but only if you book my premium package! Limited spots available! First come, first served!"
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Authentic Approach</h4>
                    <p className="text-green-700 text-sm italic">
                      "I've noticed a few people asking about business banking in Canada as newcomers. I went through this process 3 years ago and learned some things the hard way. Happy to share what I learned - feel free to reach out with questions!"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Platform-Specific Strategies */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Platform-Specific Do's and Don'ts</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-simples-midnight mb-4">Social Media Groups</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-green-700 font-semibold text-sm mb-2">DO:</h4>
                    <ul className="text-green-700 text-xs space-y-1">
                      <li>• Read group rules about promotion</li>
                      <li>• Contribute valuable content regularly</li>
                      <li>• Use designated promotion days</li>
                      <li>• Engage with others' posts first</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-red-700 font-semibold text-sm mb-2">DON'T:</h4>
                    <ul className="text-red-700 text-xs space-y-1">
                      <li>• Post sales content immediately after joining</li>
                      <li>• Ignore community guidelines</li>
                      <li>• Only show up to promote</li>
                      <li>• Spam multiple groups with identical posts</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-simples-midnight mb-4">Professional Networks</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-green-700 font-semibold text-sm mb-2">DO:</h4>
                    <ul className="text-green-700 text-xs space-y-1">
                      <li>• Share industry insights and trends</li>
                      <li>• Comment thoughtfully on others' content</li>
                      <li>• Offer genuine help and advice</li>
                      <li>• Build relationships before making asks</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-red-700 font-semibold text-sm mb-2">DON'T:</h4>
                    <ul className="text-red-700 text-xs space-y-1">
                      <li>• Send unsolicited sales messages</li>
                      <li>• Connect just to pitch immediately</li>
                      <li>• Make every post about your business</li>
                      <li>• Use automated/generic outreach</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-simples-midnight mb-4">Community Platforms</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-green-700 font-semibold text-sm mb-2">DO:</h4>
                    <ul className="text-green-700 text-xs space-y-1">
                      <li>• Answer questions in your expertise area</li>
                      <li>• Share relevant resources and tools</li>
                      <li>• Support other community businesses</li>
                      <li>• Be transparent about your services</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-red-700 font-semibold text-sm mb-2">DON'T:</h4>
                    <ul className="text-red-700 text-xs space-y-1">
                      <li>• Turn every conversation into a sales opportunity</li>
                      <li>• Badmouth competitors</li>
                      <li>• Make promises you can't keep</li>
                      <li>• Disappear after getting what you need</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Building Your Network */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Building Your Network the Ugandan Way</h2>
            
            <p className="text-lg opacity-90 mb-6">
              Leverage cultural values that align with authentic business promotion:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3">Ubuntu Philosophy</h3>
                <ul className="space-y-2 opacity-90">
                  <li>• Success comes through lifting others up</li>
                  <li>• Share knowledge and resources freely</li>
                  <li>• Build genuine relationships first</li>
                  <li>• Think long-term community benefit</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3">Extended Family Mindset</h3>
                <ul className="space-y-2 opacity-90">
                  <li>• Treat business connections like family</li>
                  <li>• Invest in relationships even without immediate returns</li>
                  <li>• Celebrate others' successes genuinely</li>
                  <li>• Offer help without expecting immediate reciprocation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Measuring Success */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">How to Measure Authentic Promotion Success</h2>
            
            <p className="text-simples-storm mb-6">
              Move beyond just sales metrics to measure relationship-building:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-simples-midnight mb-2">Relationship Quality</h3>
                <ul className="text-simples-storm text-sm space-y-1">
                  <li>• Repeat customers and referrals</li>
                  <li>• Genuine testimonials and reviews</li>
                  <li>• Invitations to collaborate</li>
                  <li>• Personal recommendations</li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-simples-midnight mb-2">Community Engagement</h3>
                <ul className="text-simples-storm text-sm space-y-1">
                  <li>• People asking for your advice</li>
                  <li>• Being invited to events/discussions</li>
                  <li>• Others sharing your content</li>
                  <li>• Recognition as a trusted expert</li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-simples-midnight mb-2">Business Growth</h3>
                <ul className="text-simples-storm text-sm space-y-1">
                  <li>• Organic lead generation</li>
                  <li>• Higher conversion rates</li>
                  <li>• Premium pricing acceptance</li>
                  <li>• Sustainable customer base</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Common Pitfalls */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Common Pitfalls to Avoid</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-red-500 pl-6">
                <h3 className="font-semibold text-red-800 mb-2">The Desperation Trap</h3>
                <p className="text-red-700 text-sm mb-2">
                  When business is slow, it's tempting to push harder and promote more aggressively. This usually backfires.
                </p>
                <p className="text-red-600 text-xs">
                  <strong>Instead:</strong> Double down on providing value and building relationships. The sales will follow.
                </p>
              </div>
              
              <div className="border-l-4 border-amber-500 pl-6">
                <h3 className="font-semibold text-amber-800 mb-2">The One-Way Street</h3>
                <p className="text-amber-700 text-sm mb-2">
                  Only reaching out when you need something, but disappearing when others need help.
                </p>
                <p className="text-amber-600 text-xs">
                  <strong>Instead:</strong> Regularly check in with your network and offer help proactively.
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="font-semibold text-blue-800 mb-2">The Copy-Paste Mistake</h3>
                <p className="text-blue-700 text-sm mb-2">
                  Using the same generic promotional content across all platforms and audiences.
                </p>
                <p className="text-blue-600 text-xs">
                  <strong>Instead:</strong> Tailor your message to each platform and audience's specific needs and culture.
                </p>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Authentic Promotion = Sustainable Success</h2>
            <p className="text-lg opacity-90 mb-4">
              Building a business as a Ugandan abroad requires patience, authenticity, and genuine relationship-building. When you promote your business ethically, you're not just making sales—you're building a reputation, creating advocates, and contributing positively to your community.
            </p>
            <p className="text-lg opacity-90">
              Remember: people buy from people they trust, and trust is built through consistent, valuable, authentic interactions over time.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center mt-8">
            <h3 className="text-xl font-bold text-simples-midnight mb-4">Ready to Grow Your Business Authentically?</h3>
            <p className="text-simples-storm mb-6">
              Connect with other Ugandan entrepreneurs who understand the challenge of building ethical, sustainable businesses abroad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/discover')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Join Business Community
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

export default PromoteBusinessWithoutSpamming; 