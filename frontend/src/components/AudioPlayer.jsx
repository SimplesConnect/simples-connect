import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Heart,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const AudioPlayer = ({ 
  tracks = [], 
  currentTrackIndex = 0, 
  onTrackChange,
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
      const wasPlaying = isPlaying;
      
      audio.src = currentTrack.file_url;
      audio.volume = isMuted ? 0 : volume;
      setError(null);
      setCurrentTime(0);
      setDuration(0);
      
      // Auto-play if a track was already playing
      if (wasPlaying) {
        audio.load();
        audio.addEventListener('loadeddata', () => {
          audio.volume = isMuted ? 0 : volume;
          audio.play().then(() => {
            setIsPlaying(true);
            setPlayStartTime(Date.now());
            console.log('Auto-play successful for new track');
          }).catch(error => {
            console.error('Auto-play failed:', error);
            setIsPlaying(false);
          });
        }, { once: true });
      } else {
        audio.volume = isMuted ? 0 : volume;
      }
    }
  }, [currentTrackIndex]);

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
    console.log('Track ended, moving to next track');
    setIsPlaying(false);
    
    // Record completed play
    if (playStartTime && currentTrack) {
      const playDuration = Date.now() - playStartTime;
      await recordPlay(currentTrack.id, Math.floor(playDuration / 1000), true);
    }
    setPlayStartTime(null);

    // Auto-play next track after a short delay
    setTimeout(() => {
      nextTrack();
    }, 500);
  };

  const nextTrack = () => {
    if (tracks.length === 0) {
      console.log('No tracks available');
      return;
    }
    
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    console.log(`Moving to next track: ${currentTrackIndex} -> ${nextIndex}`);
    onTrackChange?.(nextIndex);
  };

  const prevTrack = () => {
    if (tracks.length === 0) {
      console.log('No tracks available');
      return;
    }
    
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    console.log(`Moving to previous track: ${currentTrackIndex} -> ${prevIndex}`);
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
    <div className={`bg-gradient-to-br from-simples-midnight to-simples-storm rounded-3xl p-6 shadow-2xl border border-simples-silver ${className}`}>
      <audio ref={audioRef} preload="metadata" />
      
      {/* Current Track Display */}
      <div className="flex items-center gap-4 mb-6">
        <img 
          src={currentTrack.cover_image_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=64&h=64&fit=crop'} 
          alt={currentTrack.title}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-lg truncate">{currentTrack.title}</h4>
          <p className="text-simples-silver text-sm truncate">{currentTrack.artist_name}</p>
        </div>
        <button 
          onClick={() => toggleLike(currentTrack.id)}
          className={`p-2 rounded-lg transition-colors ${
            likedTracks.has(currentTrack.id) 
              ? 'text-simples-rose hover:text-red-400' 
              : 'text-simples-silver hover:text-white'
          }`}
          disabled={!user}
        >
          <Heart className={`w-5 h-5 ${likedTracks.has(currentTrack.id) ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-simples-silver mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div 
          ref={progressRef}
          className="h-2 bg-simples-storm rounded-full cursor-pointer"
          onClick={handleProgressChange}
        >
          <div 
            className="h-full bg-gradient-to-r from-simples-ocean to-simples-tropical rounded-full transition-all duration-150"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button 
          onClick={prevTrack}
          className="text-simples-silver hover:text-white transition-colors p-2"
          disabled={tracks.length <= 1}
          title="Previous"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-14 h-14 bg-gradient-to-r from-simples-ocean to-simples-tropical rounded-full flex items-center justify-center text-white hover:from-simples-tropical hover:to-simples-ocean transition-all duration-300 shadow-lg"
          disabled={isLoading || !!error}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </button>
        
        <button 
          onClick={nextTrack}
          className="text-simples-silver hover:text-white transition-colors p-2"
          disabled={tracks.length <= 1}
          title="Next"
        >
          <SkipForward className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleMute}
            className="text-simples-silver hover:text-white transition-colors p-2"
            title={isMuted ? 'Unmute' : 'Mute'}
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
            className="w-20 h-2 bg-simples-storm rounded-full appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-4">
          <p className="text-red-400 text-sm">{error}</p>
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