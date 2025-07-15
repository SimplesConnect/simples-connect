import React, { useState } from 'react';

const PremiumButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  iconPosition = 'left'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = 'relative inline-flex items-center justify-center font-semibold transition-all duration-300 transform overflow-hidden group';
  
  const variants = {
    primary: 'bg-gradient-to-r from-simples-ocean to-simples-sky text-white shadow-2xl hover:shadow-simples-ocean/25 hover:from-simples-ocean hover:to-simples-sky',
    secondary: 'bg-gradient-to-r from-simples-midnight to-simples-storm text-white shadow-2xl hover:shadow-simples-storm/25 hover:from-simples-storm hover:to-simples-midnight',
    outline: 'border-2 border-simples-ocean text-simples-ocean bg-transparent hover:bg-simples-ocean hover:text-white shadow-xl hover:shadow-simples-ocean/25',
    ghost: 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 shadow-lg hover:shadow-xl',
    luxury: 'bg-gradient-to-r from-simples-lavender via-simples-rose to-simples-tropical text-white shadow-2xl hover:shadow-simples-lavender/25 hover:from-simples-lavender hover:to-simples-tropical'
  };

  const sizes = {
    small: 'px-4 py-2 text-sm rounded-lg',
    medium: 'px-6 py-3 text-base rounded-xl',
    large: 'px-8 py-4 text-lg rounded-2xl',
    xl: 'px-10 py-5 text-xl rounded-2xl'
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1 hover:scale-105'}
        ${isPressed ? 'scale-95' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Ripple Effect */}
      <div className="absolute inset-0 rounded-inherit">
        <div className="absolute inset-0 rounded-inherit bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        )}
        
        {/* Loading Spinner */}
        {loading && (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        
        {/* Button Text */}
        <span className="transition-all duration-300 group-hover:tracking-wide">
          {children}
        </span>
        
        {/* Right Icon */}
        {Icon && iconPosition === 'right' && (
          <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-1" />
        )}
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-simples-ocean/20 to-simples-sky/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    </button>
  );
};

export default PremiumButton; 