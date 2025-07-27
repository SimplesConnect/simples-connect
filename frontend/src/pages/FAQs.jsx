// src/pages/FAQs.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Users, Shield, Settings, HelpCircle, Heart } from 'lucide-react';

const FAQs = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (sectionId) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  const faqSections = [
    {
      id: 'general',
      title: 'General Questions',
      icon: HelpCircle,
      color: 'from-purple-500 to-purple-600',
      questions: [
        {
          question: 'What is Simples Connect?',
          answer: 'Simples Connect is a social networking platform for Ugandans in the diaspora. It\'s a digital home where we share stories, celebrate culture, meet new people, grow businesses, and stay connected to our roots—no matter where we are in the world.'
        },
        {
          question: 'Is this a dating site?',
          answer: 'No. Simples Connect is not a dating app. While you can meet new people—including potential partners—it is primarily a community platform for connection, conversation, and cultural belonging.'
        },
        {
          question: 'Who can join Simples Connect?',
          answer: 'Anyone! We\'re especially built for:\n\n• Ugandans living abroad\n• Friends of Ugandan culture\n• People who love African stories, humor, faith, and lifestyle\n\nAll backgrounds and nationalities are welcome—just come with respect and curiosity.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: Users,
      color: 'from-green-500 to-green-600',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'Just visit our website and click "Sign Up". You\'ll need:\n\n• Your name\n• A valid email\n• A password\n• (Optional) A photo and short bio to complete your profile'
        },
        {
          question: 'Do I need to use my real name and photo?',
          answer: 'We encourage real names and real photos for authenticity, but you can use a name you\'re known by in real life (e.g., "Auntie Tee" or "Uncle Dan"). No fake identities or stolen photos allowed—violators will be removed.'
        },
        {
          question: 'Can I delete or pause my account?',
          answer: 'Yes! You can deactivate or permanently delete your account from your Settings page. Need help? Email us at support@simplesconnect.com.'
        }
      ]
    },
    {
      id: 'features',
      title: 'Features & Community Spaces',
      icon: Heart,
      color: 'from-yellow-500 to-yellow-600',
      questions: [
        {
          question: 'What are the main features of Simples Connect?',
          answer: '• Community Spaces: Share stories, get advice, and connect with others\n• Groups: Join discussions around parenting, culture, business, mental health, and more\n• Resources: Access networking tips, relationship advice, and community guides\n• Marketplace (Coming Soon): Promote your business and discover diaspora services'
        },
        {
          question: 'Can I start my own group or community discussion?',
          answer: 'Yes! Once your profile is active, you\'ll be able to create groups and start discussions under the "Community" tab. Just follow our community guidelines.'
        },
        {
          question: 'Can I block or report someone?',
          answer: 'Absolutely. If someone violates our values, you can:\n\n• Block them to stop all interactions\n• Report them for review\n\nWe take safety and respect very seriously.'
        }
      ]
    },
    {
      id: 'safety',
      title: 'Safety & Privacy',
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      questions: [
        {
          question: 'Is my information safe on Simples Connect?',
          answer: 'Yes. We never sell your data. We use strong encryption and privacy controls to protect your account and personal information. View our Privacy Policy for full details.'
        },
        {
          question: 'Can people see my profile if I don\'t want them to?',
          answer: 'You can control your visibility settings. Choose:\n\n• Public (everyone can see your profile)\n• Members only (only signed-in users can see)\n• Private (only approved friends or followers can view)'
        },
        {
          question: 'How do I stay safe while using the platform?',
          answer: '• Don\'t share personal info (like phone numbers or bank details) publicly\n• Be cautious when meeting anyone in person\n• Report suspicious behavior immediately\n\nWe\'re here to support you.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Help',
      icon: Settings,
      color: 'from-orange-500 to-orange-600',
      questions: [
        {
          question: 'I forgot my password. What do I do?',
          answer: 'Click "Forgot Password?" on the login page, and follow the steps to reset your password via email.'
        },
        {
          question: 'I\'m having trouble uploading photos/videos.',
          answer: 'Please check:\n\n• Your file size (limit: 10MB)\n• Your internet connection\n• That the file is in a supported format (.jpg, .png, .mp4, etc.)\n\nStill stuck? Contact us at support@simplesconnect.com.'
        },
        {
          question: 'The site is slow or not loading—what\'s going on?',
          answer: 'Try:\n\n• Refreshing the page\n• Clearing your browser cache\n• Switching to Chrome or Firefox\n\nIf the issue continues, we might be updating something! Check our social media for any scheduled maintenance announcements.'
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Features',
      icon: Settings,
      color: 'from-indigo-500 to-indigo-600',
      questions: [
        {
          question: 'Is Simples Connect free to use?',
          answer: 'Yes! Most core features are completely free. In the future, we may offer:\n\n• Verified badges\n• Enhanced community features\n• Business promotion tools\n• Premium membership for added perks\n\nWe\'ll always be transparent before introducing paid options.'
        }
      ]
    },
    {
      id: 'community',
      title: 'Community & Culture',
      icon: Users,
      color: 'from-pink-500 to-pink-600',
      questions: [
        {
          question: 'What languages are allowed on the platform?',
          answer: 'English is the main language, but feel free to express yourself in Luganda or any other Ugandan dialect—just make sure others can follow along or translate when needed.'
        },
        {
          question: 'Can I share religious or political opinions?',
          answer: 'Yes, but respectfully. We welcome discussions that uplift and educate—not content that insults, shames, or provokes division.'
        },
        {
          question: 'Can I promote my business or services?',
          answer: 'Yes! Business features are coming soon. In the meantime, feel free to share your services in appropriate community spaces. Don\'t spam.'
        }
      ]
    },
    {
      id: 'contact',
      title: 'Contact & Support',
      icon: Mail,
      color: 'from-gray-500 to-gray-600',
      questions: [
        {
          question: 'How can I contact the Simples Connect team?',
          answer: 'Email us anytime at support@simplesconnect.com or message us directly in the app (Support tab). We aim to reply within 24–48 hours.'
        },
        {
          question: 'How can I partner, advertise, or collaborate with Simples Connect?',
          answer: 'We\'d love to hear from you! Send your proposal or idea to partnerships@simplesconnect.com.'
        },
        {
          question: 'Where is Simples Connect based?',
          answer: 'We\'re proudly diaspora-built, run by a team of Ugandans who understand both culture and connection. Our team is remote, with roots in Uganda and hearts around the globe 🌍'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-simples-cloud to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Everything you need to know about Simples Connect and how to get the most out of your experience.
          </p>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-6">
            {faqSections.map((section) => (
              <div key={section.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full p-6 bg-gradient-to-r ${section.color} text-white flex items-center justify-between hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-center gap-4">
                    <section.icon className="w-6 h-6" />
                    <h2 className="text-xl md:text-2xl font-bold text-left">
                      {section.title}
                    </h2>
                  </div>
                  {openSection === section.id ? (
                    <ChevronUp className="w-6 h-6" />
                  ) : (
                    <ChevronDown className="w-6 h-6" />
                  )}
                </button>
                
                {openSection === section.id && (
                  <div className="p-6 space-y-6">
                    {section.questions.map((item, index) => (
                      <div key={index} className="border-b border-simples-cloud last:border-b-0 pb-6 last:pb-0">
                        <h3 className="text-lg font-semibold text-simples-midnight mb-3">
                          {item.question}
                        </h3>
                        <div className="text-simples-storm leading-relaxed whitespace-pre-line">
                          {item.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final Note Section */}
      <div className="py-16 bg-gradient-to-r from-simples-tropical to-simples-lavender text-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            We're Building Something Sacred Here
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            A place where Ugandans thrive together—emotionally, spiritually, and socially.
          </p>
          <p className="text-lg font-semibold">
            Thank you for being part of the journey. 🇺🇬
          </p>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-simples-midnight mb-4">
            Still Have Questions?
          </h3>
          <p className="text-simples-storm mb-6">
            We're here to help! Reach out to our friendly support team.
          </p>
          <a
            href="mailto:support@simplesconnect.com"
            className="inline-flex items-center gap-2 bg-simples-ocean hover:bg-simples-sky text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300"
          >
            <Mail className="w-5 h-5" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQs; 