import React, { useState } from 'react';
import { BookOpen, Calendar, ArrowRight, User, Globe, Shield, Briefcase, Send, Plus, Eye, X } from 'lucide-react';

const Resources = () => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    authorName: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just show success message
    alert('Thank you for your submission! We\'ll review it and get back to you.');
    setShowSubmitModal(false);
    setFormData({ title: '', category: '', description: '', authorName: '' });
  };

  const categories = [
    {
      id: 'getting-started',
      emoji: '🟢',
      title: 'Getting Started',
      description: 'For new users learning the platform',
      color: 'from-green-500 to-green-600',
      posts: [
        {
          title: 'How to Set Up a Profile That Gets Attention',
          excerpt: 'Essential tips for creating an authentic profile that represents the real you while attracting meaningful connections.',
          readTime: '5 min read'
        },
        {
          title: 'Your First Week on Simples Connect: What to Do',
          excerpt: 'A step-by-step guide to navigating your first week and making the most of your experience.',
          readTime: '8 min read'
        },
        {
          title: 'Understanding Privacy Settings and Safety Features',
          excerpt: 'Learn how to control who sees your profile and how to use our safety tools effectively.',
          readTime: '6 min read'
        }
      ]
    },
    {
      id: 'diaspora-life',
      emoji: '🌍',
      title: 'Life in the Diaspora',
      description: 'Identity, belonging, and emotional wellbeing',
      color: 'from-blue-500 to-blue-600',
      posts: [
        {
          title: '5 Things Only Ugandans Abroad Understand',
          excerpt: 'From explaining your accent to navigating cultural differences - the unique experiences we all share.',
          readTime: '7 min read'
        },
        {
          title: 'How to Feel Grounded When You Miss Home',
          excerpt: 'Practical strategies for maintaining your cultural identity and connection to Uganda while building a new life.',
          readTime: '9 min read'
        },
        {
          title: 'Balancing Two Cultures: The Diaspora Experience',
          excerpt: 'Finding harmony between your Ugandan roots and your new country\'s customs.',
          readTime: '6 min read'
        }
      ]
    },
    {
      id: 'safety-support',
      emoji: '🔒',
      title: 'Safety & Support',
      description: 'Digital safety and mental health reminders',
      color: 'from-red-500 to-red-600',
      posts: [
        {
          title: 'How to Stay Safe While Making New Connections',
          excerpt: 'Essential safety tips for meeting new people online and taking relationships offline safely.',
          readTime: '10 min read'
        },
        {
          title: 'Blocking, Reporting & Controlling Your Experience',
          excerpt: 'Complete guide to our safety features and how to create boundaries that work for you.',
          readTime: '5 min read'
        },
        {
          title: 'Mental Health Resources for the Diaspora',
          excerpt: 'Finding support and maintaining mental wellness while navigating life abroad.',
          readTime: '8 min read'
        }
      ]
    },
    {
      id: 'hustle-growth',
      emoji: '💼',
      title: 'Hustle & Growth',
      description: 'Diaspora hustle, business, and self-improvement',
      color: 'from-purple-500 to-purple-600',
      posts: [
        {
          title: 'How to Promote Your Small Business (Without Being Spammy)',
          excerpt: 'Ethical networking strategies that build genuine relationships while growing your business.',
          readTime: '12 min read'
        },
        {
          title: 'Simple Ways to Build Your Brand on Social Media',
          excerpt: 'Authentic personal branding tips that honor your culture while building professional credibility.',
          readTime: '7 min read'
        },
        {
          title: 'Networking in the Diaspora: Quality Over Quantity',
          excerpt: 'How to build meaningful professional relationships that advance your career and community.',
          readTime: '9 min read'
        }
      ]
    }
  ];

  const latestPosts = [
    {
      date: 'December 28, 2024',
      title: 'How to Set Up Your Profile',
      category: 'Getting Started',
      categoryColor: 'bg-green-100 text-green-800'
    },
    {
      date: 'December 27, 2024',
      title: 'Feeling Homesick? Try This',
      category: 'Life in the Diaspora',
      categoryColor: 'bg-blue-100 text-blue-800'
    },
    {
      date: 'December 26, 2024',
      title: 'Stay Safe While Socializing Online',
      category: 'Safety & Support',
      categoryColor: 'bg-red-100 text-red-800'
    },
    {
      date: 'December 25, 2024',
      title: 'Promote Without Being Pushy',
      category: 'Hustle & Growth',
      categoryColor: 'bg-purple-100 text-purple-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-simples-cloud to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="w-12 h-12" />
            <h1 className="text-4xl md:text-6xl font-bold">
              Resources
            </h1>
          </div>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90">
            Stories, tips, and guides from the Ugandan diaspora community. 
            Real experiences, practical advice, and cultural wisdom to help you thrive.
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-simples-midnight text-center mb-16">
            Browse by Category
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {categories.map((category) => (
              <div key={category.id} className="bg-simples-cloud rounded-2xl overflow-hidden shadow-lg">
                <div className={`bg-gradient-to-r ${category.color} text-white p-6`}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl">{category.emoji}</span>
                    <div>
                      <h3 className="text-2xl font-bold">{category.title}</h3>
                      <p className="opacity-90">{category.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {category.posts.map((post, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl border border-simples-cloud hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-simples-midnight mb-2">
                        {post.title}
                      </h4>
                      <p className="text-simples-storm text-sm mb-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-simples-storm">
                          {post.readTime}
                        </span>
                        <button className="text-simples-ocean hover:text-simples-sky text-sm font-semibold flex items-center gap-1">
                          Read More <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Posts Section */}
      <div className="py-16 bg-simples-cloud">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-simples-midnight text-center mb-16">
            📰 Latest Posts
          </h2>
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-simples-midnight text-white">
                    <tr>
                      <th className="text-left p-4 font-semibold">🗓️ Date</th>
                      <th className="text-left p-4 font-semibold">📝 Title</th>
                      <th className="text-left p-4 font-semibold">📁 Category</th>
                      <th className="text-center p-4 font-semibold">🔗 Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestPosts.map((post, index) => (
                      <tr key={index} className="border-b border-simples-cloud hover:bg-simples-cloud transition-colors">
                        <td className="p-4 text-simples-storm">{post.date}</td>
                        <td className="p-4">
                          <span className="font-semibold text-simples-midnight">{post.title}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${post.categoryColor}`}>
                            {post.category}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button className="inline-flex items-center gap-2 text-simples-ocean hover:text-simples-sky font-semibold text-sm">
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Post Section */}
      <div className="py-16 bg-gradient-to-r from-simples-tropical to-simples-lavender text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Got a Story to Share?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Have a lesson, tip, or experience that could help the community? 
            We'd love to feature your story on our resources page.
          </p>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="inline-flex items-center gap-3 bg-white text-simples-midnight px-8 py-4 rounded-xl font-semibold hover:bg-simples-cloud transition-all duration-300 text-lg"
          >
            <Plus className="w-5 h-5" />
            Submit Your Post Idea
          </button>
        </div>
      </div>

      {/* Submit Post Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-simples-midnight">Submit Post Idea</h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-simples-storm hover:text-simples-midnight"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-simples-midnight mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-simples-cloud rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent outline-none"
                  placeholder="e.g., How to Navigate Family Expectations While Living Abroad"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-simples-midnight mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-simples-cloud rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent outline-none"
                >
                  <option value="">Select a category</option>
                  <option value="getting-started">🟢 Getting Started</option>
                  <option value="diaspora-life">🌍 Life in the Diaspora</option>
                  <option value="safety-support">🔒 Safety & Support</option>
                  <option value="hustle-growth">💼 Hustle & Growth</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-simples-midnight mb-2">
                  Brief Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-simples-cloud rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent outline-none resize-vertical"
                  placeholder="Tell us what your post would cover and why it would be valuable to the community..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-simples-midnight mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-simples-cloud rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent outline-none"
                  placeholder="How would you like to be credited?"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-6 py-3 border border-simples-cloud text-simples-storm rounded-xl hover:bg-simples-cloud transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-simples-ocean hover:bg-simples-sky text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources; 