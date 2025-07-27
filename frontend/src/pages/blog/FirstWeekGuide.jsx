import React from 'react';
import { ArrowLeft, Calendar, Users, Heart, MessageCircle, Settings, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FirstWeekGuide = () => {
  const navigate = useNavigate();

  const dayPlan = [
    {
      day: "Day 1",
      title: "Set Up Your Foundation",
      tasks: [
        "Complete your profile with 4-6 quality photos",
        "Write an authentic bio that reflects your personality",
        "Set your preferences and privacy settings",
        "Read the community guidelines"
      ],
      time: "30-45 minutes"
    },
    {
      day: "Day 2",
      title: "Explore & Get Comfortable",
      tasks: [
        "Browse the Resources section to understand the platform",
        "Explore different sections of the community",
        "Practice using search and filter features",
        "Familiarize yourself with safety features"
      ],
      time: "20-30 minutes"
    },
    {
      day: "Day 3",
      title: "Start Connecting",
      tasks: [
        "Browse potential connections based on your interests",
        "Send your first thoughtful message",
        "Join a community discussion or group",
        "Practice good conversation starters"
      ],
      time: "30-40 minutes"
    },
    {
      day: "Day 4-5",
      title: "Build Momentum",
      tasks: [
        "Engage with more community members",
        "Share your thoughts on community topics",
        "Respond to messages promptly and thoughtfully",
        "Refine your search preferences based on early interactions"
      ],
      time: "20-30 minutes daily"
    },
    {
      day: "Day 6-7",
      title: "Reflect & Optimize",
      tasks: [
        "Review your interactions and what's working",
        "Update your profile based on feedback or new insights",
        "Plan your ongoing engagement strategy",
        "Consider upgrading to premium features if needed"
      ],
      time: "15-20 minutes daily"
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
              Your First Week on Simples Connect: What to Do
            </h1>
            <p className="text-xl opacity-90 mb-4">
              A step-by-step guide to navigating your first week and making the most of your experience.
            </p>
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span>8 min read</span>
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
              Welcome to Simples Connect! Whether you're new to social networking or just new to our platform, your first week is crucial for setting yourself up for success. This guide will walk you through exactly what to do each day to build a strong foundation for meaningful connections.
            </p>
            <p className="text-lg text-simples-storm leading-relaxed">
              Think of this as your roadmap to becoming an engaged, confident member of our diaspora community.
            </p>
          </div>

          {/* Before You Start */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-blue-900">Before You Start: Set Your Expectations</h2>
            </div>
            
            <p className="text-blue-800 mb-4">
              Simples Connect is about quality connections, not quantity. Here's what success looks like:
            </p>
            
            <ul className="list-disc pl-6 text-blue-800 space-y-2 mb-6">
              <li><strong>Meaningful conversations:</strong> Even 2-3 genuine exchanges are better than 20 surface-level chats</li>
              <li><strong>Cultural connections:</strong> Finding people who understand your diaspora experience</li>
              <li><strong>Authentic relationships:</strong> Building trust through honest, respectful interactions</li>
              <li><strong>Community engagement:</strong> Contributing to discussions and supporting others</li>
            </ul>
            
            <div className="bg-blue-100 rounded-lg p-4">
              <p className="text-blue-800 font-semibold">
                💡 Remember: This is a marathon, not a sprint. Focus on being authentic rather than impressive.
              </p>
            </div>
          </div>

          {/* Day-by-Day Plan */}
          <div className="space-y-8">
            {dayPlan.map((day, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-simples-midnight">{day.day}: {day.title}</h3>
                    <p className="text-simples-storm">Estimated time: {day.time}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {day.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-simples-storm">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pro Tips Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Pro Tips for Your First Week</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                  <h3 className="font-bold text-simples-midnight">Starting Conversations</h3>
                </div>
                <ul className="text-simples-storm space-y-2 text-sm">
                  <li>• Reference something specific from their profile</li>
                  <li>• Ask open-ended questions about their experiences</li>
                  <li>• Share a brief personal connection to what they've shared</li>
                  <li>• Avoid generic "how are you?" messages</li>
                </ul>
              </div>
              
              <div className="border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h3 className="font-bold text-simples-midnight">Community Engagement</h3>
                </div>
                <ul className="text-simples-storm space-y-2 text-sm">
                  <li>• Share your genuine thoughts and experiences</li>
                  <li>• Support others by liking and commenting thoughtfully</li>
                  <li>• Ask questions when you need help or clarification</li>
                  <li>• Respect different viewpoints and experiences</li>
                </ul>
              </div>
              
              <div className="border border-purple-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-purple-600" />
                  <h3 className="font-bold text-simples-midnight">Building Connections</h3>
                </div>
                <ul className="text-simples-storm space-y-2 text-sm">
                  <li>• Quality over quantity—focus on meaningful interactions</li>
                  <li>• Be patient—good connections take time to develop</li>
                  <li>• Stay true to your values and boundaries</li>
                  <li>• Don't be afraid to make the first move</li>
                </ul>
              </div>
              
              <div className="border border-orange-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-orange-600" />
                  <h3 className="font-bold text-simples-midnight">Time Management</h3>
                </div>
                <ul className="text-simples-storm space-y-2 text-sm">
                  <li>• Set specific times for platform engagement</li>
                  <li>• Don't feel pressured to respond immediately</li>
                  <li>• Take breaks when you feel overwhelmed</li>
                  <li>• Quality engagement is better than constant presence</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cultural Navigation */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Navigating as a Ugandan in the Diaspora</h2>
            
            <p className="text-lg opacity-90 mb-6">
              Our platform understands the unique position you're in—balancing your cultural identity with life abroad. Here's how to make the most of that:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3">Embrace Your Story</h3>
                <ul className="space-y-2 opacity-90">
                  <li>• Share your immigration journey</li>
                  <li>• Talk about maintaining traditions abroad</li>
                  <li>• Discuss challenges and victories of diaspora life</li>
                  <li>• Connect over shared cultural experiences</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3">Find Your Tribe</h3>
                <ul className="space-y-2 opacity-90">
                  <li>• Look for others from your region or tribe</li>
                  <li>• Connect with people in similar career fields</li>
                  <li>• Join discussions about diaspora experiences</li>
                  <li>• Support other community members' goals</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What to Expect */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">What to Expect After Your First Week</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-3">Week 2-4: Finding Your Rhythm</h3>
                <p className="text-simples-storm">
                  You'll start to understand what types of interactions work best for you. You might have a few ongoing conversations and begin to feel more comfortable engaging with the community.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-3">Month 2-3: Building Relationships</h3>
                <p className="text-simples-storm">
                  Some connections will evolve into deeper friendships or potential partnerships. You'll have a better sense of who you connect with and what you're looking for.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-3">Long-term: Meaningful Connections</h3>
                <p className="text-simples-storm">
                  You'll have built a network of people who understand your background and support your goals. Whether friends, collaborators, or potential partners, these relationships will enrich your diaspora experience.
                </p>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">You've Got This!</h2>
            <p className="text-lg opacity-90 mb-4">
              Your first week on Simples Connect is just the beginning of your journey to meaningful connections within the Ugandan diaspora community. Take it one day at a time, be authentically yourself, and trust the process.
            </p>
            <p className="text-lg opacity-90">
              Remember: everyone here understands the unique experience of being Ugandan abroad. You're among people who get it.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center mt-8">
            <h3 className="text-xl font-bold text-simples-midnight mb-4">Ready to Start Your Journey?</h3>
            <p className="text-simples-storm mb-6">
              Follow this guide and you'll be well on your way to building meaningful connections in your first week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Go to Dashboard
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

export default FirstWeekGuide; 