import React, { useState } from 'react';
import { Calendar, Plus, Send, X, User, Mail, FileText, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

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

      // Close modal after 2 seconds
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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-simples-cloud via-simples-silver to-simples-light">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/50 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-simples-midnight">Events</h1>
                <p className="text-simples-storm">Connect through community gatherings</p>
              </div>
            </div>
            <button
              onClick={() => setShowSuggestionModal(true)}
              className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Suggest an Event
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Calendar className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-simples-midnight mb-4">
              No events scheduled yet
            </h2>
            <p className="text-simples-storm text-lg leading-relaxed">
              Check back soon for exciting meetups and community gatherings! 
              We're working on bringing amazing events to connect our community.
            </p>
          </div>

          <div className="bg-gradient-to-r from-simples-cloud to-simples-silver rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-simples-midnight mb-2">
              Have an event idea?
            </h3>
            <p className="text-simples-storm mb-4">
              Help us create memorable experiences by suggesting events you'd love to attend.
            </p>
            <button
              onClick={() => setShowSuggestionModal(true)}
              className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Suggest an Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-simples-tropical to-simples-sky rounded-xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-simples-midnight mb-2">Meetups</h4>
              <p className="text-simples-storm text-sm">Connect with other singles in your area</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-simples-lavender to-simples-rose rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-simples-midnight mb-2">Activities</h4>
              <p className="text-simples-storm text-sm">Fun group activities and workshops</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-simples-ocean to-simples-tropical rounded-xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-simples-midnight mb-2">Special Events</h4>
              <p className="text-simples-storm text-sm">Unique experiences and celebrations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestion Modal */}
      {showSuggestionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-xl flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-simples-midnight">
                    Suggest an Event
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="text-simples-storm hover:text-simples-midnight transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-green-800 font-semibold">
                      Event suggestion submitted successfully!
                    </p>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    We'll review your suggestion and get back to you soon.
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-simples-midnight font-medium mb-2">
                    Event Name *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-simples-storm" />
                    <input
                      type="text"
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      placeholder="What's your event idea?"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-simples-midnight font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Tell us more about your event idea..."
                  />
                </div>

                <div>
                  <label className="block text-simples-midnight font-medium mb-2">
                    Suggested Date
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-simples-storm" />
                    <input
                      type="date"
                      name="suggestedDate"
                      value={formData.suggestedDate}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-simples-midnight font-medium mb-2">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-simples-storm" />
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-simples-midnight font-medium mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-simples-storm" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-simples-silver text-simples-midnight px-6 py-3 rounded-xl font-semibold hover:bg-simples-storm/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Suggestion
                      </>
                    )}
                  </button>
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