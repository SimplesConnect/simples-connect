import React from 'react';
import { ArrowLeft, Globe, Heart, Scale, Users, Home, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BalancingTwoCultures = () => {
  const navigate = useNavigate();

  const balancingAreas = [
    {
      area: "Professional Identity",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      challenges: [
        "Adapting communication styles for different cultural contexts",
        "Knowing when to emphasize or downplay cultural background",
        "Navigating workplace dynamics that may differ from home",
        "Building credibility while staying authentic to your values"
      ],
      strategies: [
        "Develop cultural code-switching skills for different professional settings",
        "Find mentors who understand both cultures",
        "Use your unique perspective as a professional advantage",
        "Build bridges between different cultural approaches to work"
      ]
    },
    {
      area: "Family Relationships",
      icon: Heart,
      color: "from-red-500 to-red-600",
      challenges: [
        "Managing expectations from family back home",
        "Explaining life choices that don't translate culturally",
        "Dealing with guilt about changing traditions or values",
        "Raising children with dual cultural identities"
      ],
      strategies: [
        "Communicate openly about your evolving perspective",
        "Create new traditions that honor both cultures",
        "Set boundaries while maintaining respect and love",
        "Help family understand your new environment gradually"
      ]
    },
    {
      area: "Social Connections",
      icon: Globe,
      color: "from-green-500 to-green-600",
      challenges: [
        "Fitting in without losing your authentic self",
        "Dealing with cultural misunderstandings in friendships",
        "Finding community that accepts your full identity",
        "Navigating different social norms and expectations"
      ],
      strategies: [
        "Seek diverse friend groups that appreciate different perspectives",
        "Share your culture with others while learning about theirs",
        "Find diaspora communities that understand your experience",
        "Be patient with yourself and others during cultural learning"
      ]
    },
    {
      area: "Personal Values",
      icon: Scale,
      color: "from-purple-500 to-purple-600",
      challenges: [
        "Reconciling conflicting cultural values",
        "Evolving personal beliefs while respecting family traditions",
        "Making decisions that align with multiple value systems",
        "Maintaining cultural identity while adapting to new norms"
      ],
      strategies: [
        "Identify your core values that transcend cultural boundaries",
        "Allow yourself to evolve while honoring your foundation",
        "Create your own value system that integrates both cultures",
        "Seek wisdom from others who've navigated similar journeys"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-simples-cloud to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-12">
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
              🌍 Life in the Diaspora
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Balancing Two Cultures: The Diaspora Experience
            </h1>
            <p className="text-xl opacity-90 mb-4">
              Finding harmony between your Ugandan roots and your new country's customs.
            </p>
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span>6 min read</span>
              <span>•</span>
              <span>December 27, 2024</span>
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
              Living between two cultures isn't about choosing sides—it's about creating a beautiful, complex identity that honors both your Ugandan heritage and your new home. But this balancing act can feel overwhelming when the two cultures seem to pull you in different directions.
            </p>
            <p className="text-lg text-simples-storm leading-relaxed mb-6">
              You might find yourself switching between different versions of yourself: the professional who adapts to local business culture, the child who speaks to parents in familiar cultural frameworks, the friend who navigates social situations with cultural sensitivity, and the individual trying to figure out who you really are in all of this.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-blue-800 font-semibold">
                The goal isn't perfect balance—it's conscious integration. You're not losing your culture; you're expanding it.
              </p>
            </div>
          </div>

          {/* Understanding the Journey */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Understanding Your Cultural Journey</h2>
            
            <p className="text-simples-storm mb-6">
              Cultural integration happens in stages, and each stage brings its own challenges and growth:
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-red-500 pl-6">
                <h3 className="font-semibold text-red-800 mb-2">Stage 1: Cultural Shock and Resistance (Months 1-12)</h3>
                <p className="text-red-700 text-sm mb-2">
                  Everything feels different and wrong. You might reject local customs and cling tightly to Ugandan ways.
                </p>
                <p className="text-red-600 text-xs">
                  <strong>Normal feelings:</strong> Frustration, homesickness, superiority about "your way" of doing things.
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="font-semibold text-orange-800 mb-2">Stage 2: Adaptation and Confusion (Years 1-3)</h3>
                <p className="text-orange-700 text-sm mb-2">
                  You start adopting local customs but feel guilty about "losing yourself." Identity confusion is common.
                </p>
                <p className="text-orange-600 text-xs">
                  <strong>Normal feelings:</strong> Guilt, identity crisis, feeling like you don't fully belong anywhere.
                </p>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-6">
                <h3 className="font-semibold text-yellow-800 mb-2">Stage 3: Conscious Integration (Years 3-7)</h3>
                <p className="text-yellow-700 text-sm mb-2">
                  You begin intentionally choosing which values and practices to keep, adapt, or adopt from each culture.
                </p>
                <p className="text-yellow-600 text-xs">
                  <strong>Normal feelings:</strong> Empowerment, clarity, occasional difficult decisions about competing values.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="font-semibold text-green-800 mb-2">Stage 4: Cultural Fluency (Years 5+)</h3>
                <p className="text-green-700 text-sm mb-2">
                  You can fluidly move between cultural contexts while maintaining your authentic core identity.
                </p>
                <p className="text-green-600 text-xs">
                  <strong>Normal feelings:</strong> Confidence, wisdom, pride in your multicultural competence.
                </p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
              <p className="text-green-800 text-sm">
                <strong>Remember:</strong> These stages aren't linear, and you might experience elements of each throughout your journey. There's no "right" timeline for cultural integration.
              </p>
            </div>
          </div>

          {/* Balancing Areas */}
          <div className="space-y-8">
            {balancingAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className={`bg-gradient-to-r ${area.color} text-white rounded-2xl p-6 mb-6`}>
                  <div className="flex items-center gap-4">
                    <area.icon className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">{area.area}</h2>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-red-700 mb-4">Common Challenges</h3>
                    <ul className="space-y-3">
                      {area.challenges.map((challenge, cIndex) => (
                        <li key={cIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-simples-storm text-sm">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-green-700 mb-4">Integration Strategies</h3>
                    <ul className="space-y-3">
                      {area.strategies.map((strategy, sIndex) => (
                        <li key={sIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-simples-storm text-sm">{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Practical Integration Framework */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-12">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">A Practical Framework for Cultural Integration</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-simples-midnight mb-4">The Three-Part Decision Process</h3>
                <p className="text-simples-storm mb-6">
                  When facing cultural conflicts or decisions, use this framework:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                      1
                    </div>
                    <h4 className="font-semibold text-blue-800 mb-3">Identify Your Core Values</h4>
                    <p className="text-blue-700 text-sm">
                      What principles are non-negotiable for you, regardless of culture? These guide all decisions.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                      2
                    </div>
                    <h4 className="font-semibold text-green-800 mb-3">Evaluate Context</h4>
                    <p className="text-green-700 text-sm">
                      Consider the setting, relationships involved, and potential consequences of different choices.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                      3
                    </div>
                    <h4 className="font-semibold text-purple-800 mb-3">Choose Consciously</h4>
                    <p className="text-purple-700 text-sm">
                      Make intentional decisions that align with your values while respecting both cultural contexts.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-simples-midnight mb-4">Real-World Application Examples</h3>
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-simples-midnight mb-3">Scenario: Family Expectations vs. Career Choices</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h5 className="font-semibold text-blue-700 mb-2">Core Values</h5>
                        <p className="text-blue-600">Family respect, personal fulfillment, financial responsibility</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-green-700 mb-2">Context</h5>
                        <p className="text-green-600">Different cultures value different career paths; both want your success</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-purple-700 mb-2">Conscious Choice</h5>
                        <p className="text-purple-600">Communicate your reasoning while honoring family input and finding compromise</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-simples-midnight mb-3">Scenario: Social Situations and Cultural Norms</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h5 className="font-semibold text-blue-700 mb-2">Core Values</h5>
                        <p className="text-blue-600">Authenticity, respect for others, building genuine relationships</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-green-700 mb-2">Context</h5>
                        <p className="text-green-600">Different social expectations around communication, hierarchy, or interaction styles</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-purple-700 mb-2">Conscious Choice</h5>
                        <p className="text-purple-600">Adapt your approach while staying true to your core personality and values</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Stories */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">How Others Found Their Balance</h2>
            
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="font-semibold mb-2">Amina, Software Engineer (Toronto, 6 years)</h3>
                <p className="opacity-90 italic mb-2">
                  "I used to think I had to choose between being Ugandan and being Canadian. Now I realize I'm creating something new—Ugandan-Canadian. I bring ugali to potluck dinners and explain why family decisions take longer in my culture. My coworkers love learning about Uganda, and I've gained so much from Canadian work culture."
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="font-semibold mb-2">Samuel, Business Owner (London, 9 years)</h3>
                <p className="opacity-90 italic mb-2">
                  "The hardest part was explaining to my parents why I couldn't just 'come home and start a business there.' I had to help them understand that my business serves the diaspora community—I'm still serving Uganda, just from here. Now they're proud of how I'm helping other Ugandans abroad."
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="font-semibold mb-2">Grace, Teacher (Sydney, 4 years)</h3>
                <p className="opacity-90 italic mb-2">
                  "I was worried about raising my kids without enough Ugandan culture. Then I realized we could create our own traditions. We have 'Uganda Sundays' with Luganda lessons and traditional food, but we also embrace Australian outdoor culture. My kids are proudly both."
                </p>
              </div>
            </div>
          </div>

          {/* Tips for Different Life Stages */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Cultural Balance at Different Life Stages</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="font-semibold text-blue-800 mb-3">Early Career (20s-30s)</h3>
                <p className="text-blue-700 text-sm mb-2">
                  Focus on building professional credibility while maintaining cultural authenticity.
                </p>
                <ul className="text-blue-600 text-xs space-y-1">
                  <li>• Learn to code-switch professionally while staying true to your values</li>
                  <li>• Find mentors who understand both cultures</li>
                  <li>• Build diverse networks that appreciate your unique perspective</li>
                  <li>• Use cultural differences as professional strengths</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="font-semibold text-green-800 mb-3">Family Building (30s-40s)</h3>
                <p className="text-green-700 text-sm mb-2">
                  Navigate partnership, parenting, and extended family expectations across cultures.
                </p>
                <ul className="text-green-600 text-xs space-y-1">
                  <li>• Communicate cultural expectations clearly with your partner</li>
                  <li>• Create intentional cultural experiences for your children</li>
                  <li>• Balance extended family input with your family's needs</li>
                  <li>• Model cultural pride and adaptability for your kids</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="font-semibold text-purple-800 mb-3">Established Professional (40s+)</h3>
                <p className="text-purple-700 text-sm mb-2">
                  Use your multicultural competence as leadership strength and community asset.
                </p>
                <ul className="text-purple-600 text-xs space-y-1">
                  <li>• Mentor younger diaspora professionals navigating similar challenges</li>
                  <li>• Bridge cultural gaps in professional and community settings</li>
                  <li>• Share your integrated identity as a model for others</li>
                  <li>• Contribute to both your local and Ugandan communities</li>
                </ul>
              </div>
            </div>
          </div>

          {/* When Balance Feels Impossible */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">When Cultural Balance Feels Impossible</h2>
            
            <p className="text-simples-storm mb-6">
              Sometimes the two cultures will ask incompatible things of you. When this happens:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="font-semibold text-red-800 mb-3">Give Yourself Permission To:</h3>
                <ul className="text-red-700 text-sm space-y-2">
                  <li>• Feel conflicted—it's normal and doesn't mean you're failing</li>
                  <li>• Make imperfect decisions that honor your current context</li>
                  <li>• Evolve your approach as you gain more experience</li>
                  <li>• Disappoint some people while staying true to your core values</li>
                  <li>• Create new traditions that work for your unique situation</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-3">Remember That:</h3>
                <ul className="text-green-700 text-sm space-y-2">
                  <li>• You're not responsible for representing all Ugandans perfectly</li>
                  <li>• Your integration journey is unique to you</li>
                  <li>• Both cultures benefit from your participation and perspective</li>
                  <li>• Future generations will benefit from the path you're creating</li>
                  <li>• You can change your approach as you grow and learn</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">You're Not Balancing Two Cultures—You're Creating a Third</h2>
            <p className="text-lg opacity-90 mb-4">
              The goal isn't to perfectly balance two separate cultural identities. It's to create an integrated identity that draws the best from both while being authentic to who you are becoming. You're not Ugandan + Canadian/American/British—you're Ugandan-Canadian, Ugandan-American, Ugandan-British, creating something beautiful and new.
            </p>
            <p className="text-lg opacity-90">
              This cultural integration is one of the greatest gifts of the diaspora experience. You're building bridges between worlds and expanding what it means to be Ugandan in the modern world.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center mt-8">
            <h3 className="text-xl font-bold text-simples-midnight mb-4">Connect with Others on the Same Journey</h3>
            <p className="text-simples-storm mb-6">
              Join our community of Ugandans abroad who are navigating cultural integration with wisdom, authenticity, and mutual support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/discover')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Find Your Community
              </button>
              <button
                onClick={() => navigate('/resources')}
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Read More Cultural Insights
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BalancingTwoCultures; 