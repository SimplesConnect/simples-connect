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
  Heart,
  Sparkles,
  Crown,
  Mic,
  Volume2,
  Pause,
  BookOpen,
  Users
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import YouTubePlayer from '../components/YouTubePlayer';
import AudioPlayer from '../components/AudioPlayer';
import { VideoThumbnail, MusicCard, PremiumButton } from '../components/premium';

const Lounge = () => {
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [musicSubmissions, setMusicSubmissions] = useState([]);
  const [currentVideoId, setCurrentVideoId] = useState('DQOI1r_w0jM');
  const [playingTrack, setPlayingTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Audio player state
  const [audioTracks, setAudioTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loadingTracks, setLoadingTracks] = useState(true);

  // Podcast episodes data
  const podcastEpisodes = [
    {
      videoId: 'DQOI1r_w0jM',
      title: 'Finding Love in the Digital Age',
      duration: '24:35',
      description: 'Exploring modern dating challenges and opportunities'
    },
    {
      videoId: '1YBy_lY8x-w',
      title: 'Red Flags vs. Deal Breakers',
      duration: '18:42',
      description: 'Understanding the difference and when to walk away'
    },
    {
      videoId: 'g5tKYQqv9C0',
      title: 'Building Authentic Connections',
      duration: '22:15',
      description: 'Moving beyond surface-level conversations'
    },
    {
      videoId: 'Pj31fPShCzo',
      title: 'Self-Love Before Partnership',
      duration: '26:08',
      description: 'Why being complete alone makes you a better partner'
    },
    {
      videoId: 'eZ7buMHGXGk',
      title: 'Communication in Relationships',
      duration: '19:53',
      description: 'Essential skills for healthy partnerships'
    }
  ];

  // Featured song (from Suno or similar)
  const featuredSong = {
    id: 'featured',
    artist_name: 'Suno AI',
    song_title: 'Love\'s Digital Dream',
    album_cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    genre: 'Electronic Pop',
    url: 'https://suno.com/s/TKGt8pl7IZygtARp'
  };

  // Sample music data
  const sampleMusicTracks = [
    {
      id: 1,
      artist_name: 'Alicia Keys',
      song_title: 'Fallin\'',
      youtube_url: 'https://www.youtube.com/watch?v=Urdgz4Nxp6Q',
      album_cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      genre: 'R&B'
    },
    {
      id: 2,
      artist_name: 'John Legend',
      song_title: 'All of Me',
      youtube_url: 'https://www.youtube.com/watch?v=450p7goxZqg',
      album_cover_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
      genre: 'Pop'
    },
    {
      id: 3,
      artist_name: 'Adele',
      song_title: 'Someone Like You',
      youtube_url: 'https://www.youtube.com/watch?v=hLQl3WQQoQ0',
      album_cover_url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop',
      genre: 'Soul'
    }
  ];

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
      
      // Combine with sample data if no submissions exist
      const allTracks = data && data.length > 0 ? data : sampleMusicTracks;
      setMusicSubmissions(allTracks);
    } catch (error) {
      console.error('Error loading music submissions:', error);
      setMusicSubmissions(sampleMusicTracks);
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

  const handleVideoClick = (videoId) => {
    setCurrentVideoId(videoId);
  };

  const handlePlayTrack = (trackId) => {
    setPlayingTrack(trackId);
  };

  const handlePauseTrack = () => {
    setPlayingTrack(null);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Fetch audio tracks from database
  const fetchAudioTracks = async () => {
    try {
      setLoadingTracks(true);
      const response = await fetch('/api/audio/tracks?featured=true&limit=10');
      const data = await response.json();
      
      if (data.success && data.tracks) {
        setAudioTracks(data.tracks);
      }
    } catch (error) {
      console.error('Error fetching audio tracks:', error);
    } finally {
      setLoadingTracks(false);
    }
  };

  // Load audio tracks on component mount
  useEffect(() => {
    fetchAudioTracks();
  }, []);

  const handleTrackChange = (newIndex) => {
    setCurrentTrackIndex(newIndex);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <main className="px-4 md:px-6 py-6 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="card">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-simples-tropical to-simples-lavender rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-simples-ocean to-simples-sky bg-clip-text text-transparent mb-4">
                The Lounge
              </h1>
              
              <p className="text-base md:text-lg text-simples-storm mb-6 max-w-3xl mx-auto leading-relaxed">
                Where culture, music, and meaningful conversations create magic
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - DiaLuv Show */}
          <div className="lg:col-span-2">
            {/* DiaLuv Show Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-simples-rose to-simples-lavender rounded-2xl flex items-center justify-center">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-simples-midnight">DiaLuv Show</h2>
                    <p className="text-simples-storm">Dating insights and real conversations</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-simples-storm">
                  <div className="w-2 h-2 bg-simples-rose rounded-full animate-pulse" />
                  <span className="text-sm">Live Series</span>
                </div>
              </div>

              {/* Main Video Player */}
              <div className="bg-gradient-to-br from-simples-midnight to-simples-storm rounded-3xl p-6 shadow-2xl border border-simples-silver mb-6">
                <YouTubePlayer
                  videoId={currentVideoId}
                  title={podcastEpisodes.find(ep => ep.videoId === currentVideoId)?.title || "DiaLuv Show"}
                  className="mb-6 rounded-2xl overflow-hidden"
                />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {podcastEpisodes.find(ep => ep.videoId === currentVideoId)?.title}
                    </h3>
                    <p className="text-simples-silver text-sm">
                      {podcastEpisodes.find(ep => ep.videoId === currentVideoId)?.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-simples-silver">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">247</span>
                    </div>
                    <div className="flex items-center gap-1 text-simples-silver">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">89</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Episode Queue - Horizontal */}
              <div className="bg-gradient-to-br from-simples-midnight to-simples-storm rounded-3xl p-6 shadow-2xl border border-simples-silver">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-simples-ocean" />
                  Episode Queue
                </h3>
                
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-simples-storm scrollbar-thumb-simples-silver">
                  {podcastEpisodes.map((episode, index) => (
                    <div key={episode.videoId} className="flex-shrink-0 w-64">
                      <VideoThumbnail
                        videoId={episode.videoId}
                        title={episode.title}
                        duration={episode.duration}
                        description={episode.description}
                        isActive={currentVideoId === episode.videoId}
                        onClick={handleVideoClick}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Community Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Vibe + Music Card */}
            {loadingTracks ? (
              <div className="bg-gradient-to-br from-simples-midnight to-simples-storm rounded-3xl p-6 shadow-2xl border border-simples-silver">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-simples-lavender to-simples-rose rounded-xl flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Vibe + Music</h3>
                    <p className="text-simples-silver text-sm">Loading tracks...</p>
                  </div>
                </div>
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-simples-ocean border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            ) : audioTracks.length > 0 ? (
              <AudioPlayer 
                tracks={audioTracks}
                currentTrackIndex={currentTrackIndex}
                onTrackChange={handleTrackChange}
                showQueue={true}
                className="shadow-2xl border border-simples-silver"
              />
            ) : (
              <div className="bg-gradient-to-br from-simples-midnight to-simples-storm rounded-3xl p-6 shadow-2xl border border-simples-silver">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-simples-lavender to-simples-rose rounded-xl flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Vibe + Music</h3>
                    <p className="text-simples-silver text-sm">No tracks available</p>
                  </div>
                </div>
                <div className="text-center py-8">
                  <p className="text-simples-cloud text-sm">
                    Audio tracks will appear here once uploaded and approved.
                  </p>
                </div>
              </div>
            )}

            {/* Ask a Question Card */}
            <div className="bg-gradient-to-br from-simples-midnight to-simples-storm rounded-3xl p-6 shadow-2xl border border-simples-silver">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-simples-tropical to-simples-lavender rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Ask a Question</h3>
                  <p className="text-simples-silver text-sm">Get community wisdom</p>
                </div>
              </div>

              <div className="text-center py-4">
                <div className="w-12 h-12 bg-gradient-to-r from-simples-tropical to-simples-lavender rounded-xl flex items-center justify-center mx-auto mb-3">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <p className="text-simples-silver text-sm mb-4 leading-relaxed">
                  Ask questions about dating, relationships, and personal growth.
                </p>
                <div className="space-y-2">
                  <PremiumButton
                    onClick={() => setActiveModal('question')}
                    variant="primary"
                    size="small"
                    icon={HelpCircle}
                    className="w-full bg-gradient-to-r from-simples-tropical to-simples-lavender text-white font-medium"
                  >
                    Ask Question
                  </PremiumButton>
                  <PremiumButton
                    onClick={() => window.open('/questions', '_blank')}
                    variant="outline"
                    size="small"
                    icon={BookOpen}
                    className="w-full border-simples-silver text-simples-silver hover:bg-simples-silver hover:text-simples-midnight"
                  >
                    Answer Questions
                  </PremiumButton>
                </div>
              </div>
            </div>

            {/* Share Your Story Card */}
            <div className="bg-gradient-to-br from-simples-midnight to-simples-storm rounded-3xl p-6 shadow-2xl border border-simples-silver">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-simples-rose to-simples-lavender rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Share Your Story</h3>
                  <p className="text-simples-silver text-sm">Inspire others</p>
                </div>
              </div>

              <div className="text-center py-4">
                <div className="w-12 h-12 bg-gradient-to-r from-simples-rose to-simples-lavender rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <p className="text-simples-silver text-sm mb-4 leading-relaxed">
                  Share your dating experiences and moments of growth.
                </p>
                <div className="space-y-2">
                  <PremiumButton
                    onClick={() => setActiveModal('story')}
                    variant="primary"
                    size="small"
                    icon={Heart}
                    className="w-full bg-gradient-to-r from-simples-rose to-simples-lavender text-white font-medium"
                  >
                    Share Story
                  </PremiumButton>
                  <PremiumButton
                    onClick={() => window.open('/stories', '_blank')}
                    variant="outline"
                    size="small"
                    icon={Users}
                    className="w-full border-simples-silver text-simples-silver hover:bg-simples-silver hover:text-simples-midnight"
                  >
                    Read Stories
                  </PremiumButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>

      {/* Enhanced Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-simples-midnight to-simples-storm rounded-3xl shadow-2xl border border-simples-silver w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    activeModal === 'music' ? 'bg-gradient-to-r from-simples-lavender to-simples-rose' :
                    activeModal === 'story' ? 'bg-gradient-to-r from-simples-rose to-simples-lavender' :
                    'bg-gradient-to-r from-simples-tropical to-simples-lavender'
                  }`}>
                    {activeModal === 'music' ? <Music className="w-6 h-6 text-white" /> :
                     activeModal === 'story' ? <Heart className="w-6 h-6 text-white" /> :
                     <HelpCircle className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {activeModal === 'music' ? 'Submit Music' :
                       activeModal === 'story' ? 'Share Your Story' :
                       'Ask the Community'}
                    </h2>
                    <p className="text-simples-silver">
                      {activeModal === 'music' ? 'Share music that moves your soul' :
                       activeModal === 'story' ? 'Your journey inspires others' :
                       'Get wisdom from our community'}
                    </p>
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
                      <p className="text-simples-tropical font-semibold">
                        {activeModal === 'music' ? 'Music submitted successfully!' :
                         activeModal === 'story' ? 'Story shared successfully!' :
                         'Question submitted successfully!'}
                      </p>
                      <p className="text-simples-tropical text-sm">Thank you for contributing to our community.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Form Content */}
              {activeModal === 'music' && (
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit('music'); }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-3">Artist Name *</label>
                      <input
                        type="text"
                        value={musicFormData.artistName}
                        onChange={(e) => handleInputChange('music', 'artistName', e.target.value)}
                        className="w-full bg-simples-storm border border-simples-silver text-white placeholder-simples-silver rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-simples-ocean focus:border-transparent transition-all duration-300"
                        placeholder="Artist or band name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-3">Song Title *</label>
                      <input
                        type="text"
                        value={musicFormData.songTitle}
                        onChange={(e) => handleInputChange('music', 'songTitle', e.target.value)}
                        className="w-full bg-simples-storm border border-simples-silver text-white placeholder-simples-silver rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-simples-ocean focus:border-transparent transition-all duration-300"
                        placeholder="Song title"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-3">YouTube URL *</label>
                    <input
                      type="url"
                      value={musicFormData.youtubeUrl}
                      onChange={(e) => handleInputChange('music', 'youtubeUrl', e.target.value)}
                      className="w-full bg-simples-storm border border-simples-silver text-white placeholder-simples-silver rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-simples-ocean focus:border-transparent transition-all duration-300"
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-3">Album Cover URL</label>
                      <input
                        type="url"
                        value={musicFormData.albumCoverUrl}
                        onChange={(e) => handleInputChange('music', 'albumCoverUrl', e.target.value)}
                        className="w-full bg-simples-storm border border-simples-silver text-white placeholder-simples-silver rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-simples-ocean focus:border-transparent transition-all duration-300"
                        placeholder="https://example.com/cover.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-3">Genre</label>
                      <input
                        type="text"
                        value={musicFormData.genre}
                        onChange={(e) => handleInputChange('music', 'genre', e.target.value)}
                        className="w-full bg-simples-storm border border-simples-silver text-white placeholder-simples-silver rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-simples-ocean focus:border-transparent transition-all duration-300"
                        placeholder="e.g., Pop, Rock, R&B"
                      />
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
                      Submit Music
                    </PremiumButton>
                  </div>
                </form>
              )}

              {(activeModal === 'story' || activeModal === 'question') && (
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(activeModal); }} className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-3">
                      {activeModal === 'story' ? 'Story Title *' : 'Question Title *'}
                    </label>
                    <input
                      type="text"
                      value={activeModal === 'story' ? storyFormData.title : questionFormData.title}
                      onChange={(e) => handleInputChange(activeModal, 'title', e.target.value)}
                      className="w-full bg-simples-storm border border-simples-silver text-white placeholder-simples-silver rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-simples-ocean focus:border-transparent transition-all duration-300"
                      placeholder={activeModal === 'story' ? 'Give your story a title' : 'What\'s your question about?'}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-3">
                      {activeModal === 'story' ? 'Your Story *' : 'Your Question *'}
                    </label>
                    <textarea
                      value={activeModal === 'story' ? storyFormData.content : questionFormData.content}
                      onChange={(e) => handleInputChange(activeModal, 'content', e.target.value)}
                      rows={6}
                      className="w-full bg-simples-storm border border-simples-silver text-white placeholder-simples-silver rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-simples-ocean focus:border-transparent transition-all duration-300 resize-none"
                      placeholder={activeModal === 'story' ? 'Share your dating experience or life journey...' : 'Ask for advice about dating, relationships, or personal growth...'}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`${activeModal}-anonymous`}
                      checked={activeModal === 'story' ? storyFormData.anonymous : questionFormData.anonymous}
                      onChange={(e) => handleInputChange(activeModal, 'anonymous', e.target.checked)}
                      className="w-5 h-5 text-simples-ocean bg-simples-storm border-simples-silver rounded focus:ring-simples-ocean focus:ring-2"
                    />
                    <label htmlFor={`${activeModal}-anonymous`} className="text-white font-medium">
                      {activeModal === 'story' ? 'Post anonymously' : 'Ask anonymously'}
                    </label>
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
                      {activeModal === 'story' ? 'Share Story' : 'Ask Question'}
                    </PremiumButton>
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