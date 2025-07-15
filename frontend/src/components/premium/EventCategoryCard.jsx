import React, { useState } from 'react';
import { ArrowRight, Users, Calendar, Briefcase, Heart } from 'lucide-react';

const EventCategoryCard = ({ 
  category, 
  onClick, 
  className = "" 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const categoryStyles = {
    meetups: {
      gradient: 'from-rose-500 to-pink-600',
      hoverGradient: 'hover:from-rose-600 hover:to-pink-700',
      icon: Users,
      shadowColor: 'shadow-rose-500/25',
      glowColor: 'from-rose-500/20 to-pink-500/20'
    },
    activities: {
      gradient: 'from-amber-500 to-orange-600',
      hoverGradient: 'hover:from-amber-600 hover:to-orange-700',
      icon: Calendar,
      shadowColor: 'shadow-amber-500/25',
      glowColor: 'from-amber-500/20 to-orange-500/20'
    },
    business: {
      gradient: 'from-blue-600 to-indigo-700',
      hoverGradient: 'hover:from-blue-700 hover:to-indigo-800',
      icon: Briefcase,
      shadowColor: 'shadow-blue-500/25',
      glowColor: 'from-blue-500/20 to-indigo-500/20'
    },
    community: {
      gradient: 'from-purple-600 to-violet-700',
      hoverGradient: 'hover:from-purple-700 hover:to-violet-800',
      icon: Heart,
      shadowColor: 'shadow-purple-500/25',
      glowColor: 'from-purple-500/20 to-violet-500/20'
    }
  };

  const style = categoryStyles[category.type] || categoryStyles.meetups;
  const IconComponent = style.icon;

  return (
    <div 
      className={`relative group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${style.glowColor} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
      
      {/* Main Card */}
      <div className={`
        bg-gradient-to-r ${style.gradient} ${style.hoverGradient}
        rounded-2xl p-6 shadow-2xl ${style.shadowColor}
        transform transition-all duration-500
        hover:-translate-y-2 hover:shadow-3xl
        border border-white/10
        overflow-hidden
        group
      `}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <ArrowRight className={`w-6 h-6 text-white/80 transform transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
            {category.name}
          </h3>

          {/* Description */}
          <p className="text-white/80 text-sm mb-4 leading-relaxed">
            {category.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-xs text-white/70">
                <span className="font-semibold text-white">{category.upcomingCount || 0}</span> upcoming
              </div>
              <div className="text-xs text-white/70">
                <span className="font-semibold text-white">{category.totalCount || 0}</span> total
              </div>
            </div>
            <div className="flex items-center gap-1 text-white/60">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
              <span className="text-xs">Live</span>
            </div>
          </div>
        </div>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
};

export default EventCategoryCard; 