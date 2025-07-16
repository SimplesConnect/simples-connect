import React, { useState } from 'react';
import { Calendar, Plus, Send, X, User, Mail, FileText, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { PremiumButton } from '../components/premium';

const Events = () => {
  const { user } = useAuth();
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    suggestedDate: '',
    userName: '',
    email: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('events_suggestions')
        .insert([
          {
            user_id: user.id,
            event_name: formData.eventName,
            description: formData.description,
            suggested_date: formData.suggestedDate || null,
            user_name: formData.userName,
            email: formData.email
          }
        ]);

      if (error) throw error;

      setSuccess(true);
      setFormData({
        eventName: '',
        description: '',
        suggestedDate: '',
        userName: '',
        email: ''
      });

      setTimeout(() => {
        setShowSuggestionModal(false);
        setSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error submitting event suggestion:', error);
      alert('Error submitting suggestion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowSuggestionModal(false);
    setSuccess(false);
    setFormData({
      eventName: '',
      description: '',
      suggestedDate: '',
      userName: '',
      email: ''
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <main className="px-4 md:px-6 py-6 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="card">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-simples-ocean to-simples-sky bg-clip-text text-transparent mb-4">
                Events
              </h1>
              
              <p className="text-base md:text-lg text-simples-storm mb-6 max-w-3xl mx-auto leading-relaxed">
                Connect with fellow Ugandans in the diaspora through cultural celebrations, romantic meetups, and community building events.
              </p>
              
              <PremiumButton
                onClick={() => setShowSuggestionModal(true)}
                variant="primary"
                size="large"
                icon={Plus}
                className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white font-medium hover:shadow-lg transition-all duration-300"
              >
                Suggest Event
              </PremiumButton>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-8">
        {/* Simple Message */}
        <div className="text-center py-8">
          <div className="w-24 h-24 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Calendar className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-simples-midnight mb-4">
            No events found
          </h2>
          
          <p className="text-lg text-simples-storm mb-8 max-w-2xl mx-auto">
            Try adjusting your filters or check back later for new events.
          </p>

          <div className="bg-white rounded-3xl p-8 shadow-lg border border-simples-silver mb-8">
            <p className="text-simples-storm text-lg leading-relaxed">
              We're working on bringing you the best events there is. Stay tuned for amazing experiences that will connect you with your community!
            </p>
          </div>
        </div>

          {/* Future Events Grid Container - Hidden for now */}
          <div className="hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Events will be displayed here when available */}
            </div>
          </div>
        </div>
      </main>

      {/* Suggestion Modal */}
      {showSuggestionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-simples-midnight to-simples-storm rounded-3xl shadow-2xl border border-simples-silver w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-2xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Suggest an Event
                    </h2>
                    <p className="text-simples-silver">Help us create extraordinary experiences</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-simples-silver hover:text-white transition-colors p-2 rounded-full hover:bg-simples-storm"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Success Message */}
              {success && (
                <div className="bg-simples-tropical/10 border border-simples-tropical/20 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-simples-tropical rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-simples-tropical font-semibold">Event suggestion submitted!</p>
                      <p className="text-simples-tropical text-sm">Our events team will review your suggestion.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-3">
                    Event Name *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-simples-silver" />
                    <input
                      type="text"
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleInputChange}
                      className="w-full bg-simples-storm border border-simples-silver text-white placeholder-simples-silver rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-simples-ocean focus:border-transparent transition-all duration-300"
                      placeholder="What's your event vision?"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-3">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-simples-storm border border-simples-silver text-white placeholder-simples-silver rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-simples-ocean focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Describe your ideal event experience..."
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-3">
                    Suggested Date
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-simples-silver" />
                    <input
                      type="date"
                      name="suggestedDate"
                      value={formData.suggestedDate}
                      onChange={handleInputChange}
                      className="w-full bg-simples-storm border border-simples-silver text-white rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-simples-ocean focus:border-transparent transition-all duration-300"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-simples-silver" />
                      <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleInputChange}
                        className="w-full bg-simples-storm border border-simples-silver text-white placeholder-simples-silver rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-simples-ocean focus:border-transparent transition-all duration-300"
                        placeholder="Your name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-simples-silver" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-simples-storm border border-simples-silver text-white placeholder-simples-silver rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-simples-ocean focus:border-transparent transition-all duration-300"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <PremiumButton
                    onClick={closeModal}
                    variant="ghost"
                    size="large"
                    className="flex-1"
                  >
                    Cancel
                  </PremiumButton>
                  <PremiumButton
                    type="submit"
                    variant="primary"
                    size="large"
                    loading={loading}
                    disabled={loading}
                    icon={Send}
                    className="flex-1"
                  >
                    Submit Suggestion
                  </PremiumButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events; 