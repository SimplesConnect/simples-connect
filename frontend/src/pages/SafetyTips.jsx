import React from 'react';
import { Shield, AlertTriangle, Phone, Eye, Users, MessageCircle, Calendar, Heart } from 'lucide-react';

const SafetyTips = () => {
  const safetyTips = [
    {
      category: "Profile Safety",
      icon: Eye,
      color: "from-blue-500 to-blue-600",
      tips: [
        "Use recent, authentic photos of yourself",
        "Don't include personal information like your full name, address, or workplace in your bio",
        "Avoid photos that show license plates, house numbers, or other identifying information",
        "Be mindful of what's visible in the background of your photos"
      ]
    },
    {
      category: "Communication Safety",
      icon: MessageCircle,
      color: "from-green-500 to-green-600",
      tips: [
        "Keep conversations on the platform initially",
        "Don't share personal contact information too early",
        "Be cautious of anyone asking for money or financial information",
        "Trust your instincts if something feels off about a conversation",
        "Report suspicious or inappropriate behavior immediately"
      ]
    },
    {
      category: "Meeting Safety",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      tips: [
        "Meet in public places for first dates",
        "Tell a friend or family member about your plans",
        "Drive yourself or use your own transportation",
        "Stay sober and alert during first meetings",
        "Have an exit strategy if you feel uncomfortable"
      ]
    },
    {
      category: "Video Chat First",
      icon: Calendar,
      color: "from-orange-500 to-orange-600",
      tips: [
        "Suggest a video call before meeting in person",
        "This helps verify the person matches their photos",
        "It's a good way to gauge chemistry and compatibility",
        "Choose a time when you feel comfortable and alert",
        "End the call if you feel uncomfortable for any reason"
      ]
    }
  ];

  const emergencyContacts = [
    {
      name: "Emergency Services",
      number: "911",
      description: "For immediate danger or emergencies"
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "24/7 crisis support via text message"
    },
    {
      name: "National Domestic Violence Hotline",
      number: "1-800-799-7233",
      description: "24/7 confidential support"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <main className="px-4 md:px-6 py-6 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="card">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-simples-rose to-simples-lavender rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-simples-ocean to-simples-sky bg-clip-text text-transparent mb-4">
                Safety Tips
              </h1>
              
              <p className="text-base md:text-lg text-simples-storm mb-6 max-w-3xl mx-auto leading-relaxed">
                Your safety is our priority. Here are essential tips to help you date safely and confidently.
              </p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mb-8">
          <div className="card">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-800 mb-2">Trust Your Instincts</h3>
                  <p className="text-red-700 leading-relaxed">
                    If something doesn't feel right, trust your gut. Your safety is more important than being polite. 
                    Don't hesitate to end a conversation, leave a date early, or ask for help if you feel uncomfortable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Categories */}
        <div className="mb-8">
          <div className="grid gap-8">
            {safetyTips.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="card">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-simples-midnight">{category.category}</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {category.tips.map((tip, tipIndex) => (
                      <div key={tipIndex} className="flex items-start gap-3 p-4 bg-simples-cloud/30 rounded-xl">
                        <div className="w-2 h-2 bg-simples-ocean rounded-full mt-2 flex-shrink-0" />
                        <p className="text-simples-storm leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Red Flags Section */}
        <div className="mb-8">
          <div className="card">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-simples-midnight">Watch Out For These Red Flags</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-simples-midnight">Communication Red Flags:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-simples-storm">Asks for money or financial information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-simples-storm">Refuses to video chat or meet in person</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-simples-storm">Pushes for personal information too quickly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-simples-storm">Stories don't add up or change frequently</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-simples-midnight">Behavioral Red Flags:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-simples-storm">Becomes angry when you set boundaries</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-simples-storm">Pressures you into meeting privately</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-simples-storm">Claims to be "falling in love" very quickly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-simples-storm">Makes you feel uncomfortable or unsafe</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="mb-8">
          <div className="card">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-simples-midnight">Emergency Contacts</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">{contact.name}</h3>
                  <p className="text-2xl font-bold text-red-700 mb-2">{contact.number}</p>
                  <p className="text-sm text-red-600">{contact.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reporting Section */}
        <div className="mb-8">
          <div className="card">
            <div className="bg-gradient-to-r from-simples-cloud to-simples-silver rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-simples-midnight mb-4">
                Report Suspicious Activity
              </h2>
              <p className="text-simples-storm mb-6 max-w-2xl mx-auto">
                If you encounter suspicious behavior, harassment, or feel unsafe, please report it immediately. 
                We take all reports seriously and will investigate promptly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                  Report User
                </button>
                <a 
                  href="mailto:safety@simplesconnect.com" 
                  className="bg-white text-simples-ocean border-2 border-simples-ocean px-6 py-3 rounded-xl font-semibold hover:bg-simples-ocean hover:text-white transition-all"
                >
                  Email Safety Team
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Final Note */}
        <div className="mb-8">
          <div className="card">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-simples-midnight mb-4">
                Remember: Your Safety Comes First
              </h2>
              <p className="text-lg text-simples-storm max-w-3xl mx-auto leading-relaxed">
                Dating should be fun and exciting, but never at the expense of your safety. Take your time, 
                trust your instincts, and don't hesitate to seek help when needed. We're here to support 
                you on your journey to finding meaningful connections. 💙
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SafetyTips; 