import React from 'react';
import { ArrowLeft, Globe, Heart, Smile, Phone, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FiveThingsUgandansUnderstand = () => {
  const navigate = useNavigate();

  const experiences = [
    {
      number: "01",
      title: "The Accent Questions Never End",
      icon: Smile,
      content: "\"Where are you from? No, where are you REALLY from?\" followed by \"I love your accent!\" and then the inevitable attempt to repeat something you just said. You've perfected the polite smile while internally debating whether to give the full explanation or just say \"East Africa\" and move on."
    },
    {
      number: "02", 
      title: "You're a Walking Geography Lesson",
      icon: Globe,
      content: "\"Uganda? Is that near Nigeria?\" You've become an unofficial ambassador, patiently explaining that yes, Uganda is a real country, no it's not a city in another African country, and yes, we have cities and internet. You probably have a mental map ready for when someone says \"Africa is a country.\""
    },
    {
      number: "03",
      title: "The Weather Will Never Make Sense",
      icon: Home,
      content: "You're either freezing in air conditioning during summer or confused why people are happy about 15°C being \"warm.\" You've learned to carry a jacket in July and still can't understand why anyone would choose to live somewhere that gets dark at 4 PM in winter."
    },
    {
      number: "04",
      title: "Food Is a Constant Mission",
      icon: Heart,
      content: "You've become an expert at finding the one African store in a 50-mile radius, explaining why you can't just \"substitute\" matooke with regular bananas, and teaching friends that not all African food is spicy. Your suitcase from home visits is 70% food items that \"you can't get here.\""
    },
    {
      number: "05",
      title: "You Master the Time Zone Math",
      icon: Phone,
      content: "You automatically know what time it is in Kampala, can calculate \"good times to call home\" in your sleep, and have perfected the art of attending family WhatsApp video calls at odd hours. \"Sorry, I can't make it to dinner – my family is doing their Sunday call\" is a valid excuse your friends understand."
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
              5 Things Only Ugandans Abroad Understand
            </h1>
            <p className="text-xl opacity-90 mb-4">
              From explaining your accent to navigating cultural differences - the unique experiences we all share.
            </p>
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span>7 min read</span>
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
              If you're reading this as a Ugandan living abroad, you're probably nodding along already. There's something uniquely bonding about the shared experiences of being Ugandan in the diaspora—those moments when you think "only we would understand this."
            </p>
            <p className="text-lg text-simples-storm leading-relaxed mb-6">
              Whether you moved last year or have been abroad for decades, certain experiences unite us all. From the daily micro-interactions to the bigger cultural navigation challenges, here are five things that every Ugandan abroad knows too well.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-blue-800 italic">
                And yes, we're laughing because it's true, not because it's funny. (Okay, maybe it's a little funny.)
              </p>
            </div>
          </div>

          {/* The Five Things */}
          <div className="space-y-8">
            {experiences.map((experience, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {experience.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <experience.icon className="w-6 h-6 text-blue-600" />
                      <h2 className="text-2xl font-bold text-simples-midnight">{experience.title}</h2>
                    </div>
                    <p className="text-lg text-simples-storm leading-relaxed">
                      {experience.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Deeper Dive Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-12">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">The Deeper Truth Behind the Laughs</h2>
            
            <p className="text-lg text-simples-storm leading-relaxed mb-6">
              While these experiences can be amusing to share with fellow Ugandans, they also represent something deeper: the daily work of cultural translation that every immigrant does.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-simples-midnight mb-4">What We're Really Doing</h3>
                <ul className="space-y-3 text-simples-storm">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></span>
                    <span><strong>Building bridges:</strong> Every explanation about Uganda creates understanding and connection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></span>
                    <span><strong>Maintaining identity:</strong> Keeping our culture alive while adapting to new environments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></span>
                    <span><strong>Creating space:</strong> Making room for our authentic selves in spaces that weren't designed for us</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-simples-midnight mb-4">The Strength We Build</h3>
                <ul className="space-y-3 text-simples-storm">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-3 flex-shrink-0"></span>
                    <span><strong>Resilience:</strong> Navigating multiple cultures builds incredible adaptability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-3 flex-shrink-0"></span>
                    <span><strong>Communication skills:</strong> We become experts at reading situations and adjusting our approach</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-3 flex-shrink-0"></span>
                    <span><strong>Global perspective:</strong> We understand both local and international contexts uniquely</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* The Bonus Experiences */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Bonus: The Experiences We Don't Talk About Enough</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3">The Good Stuff</h3>
                <ul className="space-y-2 opacity-90">
                  <li>• Becoming the "cultural expert" friends rely on for perspective</li>
                  <li>• The joy of finding another Ugandan in unexpected places</li>
                  <li>• Watching friends fall in love with Ugandan music/food</li>
                  <li>• The pride when Uganda makes international news for good reasons</li>
                  <li>• Building a chosen family within the diaspora community</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3">The Challenging Stuff</h3>
                <ul className="space-y-2 opacity-90">
                  <li>• The loneliness of celebrating holidays alone</li>
                  <li>• Missing major family events and milestones</li>
                  <li>• Feeling pressure to represent all Ugandans perfectly</li>
                  <li>• The weight of being the "first" in many spaces</li>
                  <li>• Balancing helping family back home with building your own life</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recognition Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">You're Not Alone in This</h2>
            
            <p className="text-lg text-simples-storm leading-relaxed mb-6">
              If you've experienced even one of these things, you're part of a global community of Ugandans who understand exactly what you're going through. The beauty of platforms like Simples Connect is that we can finally stop explaining and start connecting.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-semibold text-green-800 mb-3">What This Means for Your Connections</h3>
              <p className="text-green-700 mb-4">
                When you meet other Ugandans abroad, you're not just making friends—you're connecting with people who understand your specific kind of strength, your particular challenges, and your unique perspective on the world.
              </p>
              <p className="text-green-700">
                These shared experiences create an instant foundation for deeper conversations and more meaningful relationships.
              </p>
            </div>
          </div>

          {/* Community Call */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">What Would You Add?</h2>
            
            <p className="text-simples-storm mb-6">
              Every Ugandan abroad has their own version of these experiences. Maybe yours involves:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <ul className="space-y-2 text-simples-storm">
                <li>• The struggle of finding good nyama or fish</li>
                <li>• Explaining why you can't just "visit home" casually</li>
                <li>• The joy and stress of hosting family visits</li>
                <li>• Navigating professional spaces as "the African one"</li>
              </ul>
              <ul className="space-y-2 text-simples-storm">
                <li>• Teaching friends about extended family structures</li>
                <li>• The complexity of choosing what traditions to maintain</li>
                <li>• Being asked to speak for all of Africa in meetings</li>
                <li>• The emotional labor of code-switching daily</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>We want to hear from you:</strong> What experiences would you add to this list? Share your stories in our community discussions—because sometimes, the best medicine is knowing you're not the only one.
              </p>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Webale for Being You</h2>
            <p className="text-lg opacity-90 mb-4">
              Being Ugandan abroad means carrying your culture with you while building new homes and new versions of yourself. It's not always easy, but it's created a community of some of the most resilient, adaptable, and culturally rich people in the world.
            </p>
            <p className="text-lg opacity-90">
              These shared experiences aren't just funny stories—they're the foundation of understanding that makes our diaspora community so special.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center mt-8">
            <h3 className="text-xl font-bold text-simples-midnight mb-4">Connect with People Who Get It</h3>
            <p className="text-simples-storm mb-6">
              Ready to connect with other Ugandans who understand these experiences without explanation?
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
                Read More Stories
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FiveThingsUgandansUnderstand; 