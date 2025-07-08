import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, X } from 'lucide-react';

const MatchNotification = ({ match, onClose, onSendMessage }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (match) {
      setIsVisible(true);
      // Auto-hide after 10 seconds if not manually closed
      const timer = setTimeout(() => {
        handleClose();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [match]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  const handleSendMessage = () => {
    onSendMessage(match);
    handleClose();
  };

  if (!match) return null;

  const otherUser = match.other_user;
  const profilePicture = otherUser?.profile_picture_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=400&h=400&fit=crop&crop=face';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      isVisible ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent pointer-events-none'
    }`}>
      <div className={`bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 bg-simples-cloud/80 hover:bg-simples-silver rounded-full flex items-center justify-center transition-colors z-10"
        >
          <X className="w-4 h-4 text-simples-storm" />
        </button>

        {/* Celebration Animation */}
        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-simples-ocean to-simples-sky p-8 text-center">
          {/* Animated Hearts */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 text-2xl animate-bounce" style={{ animationDelay: '0s' }}>💙</div>
            <div className="absolute top-8 right-6 text-xl animate-bounce" style={{ animationDelay: '0.5s' }}>💜</div>
            <div className="absolute bottom-6 left-8 text-lg animate-bounce" style={{ animationDelay: '1s' }}>💖</div>
            <div className="absolute bottom-4 right-4 text-2xl animate-bounce" style={{ animationDelay: '1.5s' }}>✨</div>
          </div>

          <div className="relative z-10">
            <div className="text-6xl mb-4 animate-pulse">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">It's a Match!</h2>
            <p className="text-white/90">
              You and {otherUser?.full_name} liked each other
            </p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-4">
              {/* Current User Avatar (placeholder) */}
              <div className="w-20 h-20 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              
              {/* Hearts in between */}
              <div className="flex flex-col items-center">
                <Heart className="w-6 h-6 text-simples-rose animate-pulse mb-1" />
                <Heart className="w-4 h-4 text-simples-lavender animate-pulse" />
              </div>
              
              {/* Matched User Avatar */}
              <img
                src={profilePicture}
                alt={otherUser?.full_name}
                className="w-20 h-20 rounded-full object-cover border-4 border-simples-sky"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=400&h=400&fit=crop&crop=face';
                }}
              />
            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-simples-midnight mb-2">
              Say hello to {otherUser?.full_name}!
            </h3>
            <p className="text-simples-storm">
              Start a conversation and get to know each other better.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 bg-simples-silver hover:bg-simples-cloud text-simples-ocean font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Keep Swiping
            </button>
            <button
              onClick={handleSendMessage}
              className="flex-1 bg-gradient-to-r from-simples-ocean to-simples-sky hover:from-simples-ocean/90 hover:to-simples-sky/90 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchNotification; 