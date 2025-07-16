import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Heart,
  MoreHorizontal,
  Repeat,
  Shuffle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const AudioPlayer = ({ 
  tracks = [], 
  currentTrackIndex = 0, 
  onTrackChange,
  showQueue = true,
  className = ""
}) => {
  const { user } = useAuth();
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [likedTracks, setLikedTracks] = useState(new Set());
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [playStartTime, setPlayStartTime] = useState(null);

  const currentTrack = tracks[currentTrackIndex];

  // Load user's liked tracks
  useEffect(() => {
    if (user && tracks.length > 0) {
      loadLikedTracks();
    }
  }, [user, tracks]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => handleTrackEnd();
    const handleError = (e) => {
      setError('Failed to load audio');
      setIsLoading(false);
      console.error('Audio error:', e);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrack]);

  // Load the current track
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const audio = audioRef.current;
      audio.src = currentTrack.file_url;
      audio.volume = volume;
      setError(null);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [currentTrack, volume]);

  const loadLikedTracks = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const trackIds = tracks.map(track => track.id);
      const { data: likes } = await supabase
        .from('audio_likes')
        .select('track_id')
        .in('track_id', trackIds)
        .eq('user_id', user.id);

      if (likes) {
        setLikedTracks(new Set(likes.map(like => like.track_id)));
      }
    } catch (error) {
      console.error('Error loading liked tracks:', error);
    }
  };

  const recordPlay = async (trackId, playDuration, completed) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (session) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      await fetch('/api/audio/play', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          trackId,
          playDuration,
          completed
        })
      });
    } catch (error) {
      console.error('Error recording play:', error);
    }
  };

  const toggleLike = async (trackId) => {
    if (!user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/audio/play', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ trackId })
      });

      const data = await response.json();
      if (data.success) {
        setLikedTracks(prev => {
          const newSet = new Set(prev);
          if (data.liked) {
            newSet.add(trackId);
          } else {
            newSet.delete(trackId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
      // Record partial play
      if (playStartTime) {
        const playDuration = Date.now() - playStartTime;
        await recordPlay(currentTrack.id, Math.floor(playDuration / 1000), false);
      }
      setPlayStartTime(null);
    } else {
      try {
        await audio.play();
        setPlayStartTime(Date.now());
      } catch (error) {
        setError('Failed to play audio');
        console.error('Play error:', error);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrackEnd = async () => {
    setIsPlaying(false);
    
    // Record completed play
    if (playStartTime && currentTrack) {
      const playDuration = Date.now() - playStartTime;
      await recordPlay(currentTrack.id, Math.floor(playDuration / 1000), true);
    }
    setPlayStartTime(null);

    // Handle repeat/shuffle logic
    if (isRepeat) {
      // Replay current track
      const audio = audioRef.current;
      audio.currentTime = 0;
      audio.play();
      setIsPlaying(true);
      setPlayStartTime(Date.now());
    } else {
      // Move to next track
      nextTrack();
    }
  };

  const nextTrack = () => {
    if (tracks.length === 0) return;
    
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % tracks.length;
    }
    
    onTrackChange?.(nextIndex);
  };

  const prevTrack = () => {
    if (tracks.length === 0) return;
    
    let prevIndex;
    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * tracks.length);
    } else {
      prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    }
    
    onTrackChange?.(prevIndex);
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return (
      <div className={`bg-gradient-to-r from-simples-midnight to-simples-storm rounded-2xl p-6 text-white ${className}`}>
        <div className="text-center">
          <p className="text-simples-cloud">No tracks available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-simples-midnight to-simples-storm rounded-2xl p-6 text-white ${className}`}>
      <audio ref={audioRef} preload="metadata" />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-simples-lavender to-simples-rose rounded-2xl flex items-center justify-center">
          <Play className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Vibe + Music</h3>
          <p className="text-simples-cloud">Feel the rhythm</p>
        </div>
      </div>

      {/* Current Track */}
      <div className="flex items-center gap-4 mb-6">
        <img 
          src={currentTrack.cover_image_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop'} 
          alt={currentTrack.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">{currentTrack.title}</h4>
          <p className="text-simples-cloud truncate">{currentTrack.artist_name}</p>
        </div>
        <button 
          onClick={() => toggleLike(currentTrack.id)}
          className={`p-2 rounded-full transition-colors ${
            likedTracks.has(currentTrack.id) 
              ? 'text-simples-rose hover:text-red-400' 
              : 'text-simples-cloud hover:text-white'
          }`}
          disabled={!user}
        >
          <Heart className={`w-5 h-5 ${likedTracks.has(currentTrack.id) ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-simples-cloud mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div 
          ref={progressRef}
          className="h-2 bg-simples-storm rounded-full cursor-pointer"
          onClick={handleProgressChange}
        >
          <div 
            className="h-full bg-gradient-to-r from-simples-sky to-simples-ocean rounded-full transition-all duration-150"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-2 rounded-full transition-colors ${
              isShuffle ? 'text-simples-sky' : 'text-simples-cloud hover:text-white'
            }`}
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`p-2 rounded-full transition-colors ${
              isRepeat ? 'text-simples-sky' : 'text-simples-cloud hover:text-white'
            }`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={prevTrack}
            className="text-simples-cloud hover:text-white transition-colors"
            disabled={tracks.length <= 1}
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 bg-white text-simples-midnight rounded-full flex items-center justify-center hover:bg-simples-cloud transition-colors shadow-lg"
            disabled={isLoading || !!error}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-simples-ocean border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>
          
          <button 
            onClick={nextTrack}
            className="text-simples-cloud hover:text-white transition-colors"
            disabled={tracks.length <= 1}
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleMute}
            className="text-simples-cloud hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume * 100}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-simples-storm rounded-full appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Queue */}
      {showQueue && tracks.length > 1 && (
        <div>
          <h5 className="text-sm font-semibold text-simples-cloud mb-3">Up Next</h5>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {tracks.slice(currentTrackIndex + 1, currentTrackIndex + 4).map((track, index) => (
              <div 
                key={track.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => onTrackChange?.(currentTrackIndex + 1 + index)}
              >
                <img 
                  src={track.cover_image_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop'} 
                  alt={track.title}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{track.title}</p>
                  <p className="text-xs text-simples-cloud truncate">{track.artist_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3B82F6, #1E40AF);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3B82F6, #1E40AF);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer; 