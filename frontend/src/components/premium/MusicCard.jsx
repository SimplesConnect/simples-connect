import React, { useState } from 'react';
import { Play, Pause, Music, ExternalLink, Heart, Volume2 } from 'lucide-react';

const MusicCard = ({ 
  track, 
  isPlaying = false, 
  onPlay, 
  onPause,
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause?.(track.id);
    } else {
      onPlay?.(track.id);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const openInYouTube = (e) => {
    e.stopPropagation();
    window.open(track.youtube_url, '_blank');
  };

  const extractVideoId = (url) => {
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

  const getYouTubeThumbnail = (url) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64'
  };

  const defaultCover = track.album_cover_url || getYouTubeThumbnail(track.youtube_url);

  return (
    <div 
      className={`group cursor-pointer transition-all duration-500 ${sizeClasses[size]} flex-shrink-0`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlayPause}
    >
      <div className="bg-gradient-to-br from-simples-midnight to-simples-storm rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
        {/* Album Cover */}
        <div className="relative aspect-square overflow-hidden flex-shrink-0">
          {!imageError && defaultCover ? (
            <img 
              src={defaultCover}
              alt={`${track.song_title} by ${track.artist_name}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-simples-ocean to-simples-sky flex items-center justify-center">
              <Music className="w-12 h-12 text-white/80" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
              {isPlaying ? (
                <Pause className="w-6 h-6 text-simples-midnight" />
              ) : (
                <Play className="w-6 h-6 text-simples-midnight ml-1" />
              )}
            </div>
          </div>

          {/* Playing Indicator */}
          {isPlaying && (
            <div className="absolute top-3 left-3 bg-simples-ocean rounded-full px-3 py-1 flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-bold">PLAYING</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                isLiked 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-black/60 text-white/80 hover:bg-black/80'
              }`}
            >
              <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={openInYouTube}
              className="p-2 rounded-full bg-black/60 backdrop-blur-sm text-white/80 hover:bg-black/80 transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Genre Badge */}
          {track.genre && (
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm rounded-md px-2 py-1">
              <span className="text-white text-xs font-medium">{track.genre}</span>
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-simples-ocean transition-colors duration-300">
              {track.song_title}
            </h3>
            <p className="text-simples-silver text-xs line-clamp-1">
              {track.artist_name}
            </p>
          </div>
          
          {/* Bottom section */}
          <div className="mt-2 flex items-center justify-between text-xs text-simples-silver">
            <span>🎵 Community Pick</span>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>42</span>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Bar */}
        <div className={`h-1 bg-gradient-to-r from-simples-ocean to-simples-sky transform transition-all duration-300 ${
          isHovered ? 'scale-x-100' : 'scale-x-0'
        }`} />
      </div>
    </div>
  );
};

export default MusicCard; 