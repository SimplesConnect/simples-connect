import React from 'react';
import { Users, Heart, Shield, AlertTriangle, Globe, MessageCircle, Calendar, Flag } from 'lucide-react';

const CommunityGuidelines = () => {
  const guidelines = [
    {
      title: "Be Kind & Respectful",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      description: "Every member deserves dignity.",
      rules: [
        "Speak kindly—even when you're not feeling the vibe.",
        "Disagree respectfully—no insults or sarcasm.",
        "Avoid gossip or judgment about other users.",
        "This is a social networking space, not a battleground."
      ]
    },
    {
      title: "Honor Cultural Roots",
      icon: Globe,
      color: "from-green-500 to-emerald-500",
      description: "We celebrate Ugandan culture and traditions.",
      rules: [
        "Respect differences in tribe, religion, or background.",
        "Ask, don't assume—especially when it comes to family expectations or values.",
        "Share your story with pride, and let others do the same.",
        "We are united by roots, enriched by diversity."
      ]
    },
    {
      title: "Zero Tolerance for Harm",
      icon: Shield,
      color: "from-red-500 to-red-600",
      description: "You will be removed without warning for:",
      rules: [
        "Harassment, bullying, or threats",
        "Hate speech, discrimination, or tribalism",
        "Sexual content, nudity, or vulgar language",
        "Scams, fraud, or catfishing (fake profiles)",
        "One violation is one too many. We don't play."
      ]
    },
    {
      title: "Be Real. Be You.",
      icon: Users,
      color: "from-blue-500 to-indigo-500",
      description: "Authenticity is key to meaningful connections.",
      rules: [
        "Use your real name (or one you're known by in real life).",
        "Upload recent, authentic photos.",
        "Don't misrepresent your age, marital status, or intentions.",
        "This is a space for honest people looking for honest love."
      ]
    },
    {
      title: "Protect Yourself & Others",
      icon: Shield,
      color: "from-purple-500 to-violet-500",
      description: "Love is built on trust—and so is this platform.",
      rules: [
        "Don't share anyone's private info without consent.",
        "Be careful with personal details until trust is built.",
        "If someone makes you uncomfortable, report them immediately.",
        "Love is built on trust—and so is this platform."
      ]
    },
    {
      title: "Participate With Purpose",
      icon: MessageCircle,
      color: "from-orange-500 to-amber-500",
      description: "This is your community. Help it thrive.",
      rules: [
        "Engage in conversations in the Love Lounge.",
        "Share stories, comment on events, and contribute with good intentions.",
        "Support others, especially those just joining the journey.",
        "This is your community. Help it thrive."
      ]
    },
    {
      title: "Use Matchmaking & Events Wisely",
      icon: Calendar,
      color: "from-teal-500 to-cyan-500",
      description: "We're building serious love stories—not playing games.",
      rules: [
        "Respect matchmakers' time and effort.",
        "Show up for consultations and dates on time.",
        "Give honest feedback and don't ghost people.",
        "We're building serious love stories—not playing games."
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <main className="px-4 md:px-6 py-6 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="card">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-simples-ocean to-simples-sky bg-clip-text text-transparent mb-4">
                🌟 Community Guidelines
              </h1>
              
              <p className="text-base md:text-lg text-simples-storm mb-6 max-w-3xl mx-auto leading-relaxed">
                <strong>Last Updated:</strong> July 12, 2025
              </p>
              
              <p className="text-base md:text-lg text-simples-storm mb-6 max-w-3xl mx-auto leading-relaxed">
                At Simples Connect, we're not just building an app—we're building a community grounded in respect, culture, and genuine connection. These guidelines help us protect the space we're creating and ensure everyone feels seen, safe, and valued.
              </p>
            </div>
          </div>
        </div>

        {/* Guidelines Grid */}
        <div className="mb-8">
          <div className="grid gap-8">
            {guidelines.map((guideline, index) => {
              const Icon = guideline.icon;
              return (
                <div key={index} className="card">
                  <div className="flex items-start gap-6 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${guideline.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-simples-midnight mb-2">{guideline.title}</h2>
                      <p className="text-lg text-simples-storm mb-4">{guideline.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {guideline.rules.map((rule, ruleIndex) => (
                      <div key={ruleIndex} className="flex items-start gap-3 p-4 bg-simples-cloud/30 rounded-xl">
                        <div className="w-2 h-2 bg-simples-ocean rounded-full mt-2 flex-shrink-0" />
                        <p className="text-simples-storm leading-relaxed">{rule}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reporting Section */}
        <div className="mb-8">
          <div className="card">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Flag className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-simples-midnight">Report, Don't React</h2>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <p className="text-yellow-800 leading-relaxed mb-4">
                If someone crosses the line:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-yellow-800">Use the in-app "Report" feature or email us at info@simplesconnect.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-yellow-800">Don't fight fire with fire—let us handle it.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-yellow-800">Your safety is our top priority.</span>
                </li>
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                  Report User
                </button>
                <a 
                  href="mailto:info@simplesconnect.com" 
                  className="bg-white text-simples-ocean border-2 border-simples-ocean px-6 py-3 rounded-xl font-semibold hover:bg-simples-ocean hover:text-white transition-all text-center"
                >
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Final Message */}
        <div className="mb-8">
          <div className="card">
            <div className="bg-gradient-to-r from-simples-ocean to-simples-sky rounded-2xl p-8 text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">💡 Final Reminder</h2>
              <p className="text-xl leading-relaxed mb-6 max-w-3xl mx-auto">
                This platform was created for you. For connection, culture, and commitment. If you can't respect the community, this might not be your place. But if you're here with an open heart, we welcome you with open arms 💙🦋
              </p>
              <p className="text-2xl font-bold">
                Let's build love that lasts. Together.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-8">
          <div className="card">
            <div className="text-center py-6">
              <h3 className="text-xl font-semibold text-simples-midnight mb-4">
                Need Help or Have Questions?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-simples-storm">
                  <MessageCircle className="w-5 h-5 text-simples-ocean" />
                  <span>Email: info@simplesconnect.com</span>
                </div>
                <div className="hidden sm:block text-simples-silver">•</div>
                <div className="flex items-center gap-2 text-simples-storm">
                  <Globe className="w-5 h-5 text-simples-ocean" />
                  <span>Based in Boston, MA USA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommunityGuidelines; 