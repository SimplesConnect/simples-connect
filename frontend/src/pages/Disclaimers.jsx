import React from 'react';
import { AlertTriangle, Heart, Users, Shield, Wrench, ExternalLink, Scale } from 'lucide-react';

const Disclaimers = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <div className="px-4 md:px-6 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-simples-ocean to-simples-sky bg-clip-text text-transparent mb-4">
            Disclaimer
          </h1>
          <p className="text-lg text-simples-storm mb-2">
            Effective Date: July 12, 2025
          </p>
          <p className="text-base text-simples-storm max-w-3xl mx-auto leading-relaxed">
            At Simples Connect, we are committed to creating a space where Ugandans in the diaspora can find love, build meaningful connections, and celebrate shared culture. But we also need to set a few things straight. By using our platform, you agree to the following disclaimers.
          </p>
        </div>

        {/* Disclaimer Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <div className="card">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-r from-simples-rose to-simples-lavender rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-simples-midnight mb-4">
                  💌 We Can't Guarantee Love
                </h2>
                <ul className="space-y-2 text-simples-storm leading-relaxed">
                  <li>• We provide tools, connections, and support—but we can't promise you'll meet "the one."</li>
                  <li>• We do not guarantee relationship success, marriage, or compatibility.</li>
                  <li>• Every love story is different—and timing, chemistry, and communication are beyond our control.</li>
                  <li>• We guide the journey, but the love part is up to you.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="card">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-simples-midnight mb-4">
                  🧍People Are Responsible for Themselves
                </h2>
                <p className="text-simples-storm mb-4 leading-relaxed">
                  While we screen profiles for authenticity and offer premium verification and coaching:
                </p>
                <ul className="space-y-2 text-simples-storm leading-relaxed mb-4">
                  <li>• We cannot control or verify every action users take on or off the platform.</li>
                  <li>• Use common sense and caution, especially when meeting someone for the first time.</li>
                  <li>• We are not liable for any personal disputes, emotional harm, or in-person encounters that result from matches made on Simples Connect.</li>
                </ul>
                <p className="text-simples-storm font-medium">
                  Trust your instincts. And if in doubt, pause and ask for help.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="card">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-r from-simples-tropical to-simples-lavender rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-simples-midnight mb-4">
                  🧾 Matchmaking is a Service, Not a Guarantee
                </h2>
                <p className="text-simples-storm mb-4 leading-relaxed">
                  Our premium matchmaking packages are designed to give you a high-quality experience with curated matches and support. However:
                </p>
                <ul className="space-y-2 text-simples-storm leading-relaxed mb-4">
                  <li>• We do not promise a perfect match or relationship outcome.</li>
                  <li>• Matches are based on the information you provide, and success often depends on mutual effort.</li>
                </ul>
                <p className="text-simples-storm font-medium">
                  We help you meet great people. What happens after that is between you and them.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="card">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-simples-midnight mb-4">
                  🌐 Tech Can Have Glitches
                </h2>
                <p className="text-simples-storm mb-4 leading-relaxed">
                  Although we work hard to keep the site running smoothly:
                </p>
                <ul className="space-y-2 text-simples-storm leading-relaxed mb-4">
                  <li>• The website and features may occasionally experience bugs, delays, or downtime.</li>
                  <li>• We are not responsible for missed messages, technical errors, or profile data losses due to unexpected tech issues.</li>
                </ul>
                <p className="text-simples-storm font-medium">
                  We'll always do our best—but we're human too.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="card">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-simples-midnight mb-4">
                  📢 Business Partnerships & Ads
                </h2>
                <p className="text-simples-storm mb-4 leading-relaxed">
                  Simples Connect may include third-party ads, business promotions, or affiliate links:
                </p>
                <ul className="space-y-2 text-simples-storm leading-relaxed mb-4">
                  <li>• These do not mean we endorse those businesses or are liable for their services.</li>
                  <li>• Please use your judgment when engaging with third-party content or making purchases.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="card">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-simples-midnight mb-4">
                  👮 Legal Limits of Liability
                </h2>
                <p className="text-simples-storm mb-4 leading-relaxed">
                  To the maximum extent allowed by law:
                </p>
                <ul className="space-y-2 text-simples-storm leading-relaxed">
                  <li>• Simples Connect is not liable for indirect, incidental, or consequential damages (emotional, financial, or physical) resulting from use of the platform.</li>
                  <li>• This includes disputes between users, matchmaking outcomes, or event participation.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Agreement Section */}
          <div className="card border-2 border-simples-ocean">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-simples-midnight mb-4">
                🤝 Your Agreement
              </h2>
              <p className="text-simples-storm mb-6 leading-relaxed">
                By using Simples Connect, you agree to all parts of this disclaimer. If you do not agree, please do not use our platform.
              </p>
              <p className="text-simples-storm">
                Have questions or concerns? Reach out to us at:{' '}
                <a 
                  href="mailto:info@simplesconnect.com" 
                  className="text-simples-ocean hover:text-simples-sky font-medium underline"
                >
                  info@simplesconnect.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center mt-12 pt-8 border-t border-simples-silver">
          <p className="text-sm text-simples-storm">
            This disclaimer is part of our commitment to transparency and building trust with our community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimers; 