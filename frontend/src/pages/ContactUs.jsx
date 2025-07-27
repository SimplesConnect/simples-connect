// src/pages/ContactUs.jsx
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Users, Heart, X, MessageSquare } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [communityFormData, setCommunityFormData] = useState({
    name: '',
    email: '',
    helpType: '',
    description: '',
    urgency: 'normal'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const handleCommunityFormChange = (e) => {
    const { name, value } = e.target;
    setCommunityFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCommunitySubmit = async (e) => {
    e.preventDefault();
    // Simulate form submission
    alert('Thank you! Your community support request has been submitted. We\'ll get back to you within 24-48 hours.');
    setShowCommunityModal(false);
    setCommunityFormData({
      name: '',
      email: '',
      helpType: '',
      description: '',
      urgency: 'normal'
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help with your account, technical issues, or general questions',
      contact: 'support@simplesconnect.com',
      action: 'mailto:support@simplesconnect.com',
      responseTime: '24-48 hours',
      type: 'email'
    },
    {
      icon: Users,
      title: 'Partnerships',
      description: 'Collaborate, advertise, or partner with Simples Connect',
      contact: 'info@simplesconnect.com',
      action: 'mailto:info@simplesconnect.com',
      responseTime: '2-3 business days',
      type: 'email'
    },
    {
      icon: Heart,
      title: 'Community Support',
      description: 'Questions about community guidelines, events, or cultural matters',
      contact: 'Get Help from Community',
      action: () => setShowCommunityModal(true),
      responseTime: '24-48 hours',
      type: 'form'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-simples-cloud to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            We're here to help! Reach out to our friendly team and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-simples-midnight text-center mb-16">
            How Can We Help You?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-simples-cloud p-8 rounded-2xl text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-simples-midnight mb-4">
                  {method.title}
                </h3>
                <p className="text-simples-storm mb-6 leading-relaxed">
                  {method.description}
                </p>
                {method.type === 'email' ? (
                  <a
                    href={method.action}
                    className="inline-flex items-center gap-2 bg-simples-ocean hover:bg-simples-sky text-white px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 mb-4 max-w-full break-all"
                  >
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{method.contact}</span>
                  </a>
                ) : (
                  <button
                    onClick={method.action}
                    className="inline-flex items-center gap-2 bg-simples-ocean hover:bg-simples-sky text-white px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 mb-4 max-w-full"
                  >
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <span>{method.contact}</span>
                  </button>
                )}
                <div className="flex items-center justify-center gap-2 text-sm text-simples-storm">
                  <Clock className="w-4 h-4" />
                  <span>Response: {method.responseTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="py-16 bg-simples-cloud">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-simples-midnight mb-4">
                Send Us a Message
              </h2>
              <p className="text-simples-storm">
                Fill out the form below and we'll get back to you within 24-48 hours.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-simples-midnight mb-4">
                  Message Sent Successfully!
                </h3>
                <p className="text-simples-storm mb-6">
                  Thank you for reaching out. We'll get back to you within 24-48 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-simples-ocean hover:bg-simples-sky text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-simples-midnight mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-simples-cloud rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent outline-none transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-simples-midnight mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-simples-cloud rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent outline-none transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-simples-midnight mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-simples-cloud rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent outline-none transition-all"
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-simples-midnight mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-simples-cloud rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent outline-none transition-all resize-vertical"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-simples-ocean hover:bg-simples-sky disabled:bg-simples-storm text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Office Info */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl font-bold text-simples-midnight mb-8">
            About Our Team
          </h2>
          <div className="bg-gradient-to-r from-simples-tropical to-simples-lavender p-8 rounded-2xl text-white">
            <div className="flex items-center justify-center gap-2 mb-6">
              <MapPin className="w-6 h-6" />
              <h3 className="text-xl font-bold">We're Diaspora-Built</h3>
            </div>
            <p className="text-lg leading-relaxed mb-6">
              Our team is remote and global, with roots in Uganda and hearts around the world. 
              We understand the diaspora experience because we live it every day.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold mb-2">🇺🇬 Cultural Understanding</h4>
                <p className="text-sm opacity-90">We get clan talks, family WhatsApp groups, and the importance of cultural connections.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🌍 Global Perspective</h4>
                <p className="text-sm opacity-90">Our team spans time zones, bringing diverse diaspora experiences to our platform.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ CTA */}
      <div className="py-12 bg-simples-cloud">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-simples-midnight mb-4">
            Looking for Quick Answers?
          </h3>
          <p className="text-simples-storm mb-6">
            Check out our FAQ page for instant answers to common questions.
          </p>
          <a
            href="/faqs"
            className="inline-flex items-center gap-2 bg-simples-ocean hover:bg-simples-sky text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5" />
            Visit FAQs
          </a>
        </div>
      </div>

      {/* Community Support Modal */}
      {showCommunityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-simples-midnight">Community Support Request</h3>
              <button
                onClick={() => setShowCommunityModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCommunitySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-simples-midnight mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={communityFormData.name}
                  onChange={handleCommunityFormChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-simples-midnight mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={communityFormData.email}
                  onChange={handleCommunityFormChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-simples-midnight mb-2">
                  Type of Help Needed *
                </label>
                <select
                  name="helpType"
                  value={communityFormData.helpType}
                  onChange={handleCommunityFormChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                >
                  <option value="">Select help type</option>
                  <option value="community_guidelines">Community Guidelines Question</option>
                  <option value="cultural_matters">Cultural Matters</option>
                  <option value="event_support">Event Support</option>
                  <option value="harassment_report">Report Harassment</option>
                  <option value="community_feedback">Community Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-simples-midnight mb-2">
                  Urgency Level
                </label>
                <select
                  name="urgency"
                  value={communityFormData.urgency}
                  onChange={handleCommunityFormChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="normal">Normal - Standard support</option>
                  <option value="high">High - Needs attention soon</option>
                  <option value="urgent">Urgent - Safety/security issue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-simples-midnight mb-2">
                  Describe Your Request *
                </label>
                <textarea
                  name="description"
                  value={communityFormData.description}
                  onChange={handleCommunityFormChange}
                  required
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent resize-none"
                  placeholder="Please provide details about your community support request..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCommunityModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-simples-ocean to-simples-sky text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs; 