import React, { useState } from 'react';
import { Play, ExternalLink, AlertCircle } from 'lucide-react';

const YouTubePlayer = ({ 
  videoId, 
  title = "Video", 
  autoplay = false, 
  showControls = true, 
  className = "", 
  placeholder = null,
  onError = null 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Extract video ID from various YouTube URL formats
  const extractVideoId = (url) => {
    if (!url) return null;
    
    // If already a video ID (11 characters), return as is
    if (url.length === 11 && !url.includes('/') && !url.includes('?')) {
      return url;
    }
    
    // Various YouTube URL patterns
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  const actualVideoId = extractVideoId(videoId);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError();
  };

  const openInYouTube = () => {
    if (actualVideoId) {
      window.open(`https://www.youtube.com/watch?v=${actualVideoId}`, '_blank');
    }
  };

  // If no video ID provided, show placeholder
  if (!actualVideoId) {
    return (
      <div className={`bg-gradient-to-br from-simples-cloud to-simples-silver rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          {placeholder || (
            <>
              <Play className="w-16 h-16 text-simples-storm mx-auto mb-4 opacity-50" />
              <p className="text-simples-storm text-lg font-medium mb-2">{title}</p>
              <p className="text-simples-storm/70 text-sm">Coming soon!</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className={`bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 ${className}`}>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 font-medium mb-2">Failed to load video</p>
            <p className="text-red-600 text-sm mb-4">There was an error loading this video</p>
            <button
              onClick={openInYouTube}
              className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open in YouTube
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Build iframe src with parameters
  const iframeSrc = `https://www.youtube.com/embed/${actualVideoId}?${new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    controls: showControls ? '1' : '0',
    modestbranding: '1',
    rel: '0',
    showinfo: '0',
    iv_load_policy: '3',
    color: 'white',
    theme: 'light'
  }).toString()}`;

  return (
    <div className={`relative bg-black rounded-xl overflow-hidden group ${className}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-simples-cloud to-simples-silver flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-simples-ocean/30 border-t-simples-ocean rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-simples-storm">Loading video...</p>
          </div>
        </div>
      )}

      {/* YouTube iframe */}
      <div className="aspect-video">
        <iframe
          src={iframeSrc}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>

      {/* Open in YouTube button - appears on hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={openInYouTube}
          className="bg-black/70 text-white p-2 rounded-lg hover:bg-black/90 transition-colors"
          title="Open in YouTube"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Video title overlay */}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-sm font-medium truncate">{title}</p>
        </div>
      )}
    </div>
  );
};

export default YouTubePlayer; 