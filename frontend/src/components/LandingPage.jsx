import React, { useState } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import SignupModal from './auth/SignupModal';
import LoginModal from './auth/LoginModal';
import Footer from './Footer';

const LandingPage = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Navigation */}
      <nav className="pt-4 pb-2 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Simples Connect
            </span>
          </div>
          <button 
            onClick={() => setShowLogin(true)}
            className="bg-white/80 backdrop-blur-sm text-gray-800 border border-gray-200 hover:bg-white hover:shadow-lg font-semibold py-3 px-6 rounded-xl transition-all duration-300"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 px-4 md:px-6 pt-8 md:pt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 md:mb-8 leading-tight">
            Find Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Perfect Match
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
            Where authentic connections bloom. Join thousands of Ugandans finding love, 
            friendship, and meaningful relationships across the globe.
          </p>

          <button 
            onClick={() => setShowSignup(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-4 px-8 md:px-12 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg md:text-xl mb-12 md:mb-16 group"
          >
            Find My Match
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2 group-hover:translate-x-1 transition-transform inline" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => setShowSignup(true)}
      />

      {/* Signup Modal */}
      <SignupModal 
        isOpen={showSignup} 
        onClose={() => setShowSignup(false)} 
      />
    </div>
  );
};

export default LandingPage;