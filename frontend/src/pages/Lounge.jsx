import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  Music, 
  MessageCircle, 
  HelpCircle, 
  Plus, 
  Send, 
  X, 
  Play, 
  Upload, 
  User, 
  FileText, 
  Link,
  Image as ImageIcon,
  ExternalLink,
  ThumbsUp,
  Heart
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import YouTubePlayer from '../components/YouTubePlayer';

const Lounge = () => {
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [musicSubmissions, setMusicSubmissions] = useState([]);
  const [featuredPodcast, setFeaturedPodcast] = useState(null);

  // Form states
  const [musicFormData, setMusicFormData] = useState({
    artistName: '',
    songTitle: '',
    youtubeUrl: '',
    albumCoverUrl: '',
    genre: ''
  });

  const [storyFormData, setStoryFormData] = useState({
    title: '',
    content: '',
    anonymous: false
  });

  const [questionFormData, setQuestionFormData] = useState({
    title: '',
    content: '',
    anonymous: false
  });

  useEffect(() => {
    loadMusicSubmissions();
  }, []);

  const loadMusicSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('music_submissions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      setMusicSubmissions(data || []);
    } catch (error) {
      console.error('Error loading music submissions:', error);
    }
  };

  const handleInputChange = (formType, field, value) => {
    if (formType === 'music') {
      setMusicFormData(prev => ({ ...prev, [field]: value }));
    } else if (formType === 'story') {
      setStoryFormData(prev => ({ ...prev, [field]: value }));
    } else if (formType === 'question') {
      setQuestionFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (formType) => {
    setLoading(true);
    
    try {
      let tableName, data;
      
      if (formType === 'music') {
        tableName = 'music_submissions';
        data = {
          user_id: user.id,
          artist_name: musicFormData.artistName,
          song_title: musicFormData.songTitle,
          youtube_url: musicFormData.youtubeUrl,
          album_cover_url: musicFormData.albumCoverUrl || null,
          genre: musicFormData.genre || null
        };
      } else if (formType === 'story') {
        tableName = 'lounge_posts';
        data = {
          user_id: user.id,
          title: storyFormData.title,
          content: storyFormData.content,
          post_type: 'story',
          is_anonymous: storyFormData.anonymous
        };
      } else if (formType === 'question') {
        tableName = 'lounge_posts';
        data = {
          user_id: user.id,
          title: questionFormData.title,
          content: questionFormData.content,
          post_type: 'question',
          is_anonymous: questionFormData.anonymous
        };
      }

      const { error } = await supabase
        .from(tableName)
        .insert([data]);

      if (error) throw error;

      setSuccess(true);
      
      // Reset form
      if (formType === 'music') {
        setMusicFormData({
          artistName: '',
          songTitle: '',
          youtubeUrl: '',
          albumCoverUrl: '',
          genre: ''
        });
      } else if (formType === 'story') {
        setStoryFormData({
          title: '',
          content: '',
          anonymous: false
        });
      } else if (formType === 'question') {
        setQuestionFormData({
          title: '',
          content: '',
          anonymous: false
        });
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        setActiveModal(null);
        setSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSuccess(false);
    setMusicFormData({
      artistName: '',
      songTitle: '',
      youtubeUrl: '',
      albumCoverUrl: '',
      genre: ''
    });
    setStoryFormData({
      title: '',
      content: '',
      anonymous: false
    });
    setQuestionFormData({
      title: '',
      content: '',
      anonymous: false
    });
  };

  const extractYouTubeId = (url) => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-simples-cloud via-simples-silver to-simples-light">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/50 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-simples-tropical to-simples-lavender rounded-xl flex items-center justify-center shadow-lg">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-simples-midnight">Lounge</h1>
              <p className="text-simples-storm">Relax, discover, and connect with the community</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* DiaLuv Podcast Section */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-simples-rose to-simples-lavender rounded-xl flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-simples-midnight">DiaLuv Podcast</h2>
                <p className="text-simples-storm text-sm">Dating insights and real talk</p>
              </div>
            </div>
            
            <YouTubePlayer
              videoId={featuredPodcast?.youtube_id || null}
              title="Latest DiaLuv Episode"
              className="mb-4"
              placeholder={
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-simples-rose to-simples-lavender rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-simples-storm text-lg font-medium mb-2">DiaLuv Podcast</p>
                  <p className="text-simples-storm/70">Latest episode coming soon!</p>
                </div>
              }
            />
            
            <div className="bg-gradient-to-r from-simples-cloud to-simples-silver rounded-lg p-4">
              <p className="text-simples-storm text-sm mb-2">
                <strong>Coming Soon:</strong> Weekly episodes covering dating tips, relationship advice, and real stories from our community.
              </p>
              <button className="text-simples-ocean hover:text-simples-midnight transition-colors text-sm font-medium flex items-center gap-1">
                <ExternalLink className="w-4 h-4" />
                Subscribe for updates
              </button>
            </div>
          </div>

          {/* Vibes & Music Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-simples-ocean to-simples-tropical rounded-xl flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-simples-midnight">Vibes & Music</h2>
                  <p className="text-simples-storm text-sm">Discover new sounds</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal('music')}
                className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Submit Music
              </button>
            </div>

            {/* Featured Track */}
            {musicSubmissions.length > 0 && (
              <div className="mb-6">
                <YouTubePlayer
                  videoId={musicSubmissions[0].youtube_url}
                  title={`${musicSubmissions[0].artist_name} - ${musicSubmissions[0].song_title}`}
                  className="mb-3"
                />
                <div className="flex items-center gap-3">
                  {musicSubmissions[0].album_cover_url && (
                    <img 
                      src={musicSubmissions[0].album_cover_url} 
                      alt="Album cover"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-simples-midnight">{musicSubmissions[0].song_title}</h3>
                    <p className="text-simples-storm text-sm">{musicSubmissions[0].artist_name}</p>
                    {musicSubmissions[0].genre && (
                      <p className="text-simples-storm/70 text-xs">{musicSubmissions[0].genre}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Music Grid */}
            {musicSubmissions.length > 1 && (
              <div>
                <h3 className="font-semibold text-simples-midnight mb-3">Featured Tracks</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {musicSubmissions.slice(1, 7).map((track, index) => (
                    <div key={track.id} className="bg-white/60 rounded-lg p-3 hover:bg-white/80 transition-colors cursor-pointer">
                      {track.album_cover_url ? (
                        <img 
                          src={track.album_cover_url} 
                          alt="Album cover"
                          className="w-full aspect-square rounded-lg object-cover mb-2"
                        />
                      ) : (
                        <div className="w-full aspect-square bg-gradient-to-br from-simples-ocean to-simples-sky rounded-lg flex items-center justify-center mb-2">
                          <Music className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <p className="text-simples-midnight font-medium text-sm truncate">{track.song_title}</p>
                      <p className="text-simples-storm text-xs truncate">{track.artist_name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {musicSubmissions.length === 0 && (
              <div className="text-center py-8">
                <Music className="w-16 h-16 text-simples-storm/50 mx-auto mb-4" />
                <p className="text-simples-storm">No music submitted yet</p>
                <p className="text-simples-storm/70 text-sm">Be the first to share your favorite tracks!</p>
              </div>
            )}
          </div>

          {/* Share Your Story Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-simples-lavender to-simples-rose rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-simples-midnight">Share Your Story</h2>
                  <p className="text-simples-storm text-sm">Dating experiences and memories</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal('story')}
                className="bg-gradient-to-r from-simples-lavender to-simples-rose text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Share Story
              </button>
            </div>

            <div className="bg-gradient-to-r from-simples-cloud to-simples-silver rounded-lg p-6 text-center">
              <MessageCircle className="w-16 h-16 text-simples-storm/50 mx-auto mb-4" />
              <h3 className="font-semibold text-simples-midnight mb-2">Share Your Journey</h3>
              <p className="text-simples-storm text-sm mb-4">
                Have a dating story, success story, or life experience to share? 
                Help inspire others in our community.
              </p>
              <button
                onClick={() => setActiveModal('story')}
                className="bg-gradient-to-r from-simples-lavender to-simples-rose text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Share Your Story
              </button>
            </div>
          </div>

          {/* Ask the Community Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-simples-ocean to-simples-lavender rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-simples-midnight">Ask the Community</h2>
                  <p className="text-simples-storm text-sm">Get advice and insights</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal('question')}
                className="bg-gradient-to-r from-simples-ocean to-simples-lavender text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ask Question
              </button>
            </div>

            <div className="bg-gradient-to-r from-simples-cloud to-simples-silver rounded-lg p-6 text-center">
              <HelpCircle className="w-16 h-16 text-simples-storm/50 mx-auto mb-4" />
              <h3 className="font-semibold text-simples-midnight mb-2">Need Dating Advice?</h3>
              <p className="text-simples-storm text-sm mb-4">
                Ask our community for advice on dating, relationships, and personal growth. 
                Get support from people who understand.
              </p>
              <button
                onClick={() => setActiveModal('question')}
                className="bg-gradient-to-r from-simples-ocean to-simples-lavender text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Ask Question
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-lg">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activeModal === 'music' ? 'bg-gradient-to-r from-simples-ocean to-simples-sky' :
                    activeModal === 'story' ? 'bg-gradient-to-r from-simples-lavender to-simples-rose' :
                    'bg-gradient-to-r from-simples-ocean to-simples-lavender'
                  }`}>
                    {activeModal === 'music' ? <Music className="w-5 h-5 text-white" /> :
                     activeModal === 'story' ? <Heart className="w-5 h-5 text-white" /> :
                     <HelpCircle className="w-5 h-5 text-white" />}
                  </div>
                  <h2 className="text-xl font-bold text-simples-midnight">
                    {activeModal === 'music' ? 'Submit Music' :
                     activeModal === 'story' ? 'Share Your Story' :
                     'Ask the Community'}
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
                      {activeModal === 'music' ? 'Music submitted successfully!' :
                       activeModal === 'story' ? 'Story shared successfully!' :
                       'Question submitted successfully!'}
                    </p>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    We'll review your submission and get back to you soon.
                  </p>
                </div>
              )}

              {/* Music Form */}
              {activeModal === 'music' && (
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit('music'); }} className="space-y-4">
                  <div>
                    <label className="block text-simples-midnight font-medium mb-2">Artist Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-simples-storm" />
                      <input
                        type="text"
                        value={musicFormData.artistName}
                        onChange={(e) => handleInputChange('music', 'artistName', e.target.value)}
                        className="input-field pl-10"
                        placeholder="Artist or band name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-simples-midnight font-medium mb-2">Song Title *</label>
                    <div className="relative">
                      <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-simples-storm" />
                      <input
                        type="text"
                        value={musicFormData.songTitle}
                        onChange={(e) => handleInputChange('music', 'songTitle', e.target.value)}
                        className="input-field pl-10"
                        placeholder="Song title"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-simples-midnight font-medium mb-2">YouTube URL *</label>
                    <div className="relative">
                      <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-simples-storm" />
                      <input
                        type="url"
                        value={musicFormData.youtubeUrl}
                        onChange={(e) => handleInputChange('music', 'youtubeUrl', e.target.value)}
                        className="input-field pl-10"
                        placeholder="https://www.youtube.com/watch?v=..."
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-simples-midnight font-medium mb-2">Album Cover URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-simples-storm" />
                      <input
                        type="url"
                        value={musicFormData.albumCoverUrl}
                        onChange={(e) => handleInputChange('music', 'albumCoverUrl', e.target.value)}
                        className="input-field pl-10"
                        placeholder="https://example.com/cover.jpg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-simples-midnight font-medium mb-2">Genre</label>
                    <input
                      type="text"
                      value={musicFormData.genre}
                      onChange={(e) => handleInputChange('music', 'genre', e.target.value)}
                      className="input-field"
                      placeholder="e.g., Pop, Rock, R&B, Hip-Hop"
                    />
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
                      className="flex-1 bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Music
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Story Form */}
              {activeModal === 'story' && (
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit('story'); }} className="space-y-4">
                  <div>
                    <label className="block text-simples-midnight font-medium mb-2">Story Title *</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-simples-storm" />
                      <input
                        type="text"
                        value={storyFormData.title}
                        onChange={(e) => handleInputChange('story', 'title', e.target.value)}
                        className="input-field pl-10"
                        placeholder="Give your story a title"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-simples-midnight font-medium mb-2">Your Story *</label>
                    <textarea
                      value={storyFormData.content}
                      onChange={(e) => handleInputChange('story', 'content', e.target.value)}
                      rows={6}
                      className="input-field resize-none"
                      placeholder="Share your dating experience, success story, or life journey..."
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="story-anonymous"
                      checked={storyFormData.anonymous}
                      onChange={(e) => handleInputChange('story', 'anonymous', e.target.checked)}
                      className="w-4 h-4 text-simples-ocean rounded focus:ring-simples-sky"
                    />
                    <label htmlFor="story-anonymous" className="text-simples-midnight">
                      Post anonymously
                    </label>
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
                      className="flex-1 bg-gradient-to-r from-simples-lavender to-simples-rose text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Sharing...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Share Story
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Question Form */}
              {activeModal === 'question' && (
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit('question'); }} className="space-y-4">
                  <div>
                    <label className="block text-simples-midnight font-medium mb-2">Question Title *</label>
                    <div className="relative">
                      <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-simples-storm" />
                      <input
                        type="text"
                        value={questionFormData.title}
                        onChange={(e) => handleInputChange('question', 'title', e.target.value)}
                        className="input-field pl-10"
                        placeholder="What's your question about?"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-simples-midnight font-medium mb-2">Your Question *</label>
                    <textarea
                      value={questionFormData.content}
                      onChange={(e) => handleInputChange('question', 'content', e.target.value)}
                      rows={6}
                      className="input-field resize-none"
                      placeholder="Ask for advice about dating, relationships, or personal growth..."
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="question-anonymous"
                      checked={questionFormData.anonymous}
                      onChange={(e) => handleInputChange('question', 'anonymous', e.target.checked)}
                      className="w-4 h-4 text-simples-ocean rounded focus:ring-simples-sky"
                    />
                    <label htmlFor="question-anonymous" className="text-simples-midnight">
                      Ask anonymously
                    </label>
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
                      className="flex-1 bg-gradient-to-r from-simples-ocean to-simples-lavender text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Asking...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Ask Question
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lounge; 