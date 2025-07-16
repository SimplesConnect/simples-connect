import React, { useState } from 'react';
import { Shield, FileText, Cookie, ChevronRight } from 'lucide-react';

const Policies = () => {
  const [activeTab, setActiveTab] = useState('terms');

  const tabs = [
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'cookies', label: 'Cookie Policy', icon: Cookie }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'terms':
        return (
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-simples-midnight mb-4">
                Simples Connect – Terms & Conditions
              </h1>
              <p className="text-simples-storm mb-6">
                <strong>Effective Date:</strong> July 12, 2025
              </p>
              <p className="text-lg text-simples-storm leading-relaxed">
                Welcome to Simples Dating – where Ugandans in the diaspora meet, connect, and build meaningful relationships. By using our website, you agree to the terms below. Please read carefully.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  💌 <span>Who We Are</span>
                </h2>
                <p className="text-simples-storm leading-relaxed">
                  Simples Dating is a relationship platform created for Ugandans living abroad. We offer free and paid membership options, events, and premium matchmaking services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  📝 <span>Creating an Account</span>
                </h2>
                <p className="text-simples-storm leading-relaxed mb-4">You must:</p>
                <ul className="list-disc list-inside text-simples-storm space-y-2 ml-4">
                  <li>Be 18 years or older</li>
                  <li>Use real information (fake profiles are not allowed)</li>
                  <li>Agree to treat others with kindness and respect</li>
                </ul>
                <p className="text-simples-storm leading-relaxed mt-4">
                  You're responsible for your account. Don't share your password.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  💳 <span>Membership & Payments</span>
                </h2>
                <p className="text-simples-storm leading-relaxed mb-4">We offer different levels of membership:</p>
                <ul className="list-disc list-inside text-simples-storm space-y-2 ml-4">
                  <li><strong>Community ($10/month):</strong> For casual users</li>
                  <li><strong>Premium ($25/month):</strong> For serious daters</li>
                  <li><strong>VIP ($50/month):</strong> For executives and high-income professionals</li>
                </ul>
                <p className="text-simples-storm leading-relaxed mt-4">
                  You can cancel anytime. No refunds for partial months.
                </p>
                <p className="text-simples-storm leading-relaxed">
                  Premium matchmaking services are paid separately and follow their own agreement terms, including intake interviews and optional family involvement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  ❌ <span>What You Can't Do</span>
                </h2>
                <p className="text-simples-storm leading-relaxed mb-4">You may not:</p>
                <ul className="list-disc list-inside text-simples-storm space-y-2 ml-4">
                  <li>Use fake names or photos</li>
                  <li>Harass or scam other users</li>
                  <li>Post sexual, violent, or illegal content</li>
                  <li>Share private conversations without consent</li>
                </ul>
                <p className="text-simples-storm leading-relaxed mt-4">
                  Violating these may result in your account being removed without refund.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  💻 <span>Platform Use</span>
                </h2>
                <p className="text-simples-storm leading-relaxed mb-4">
                  Our platform is provided "as is." We work hard to keep it running, but we can't guarantee it will always be perfect.
                </p>
                <p className="text-simples-storm leading-relaxed mb-4">We're not responsible for:</p>
                <ul className="list-disc list-inside text-simples-storm space-y-2 ml-4">
                  <li>Missed matches or failed relationships</li>
                  <li>Issues between users</li>
                  <li>Third-party links or apps</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  👩‍❤️‍👨 <span>Matchmaking Services</span>
                </h2>
                <p className="text-simples-storm leading-relaxed mb-4">Premium matchmaking clients receive:</p>
                <ul className="list-disc list-inside text-simples-storm space-y-2 ml-4">
                  <li>Curated match selections</li>
                  <li>Profile verification</li>
                  <li>Date coaching</li>
                </ul>
                <p className="text-simples-storm leading-relaxed mt-4">
                  These services are confidential. If you're not satisfied, let us know – we may offer credit or refunds under certain conditions outlined in your matchmaking agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  📅 <span>Events</span>
                </h2>
                <p className="text-simples-storm leading-relaxed">
                  Some events may be virtual or in-person. We are not liable for travel, personal disputes, or unforeseen changes. Event tickets are non-refundable unless cancelled by us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  📢 <span>Advertisements</span>
                </h2>
                <p className="text-simples-storm leading-relaxed">
                  We may display ads or partner with businesses. Premium users may see fewer ads. No personal data is sold for advertising.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  ⚖️ <span>Legal Stuff</span>
                </h2>
                <p className="text-simples-storm leading-relaxed mb-4">By using Simples Dating, you agree that:</p>
                <ul className="list-disc list-inside text-simples-storm space-y-2 ml-4">
                  <li>Ugandan law applies where relevant</li>
                  <li>Disputes may be handled by a mediator first before legal action</li>
                  <li>We may update these Terms as the platform grows (we'll notify users if we do)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  💬 <span>Contact Us</span>
                </h2>
                <p className="text-simples-storm leading-relaxed mb-2">Got questions?</p>
                <p className="text-simples-storm leading-relaxed">
                  📧 Email: info@simplesconnect.com<br/>
                  📍 Based in: Boston, MA USA
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  👣 <span>Final Word</span>
                </h2>
                <p className="text-simples-storm leading-relaxed">
                  We built this platform to bring Ugandan hearts together—respect it, protect it, and enjoy the journey of love 💙🦋
                </p>
              </section>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-simples-midnight mb-4">
                🔐 Privacy Policy – Simples Connect
              </h1>
              <p className="text-simples-storm mb-6">
                <strong>Effective Date:</strong> July 12, 2025
              </p>
              <p className="text-lg text-simples-storm leading-relaxed">
                At Simples Dating, your privacy is sacred. We built this platform to create meaningful, safe connections for Ugandans in the diaspora—and protecting your personal information is part of that commitment.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  💡 <span>What We Collect</span>
                </h2>
                <p className="text-simples-storm leading-relaxed mb-4">When you sign up, we collect:</p>
                <ul className="list-disc list-inside text-simples-storm space-y-2 ml-4">
                  <li>Name, age, gender, and location</li>
                  <li>Photos and profile details</li>
                  <li>Preferences and interests</li>
                  <li>Login and activity data (e.g., who you liked or messaged)</li>
                </ul>
                <p className="text-simples-storm leading-relaxed mt-4">
                  If you use paid services, we may collect billing info (handled securely by our payment processor – we don't store your credit card details).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  🧠 <span>How We Use It</span>
                </h2>
                <p className="text-simples-storm leading-relaxed mb-4">We use your data to:</p>
                <ul className="list-disc list-inside text-simples-storm space-y-2 ml-4">
                  <li>Match you with compatible users</li>
                  <li>Show events or content relevant to you</li>
                  <li>Improve our platform features and security</li>
                  <li>Send you updates, offers, and stories from our community</li>
                </ul>
                <p className="text-simples-storm leading-relaxed mt-4">
                  <strong>We do not sell your personal data.</strong>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  🔐 <span>How We Protect It</span>
                </h2>
                <p className="text-simples-storm leading-relaxed mb-4">We use:</p>
                <ul className="list-disc list-inside text-simples-storm space-y-2 ml-4">
                  <li>Secure servers and encrypted connections</li>
                  <li>Limited access to sensitive information</li>
                  <li>Regular system checks and updates</li>
                </ul>
                <p className="text-simples-storm leading-relaxed mt-4">
                  Only authorized team members (like your dating coach or admin support) can view your information—and only to help you.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  🧭 <span>Who Sees Your Profile</span>
                </h2>
                <p className="text-simples-storm leading-relaxed mb-4">Other users can view:</p>
                <ul className="list-disc list-inside text-simples-storm space-y-2 ml-4">
                  <li>Your public profile</li>
                  <li>Photos and preferences you've shared</li>
                  <li>Event participation (if you choose)</li>
                </ul>
                <p className="text-simples-storm leading-relaxed mt-4">
                  Private details like your contact info, payment data, or internal notes from matchmaking sessions are never shared.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  📤 <span>Sharing with Third Parties</span>
                </h2>
                <p className="text-simples-storm leading-relaxed">
                  We may work with trusted tools (e.g., payment processors or analytics software), but only under contracts that protect your privacy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  🧽 <span>Deleting Your Account</span>
                </h2>
                <p className="text-simples-storm leading-relaxed mb-4">You can delete your profile anytime. When you do:</p>
                <ul className="list-disc list-inside text-simples-storm space-y-2 ml-4">
                  <li>Most data is immediately removed</li>
                  <li>Some may be kept temporarily for legal or fraud prevention reasons</li>
                </ul>
                <p className="text-simples-storm leading-relaxed mt-4">
                  To request deletion: info@simplesconnect.com
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  🛠️ <span>Policy Updates</span>
                </h2>
                <p className="text-simples-storm leading-relaxed">
                  We may update this privacy policy as we grow. If so, we'll notify you clearly in advance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  🤝 <span>Your Consent</span>
                </h2>
                <p className="text-simples-storm leading-relaxed">
                  By using Simples Dating, you agree to this privacy policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4">
                  Contact Us
                </h2>
                <p className="text-simples-storm leading-relaxed">
                  Have concerns? Contact us at: info@simplesconnect.com
                </p>
              </section>

              <section className="bg-simples-cloud/30 p-6 rounded-2xl">
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  💘 <span>Matchmaking Service Agreement</span>
                </h2>
                <p className="text-simples-storm leading-relaxed mb-4">
                  <strong>Effective Date:</strong> July 12, 2025
                </p>
                <p className="text-simples-storm leading-relaxed mb-4">
                  This agreement outlines how our premium matchmaking services work and what you can expect when you invest in personalized love through Simples Dating.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-simples-midnight mb-2">📋 What You're Signing Up For</h3>
                    <p className="text-simples-storm leading-relaxed mb-2">Depending on your package (Standard, Premium, or VIP), you will receive:</p>
                    <ul className="list-disc list-inside text-simples-storm space-y-1 ml-4">
                      <li>A personal intake and goal-setting call</li>
                      <li>Curated matches monthly or weekly</li>
                      <li>Support from your personal dating coach</li>
                      <li>Optional family involvement (if culturally important)</li>
                      <li>Background verification on potential matches</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-simples-midnight mb-2">💰 Payment & Refunds</h3>
                    <ul className="list-disc list-inside text-simples-storm space-y-1 ml-4">
                      <li>All packages are prepaid (e.g., 6 or 12 months)</li>
                      <li>No refunds once services have begun, unless otherwise promised (e.g., success guarantees in VIP tier)</li>
                      <li>If no suitable matches are found within the period, we may offer credit toward future services or extend your term</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-simples-midnight mb-2">📸 Media & Representation</h3>
                    <p className="text-simples-storm leading-relaxed">
                      We may recommend professional photos or bio edits to improve your results. You are responsible for keeping your profile honest and updated.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-simples-midnight mb-2">🔒 Confidentiality</h3>
                    <p className="text-simples-storm leading-relaxed">
                      All your consultations, matches, and progress notes are strictly confidential. We do not share your identity, match details, or personal notes with others without permission.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );

      case 'cookies':
        return (
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-simples-midnight mb-4">
                🍪 Cookie Policy – Simples Connect
              </h1>
              <p className="text-simples-storm mb-6">
                <strong>Effective Date:</strong> July 12, 2025
              </p>
              <p className="text-lg text-simples-storm leading-relaxed">
                At Simples Dating, we use cookies to make your experience smoother, more personal, and more secure. This policy explains what cookies are, how we use them, and how you can control them.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  🧁 <span>What Are Cookies?</span>
                </h2>
                <p className="text-simples-storm leading-relaxed mb-4">
                  Cookies are small text files stored on your device when you visit our website. They help us remember things like your preferences, login status, and what pages you've visited.
                </p>
                <p className="text-simples-storm leading-relaxed">
                  Cookies don't give us access to your phone or computer—they just help us make the site work better for you.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  📚 <span>Types of Cookies We Use</span>
                </h2>
                <p className="text-simples-storm leading-relaxed mb-4">We use three main types of cookies:</p>

                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-simples-midnight mb-2">a) Essential Cookies</h3>
                    <p className="text-simples-storm leading-relaxed mb-2">These are needed for the site to work properly.</p>
                    <p className="text-simples-storm leading-relaxed mb-2">Examples:</p>
                    <ul className="list-disc list-inside text-simples-storm space-y-1 ml-4">
                      <li>Staying logged in</li>
                      <li>Remembering your preferences</li>
                      <li>Securing your data</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-simples-midnight mb-2">b) Performance Cookies</h3>
                    <p className="text-simples-storm leading-relaxed mb-2">These help us understand how you use the site.</p>
                    <p className="text-simples-storm leading-relaxed mb-2">We use tools like Google Analytics to:</p>
                    <ul className="list-disc list-inside text-simples-storm space-y-1 ml-4">
                      <li>Track pages visited</li>
                      <li>Measure feature usage</li>
                      <li>Improve performance</li>
                    </ul>
                    <p className="text-simples-storm leading-relaxed mt-2">
                      No personal information is collected—just anonymous usage data.
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-simples-midnight mb-2">c) Functional Cookies</h3>
                    <p className="text-simples-storm leading-relaxed mb-2">These allow the site to remember things like:</p>
                    <ul className="list-disc list-inside text-simples-storm space-y-1 ml-4">
                      <li>Your display settings</li>
                      <li>Language preferences</li>
                      <li>Event RSVPs</li>
                    </ul>
                    <p className="text-simples-storm leading-relaxed mt-2">
                      They make your experience more personalized.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  👀 <span>Third-Party Cookies</span>
                </h2>
                <p className="text-simples-storm leading-relaxed mb-4">Sometimes we work with trusted partners like:</p>
                <ul className="list-disc list-inside text-simples-storm space-y-2 ml-4">
                  <li>Analytics tools (e.g., Google)</li>
                  <li>Payment processors</li>
                  <li>Embedded videos or external links</li>
                </ul>
                <p className="text-simples-storm leading-relaxed mt-4">
                  These third parties may place their own cookies, which are subject to their privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  🧭 <span>Managing Your Cookie Preferences</span>
                </h2>
                <p className="text-simples-storm leading-relaxed mb-4">You're in control. You can:</p>
                <ul className="list-disc list-inside text-simples-storm space-y-2 ml-4">
                  <li>Accept or reject cookies when you visit our site</li>
                  <li>Change cookie settings in your browser anytime</li>
                  <li>Clear cookies from your device</li>
                </ul>
                <p className="text-simples-storm leading-relaxed mt-4">
                  <strong>Note:</strong> Disabling some cookies may affect how the site functions.
                </p>
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-simples-storm leading-relaxed mb-2">For help adjusting your browser settings:</p>
                  <ul className="list-disc list-inside text-simples-storm space-y-1 ml-4">
                    <li>Chrome Help</li>
                    <li>Firefox Help</li>
                    <li>Safari Help</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  📆 <span>Updates to This Policy</span>
                </h2>
                <p className="text-simples-storm leading-relaxed">
                  We may update this policy as our platform evolves. We'll let you know if there are major changes, but you can always check this page for the latest version.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                  💌 <span>Questions?</span>
                </h2>
                <p className="text-simples-storm leading-relaxed">
                  If you have questions about cookies or privacy, reach out to us:
                </p>
                <p className="text-simples-storm leading-relaxed mt-2">
                  📧 Email: info@simplesconnect.com<br/>
                  🧡 Your trust means everything to us.
                </p>
              </section>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <main className="px-4 md:px-6 py-6 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="card">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-simples-ocean to-simples-sky bg-clip-text text-transparent mb-4">
                Legal Policies
              </h1>
              
              <p className="text-base md:text-lg text-simples-storm mb-6 max-w-3xl mx-auto leading-relaxed">
                Understanding your rights and our commitments to your privacy and safety
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="card">
            <div className="flex flex-col sm:flex-row gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 flex-1 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-simples-ocean to-simples-sky text-white shadow-lg'
                        : 'text-simples-storm hover:text-simples-ocean hover:bg-simples-cloud/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    {activeTab === tab.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <div className="card">
            <div className="py-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Policies; 