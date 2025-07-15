import React, { useState } from 'react';
import { Play, Clock, ExternalLink } from 'lucide-react';

const VideoThumbnail = ({ 
  videoId, 
  title, 
  duration, 
  description,
  isActive = false,
  onClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const getThumbnailUrl = (videoId) => {
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(videoId);
    }
  };

  const openInYouTube = (e) => {
    e.stopPropagation();
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <div 
      className={`group cursor-pointer transition-all duration-500 ${
        isActive ? 'ring-2 ring-amber-400/50' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-1">
        {/* Thumbnail Container */}
        <div className="relative aspect-video overflow-hidden">
          {!imageError && videoId ? (
            <img 
              src={getThumbnailUrl(videoId)}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
              <Play className="w-8 h-8 text-white/50" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6 text-slate-900 ml-1" />
            </div>
          </div>

          {/* Duration Badge */}
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-medium">{duration}</span>
            </div>
          )}

          {/* External Link Button */}
          <button
            onClick={openInYouTube}
            className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/80"
          >
            <ExternalLink className="w-4 h-4 text-white" />
          </button>

          {/* Active Indicator */}
          {isActive && (
            <div className="absolute top-2 left-2 bg-amber-400 rounded-full px-3 py-1">
              <span className="text-black text-xs font-bold">NOW PLAYING</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-amber-400 transition-colors duration-300">
            {title}
          </h3>
          {description && (
            <p className="text-slate-400 text-xs line-clamp-2 mb-2">
              {description}
            </p>
          )}
          
          {/* Episode Metadata */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>DiaLuv Podcast</span>
            {duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{duration}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Gradient Bar */}
        <div className={`h-1 bg-gradient-to-r from-amber-400 to-rose-400 transform transition-all duration-300 ${
          isHovered ? 'scale-x-100' : 'scale-x-0'
        }`} />
      </div>
    </div>
  );
};

export default VideoThumbnail; 