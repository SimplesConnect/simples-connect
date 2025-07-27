import React from 'react';
import { ArrowLeft, Heart, Home, Users, Globe, Phone, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeelingGroundedWhenHomesick = () => {
  const navigate = useNavigate();

  const strategies = [
    {
      category: "Create Home Spaces",
      icon: Home,
      color: "from-green-500 to-green-600",
      strategies: [
        "Set up a 'Uganda corner' with photos, fabric, or art from home",
        "Cook familiar foods regularly, not just for special occasions", 
        "Play Ugandan music during daily routines",
        "Display items that smell like home (tea, spices, perfume)"
      ]
    },
    {
      category: "Maintain Connections",
      icon: Phone,
      color: "from-blue-500 to-blue-600", 
      strategies: [
        "Schedule regular video calls beyond crisis management",
        "Share daily life through photos and voice messages",
        "Join family WhatsApp groups and actually participate",
        "Send care packages or money transfers as expressions of love"
      ]
    },
    {
      category: "Build Community",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      strategies: [
        "Find or create Ugandan community groups in your area",
        "Attend cultural events, even if you go alone initially",
        "Connect with other East Africans who share similar experiences",
        "Host gatherings where people can speak their home languages"
      ]
    },
    {
      category: "Honor Your Culture",
      icon: Heart,
      color: "from-red-500 to-red-600",
      strategies: [
        "Celebrate Ugandan holidays in your own way",
        "Teach others about your traditions and customs",
        "Wear traditional clothing when it feels right",
        "Share your culture through food, stories, or language"
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
              How to Feel Grounded When You Miss Home
            </h1>
            <p className="text-xl opacity-90 mb-4">
              Practical strategies for maintaining your cultural identity and connection to Uganda while building a new life.
            </p>
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span>9 min read</span>
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
              Homesickness isn't just missing a place—it's mourning the person you were there, the ease of being understood, and the comfort of belonging without explanation. For Ugandans abroad, this feeling can hit at unexpected moments: hearing a familiar accent, smelling rolex on the street, or simply feeling tired of always being "different."
            </p>
            <p className="text-lg text-simples-storm leading-relaxed mb-6">
              But here's what years of diaspora wisdom have taught us: you don't have to choose between embracing your new home and staying connected to Uganda. You can create a sense of groundedness that honors both.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-blue-800 font-semibold">
                This isn't about "getting over" missing home—it's about building a life that includes home in meaningful ways.
              </p>
            </div>
          </div>

          {/* The Reality of Homesickness */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">First, Let's Be Real About Homesickness</h2>
            
            <p className="text-simples-storm mb-6">
              Homesickness for Ugandans abroad often comes in waves and can be triggered by:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-3">Emotional Triggers</h3>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Missing family celebrations or crises</li>
                  <li>• Feeling culturally isolated or misunderstood</li>
                  <li>• Holiday seasons and significant anniversaries</li>
                  <li>• Hearing news from home (good or concerning)</li>
                  <li>• Moments when you need "your people"</li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-amber-800 mb-3">Practical Triggers</h3>
                <ul className="text-amber-700 text-sm space-y-1">
                  <li>• Not finding familiar foods or products</li>
                  <li>• Navigating systems that don't account for your background</li>
                  <li>• Weather or seasonal changes</li>
                  <li>• Professional or social situations where you feel "other"</li>
                  <li>• Technology failures during family calls</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                <strong>Remember:</strong> These feelings are normal and don't mean you're not grateful for opportunities abroad or that you've made wrong choices. They mean you have deep connections to home—and that's actually beautiful.
              </p>
            </div>
          </div>

          {/* Strategies */}
          <div className="space-y-8">
            {strategies.map((strategy, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className={`bg-gradient-to-r ${strategy.color} text-white rounded-2xl p-6 mb-6`}>
                  <div className="flex items-center gap-4">
                    <strategy.icon className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">{strategy.category}</h2>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {strategy.strategies.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-simples-storm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Deep Strategies */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-12">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Deeper Strategies for Long-term Grounding</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-simples-midnight mb-4">Redefine "Home"</h3>
                <p className="text-simples-storm mb-4">
                  Home doesn't have to be one place. You can have:
                </p>
                <ul className="space-y-2 text-simples-storm ml-6">
                  <li>• <strong>Home of origin:</strong> Uganda, where your roots and family history lie</li>
                  <li>• <strong>Home of choice:</strong> Where you've built your current life and future</li>
                  <li>• <strong>Home of community:</strong> Wherever you find your people and cultural connections</li>
                  <li>• <strong>Home of heart:</strong> The feeling of belonging you create wherever you are</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-simples-midnight mb-4">Create Rituals That Bridge Worlds</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Daily Rituals</h4>
                    <ul className="text-sm text-simples-storm space-y-1">
                      <li>• Start mornings with Ugandan tea or coffee</li>
                      <li>• Listen to Ugandan radio or podcasts during commutes</li>
                      <li>• End days with gratitude in your home language</li>
                      <li>• Keep a photo from home visible in your workspace</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Weekly/Monthly Rituals</h4>
                    <ul className="text-sm text-simples-storm space-y-1">
                      <li>• Dedicate Sundays to family calls and cultural content</li>
                      <li>• Cook a traditional meal once a week</li>
                      <li>• Share a piece of Ugandan culture with a local friend monthly</li>
                      <li>• Support a Ugandan business or cause regularly</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-simples-midnight mb-4">Build Your Cultural Portfolio</h3>
                <p className="text-simples-storm mb-4">
                  Actively collect and curate experiences that keep you connected:
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-2">Collect</h4>
                      <ul className="text-purple-700 text-sm space-y-1">
                        <li>• Traditional recipes</li>
                        <li>• Family stories and photos</li>
                        <li>• Ugandan music playlists</li>
                        <li>• Cultural items and crafts</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-2">Create</h4>
                      <ul className="text-purple-700 text-sm space-y-1">
                        <li>• Photo journals of your diaspora journey</li>
                        <li>• Fusion recipes combining both cultures</li>
                        <li>• Spaces that feel like home</li>
                        <li>• New traditions that honor both worlds</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-2">Share</h4>
                      <ul className="text-purple-700 text-sm space-y-1">
                        <li>• Your culture with new friends</li>
                        <li>• Your diaspora experience online</li>
                        <li>• Support with other Ugandans abroad</li>
                        <li>• Your story to inspire others</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* When Homesickness Hits Hard */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">When Homesickness Hits Hard: Emergency Toolkit</h2>
            
            <p className="text-lg opacity-90 mb-6">
              Sometimes homesickness isn't just a gentle ache—it's overwhelming. Here's your emergency toolkit:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3">Immediate Comfort (0-24 hours)</h3>
                <ul className="space-y-2 opacity-90">
                  <li>• Call someone from home, even briefly</li>
                  <li>• Cook something that smells like home</li>
                  <li>• Watch Ugandan content (news, comedy, music videos)</li>
                  <li>• Reach out to another Ugandan abroad</li>
                  <li>• Allow yourself to cry—grief needs expression</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3">Rebuilding (1-7 days)</h3>
                <ul className="space-y-2 opacity-90">
                  <li>• Plan something to look forward to (visit, event, purchase)</li>
                  <li>• Take action to help or connect with home</li>
                  <li>• Engage extra deeply with your local Ugandan community</li>
                  <li>• Practice extra self-care and patience with yourself</li>
                  <li>• Consider if changes to your routine might help</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Success Stories */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">How Others Stay Grounded</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="font-semibold text-simples-midnight mb-2">Sarah, London (8 years)</h3>
                <p className="text-simples-storm italic mb-2">
                  "I started hosting monthly 'Uganda nights' where we cook together and share news from home. It's become my chosen family here, and we support each other through everything."
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="font-semibold text-simples-midnight mb-2">David, Toronto (12 years)</h3>
                <p className="text-simples-storm italic mb-2">
                  "I keep a 'gratitude and grief' journal where I write what I'm grateful for here AND what I miss about home. Both feelings can exist together."
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="font-semibold text-simples-midnight mb-2">Grace, Boston (5 years)</h3>
                <p className="text-simples-storm italic mb-2">
                  "I teach my American friends Luganda phrases and they love it. Sharing my culture makes me feel proud rather than different, and they ask such thoughtful questions."
                </p>
              </div>
            </div>
          </div>

          {/* The Bigger Picture */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">The Bigger Picture: You're Building Something New</h2>
            
            <p className="text-lg text-simples-storm leading-relaxed mb-6">
              What you're doing as a Ugandan abroad isn't just surviving or adapting—you're creating something entirely new. You're building bridges between worlds, creating fusion cultures, and expanding what it means to be Ugandan in the 21st century.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 mb-3">Your Impact</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">For Uganda</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Representing Uganda globally</li>
                    <li>• Sending remittances and support</li>
                    <li>• Sharing Uganda's story internationally</li>
                    <li>• Building global networks</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">For Your New Home</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Bringing diverse perspectives</li>
                    <li>• Contributing skills and talents</li>
                    <li>• Enriching local culture</li>
                    <li>• Building understanding between communities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Home Is What You Carry AND What You Build</h2>
            <p className="text-lg opacity-90 mb-4">
              Feeling grounded doesn't mean the homesickness disappears—it means building a life rich enough to hold both your love for Uganda and your investment in your new home. You don't have to choose between honoring your roots and growing new ones.
            </p>
            <p className="text-lg opacity-90">
              You are not lost between two worlds. You are building bridges between them.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center mt-8">
            <h3 className="text-xl font-bold text-simples-midnight mb-4">Connect with Others Who Understand</h3>
            <p className="text-simples-storm mb-6">
              Join our community of Ugandans abroad who support each other through the joys and challenges of diaspora life.
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
                Read More Resources
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeelingGroundedWhenHomesick; 