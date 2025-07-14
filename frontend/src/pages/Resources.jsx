import React, { useState } from 'react';
import { BookOpen, Plus, Send, X, FileText, User, Lightbulb, Heart, MessageCircle, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Resources = () => {
  const { user } = useAuth();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    topicSuggestion: '',
    importanceReason: '',
    userName: ''
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
        .from('resource_requests')
        .insert([
          {
            user_id: user.id,
            topic_suggestion: formData.topicSuggestion,
            importance_reason: formData.importanceReason || null,
            user_name: formData.userName || null
          }
        ]);

      if (error) throw error;

      setSuccess(true);
      setFormData({
        topicSuggestion: '',
        importanceReason: '',
        userName: ''
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowRequestModal(false);
        setSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error submitting resource request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowRequestModal(false);
    setSuccess(false);
    setFormData({
      topicSuggestion: '',
      importanceReason: '',
      userName: ''
    });
  };

  const upcomingTopics = [
    {
      icon: Heart,
      title: "First Date Success",
      description: "Tips for making great first impressions",
      color: "from-simples-rose to-simples-lavender"
    },
    {
      icon: MessageCircle,
      title: "Conversation Starters",
      description: "Break the ice with meaningful questions",
      color: "from-simples-ocean to-simples-tropical"
    },
    {
      icon: Target,
      title: "Building Confidence",
      description: "Develop self-assurance in dating",
      color: "from-simples-lavender to-simples-sky"
    },
    {
      icon: Lightbulb,
      title: "Red Flags to Watch",
      description: "Identify warning signs early",
      color: "from-simples-tropical to-simples-ocean"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-simples-cloud via-simples-silver to-simples-light">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/50 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-simples-lavender to-simples-rose rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-simples-midnight">Resources</h1>
                <p className="text-simples-storm">Dating tips and relationship guidance</p>
              </div>
            </div>
            <button
              onClick={() => setShowRequestModal(true)}
              className="bg-gradient-to-r from-simples-lavender to-simples-rose text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Request a Topic
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card max-w-3xl mx-auto">
          {/* Main Empty State */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-r from-simples-lavender to-simples-rose rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-simples-midnight mb-4">
              We're building an amazing collection of dating tips and guides
            </h2>
            <p className="text-simples-storm text-lg leading-relaxed mb-6">
              Coming soon! Our resource library will be filled with expert advice, 
              practical tips, and guides to help you navigate the dating world with confidence.
            </p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-simples-cloud to-simples-silver rounded-full px-4 py-2 text-simples-storm">
              <div className="w-2 h-2 bg-simples-lavender rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Content in development</span>
            </div>
          </div>

          {/* What's Coming Section */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-simples-midnight mb-6 text-center">
              What's Coming Soon
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingTopics.map((topic, index) => (
                <div key={index} className="bg-white/60 rounded-xl p-6 hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
                  <div className={`w-12 h-12 bg-gradient-to-r ${topic.color} rounded-xl flex items-center justify-center mb-4`}>
                    <topic.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-simples-midnight mb-2">{topic.title}</h4>
                  <p className="text-simples-storm text-sm">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Request Section */}
          <div className="bg-gradient-to-r from-simples-cloud to-simples-silver rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-simples-lavender to-simples-rose rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-simples-midnight mb-4">
              Have a topic in mind?
            </h3>
            <p className="text-simples-storm mb-6 leading-relaxed">
              Help us prioritize content by suggesting topics you'd like to see covered. 
              Your input shapes our resource library!
            </p>
            <button
              onClick={() => setShowRequestModal(true)}
              className="bg-gradient-to-r from-simples-lavender to-simples-rose text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Request a Topic
            </button>
          </div>

          {/* Feature Preview */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-simples-midnight mb-2">Expert Guides</h4>
              <p className="text-simples-storm text-sm">Comprehensive guides from dating experts</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-simples-tropical to-simples-lavender rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-simples-midnight mb-2">Quick Tips</h4>
              <p className="text-simples-storm text-sm">Bite-sized advice for every situation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-simples-lavender to-simples-rose rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-simples-midnight mb-2">Success Stories</h4>
              <p className="text-simples-storm text-sm">Real experiences from our community</p>
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-simples-lavender to-simples-rose rounded-xl flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-simples-midnight">
                    Request a Topic
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
                      Topic request submitted successfully!
                    </p>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    We'll consider your suggestion for future content.
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-simples-midnight font-medium mb-2">
                    Topic Suggestion *
                  </label>
                  <div className="relative">
                    <Lightbulb className="absolute left-3 top-3 w-5 h-5 text-simples-storm" />
                    <textarea
                      name="topicSuggestion"
                      value={formData.topicSuggestion}
                      onChange={handleInputChange}
                      rows={3}
                      className="input-field pl-10 resize-none"
                      placeholder="What topic would you like us to cover? (e.g., 'How to handle rejection gracefully', 'Long-distance relationship tips')"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-simples-midnight font-medium mb-2">
                    Why is this important to you?
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-simples-storm" />
                    <textarea
                      name="importanceReason"
                      value={formData.importanceReason}
                      onChange={handleInputChange}
                      rows={4}
                      className="input-field pl-10 resize-none"
                      placeholder="Help us understand why this topic matters to you and others in our community..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-simples-midnight font-medium mb-2">
                    Your Name (optional)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-simples-storm" />
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      placeholder="Your name (optional)"
                    />
                  </div>
                </div>

                <div className="bg-simples-cloud/50 rounded-lg p-4">
                  <p className="text-simples-storm text-sm">
                    <strong>Note:</strong> All topic requests are reviewed by our content team. 
                    Popular requests will be prioritized for future guides and resources.
                  </p>
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
                    className="flex-1 bg-gradient-to-r from-simples-lavender to-simples-rose text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Request
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

export default Resources; 