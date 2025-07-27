// src/pages/AboutUs.jsx
import React from 'react';
import { Heart, Users, Globe, Shield, Star, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Shield,
      title: "Respect First",
      description: "Every interaction is built on mutual respect and understanding"
    },
    {
      icon: Heart,
      title: "Cultural Pride",
      description: "Celebrating Ugandan heritage and traditions in the diaspora"
    },
    {
      icon: Star,
      title: "Authenticity Always",
      description: "Real connections require real people being their true selves"
    },
    {
      icon: Users,
      title: "Connection with Intention",
      description: "Building meaningful relationships that honor commitment and purpose"
    },
    {
      icon: Globe,
      title: "Privacy + Protection",
      description: "Your safety and privacy are sacred to us"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-simples-cloud to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            "Connection is simple, when you find someone who sees the world the way you do."
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90">
            Simples Connect is where Ugandans in the diaspora find meaningful relationships that honor culture, values, and real connection.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-simples-midnight text-center mb-12">
            Our Story
          </h2>
          <div className="text-lg text-simples-storm leading-relaxed space-y-6">
            <p>
              We started Simples Connect because we saw a gap.
            </p>
            <p>
              Ugandans abroad were struggling to find partners who understood their roots, respected their values, and shared their long-term dreams.
            </p>
            <p>
              Most platforms felt like games—not serious spaces for building meaningful connections.
            </p>
            <p className="text-xl font-semibold text-simples-midnight">
              So we built one with heart, culture, and purpose at the center.
            </p>
          </div>
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="py-16 bg-simples-cloud">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-simples-midnight text-center mb-16">
            What Makes Us Different
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="text-4xl mb-4">🇺🇬</div>
              <h3 className="text-xl font-bold text-simples-midnight mb-4">
                For Ugandans, by Ugandans
              </h3>
              <p className="text-simples-storm">
                We understand clan talks, family traditions, and community values. This isn't just networking—it's legacy.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="text-4xl mb-4">💘</div>
              <h3 className="text-xl font-bold text-simples-midnight mb-4">
                Built for Serious Connections
              </h3>
              <p className="text-simples-storm">
                From community features to premium networking, everything here is designed to support meaningful relationships, not confusion.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-simples-midnight mb-4">
                Diaspora Ready
              </h3>
              <p className="text-simples-storm">
                Whether you're in Boston, London, Dubai, or Toronto—we help you connect across borders and time zones.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-simples-midnight mb-4">
                Culture + Community
              </h3>
              <p className="text-simples-storm">
                Our community spaces and story-sharing features build real connections, not just matches.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Founder */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-simples-midnight mb-12">
            Meet the Founder
          </h2>
          <div className="bg-gradient-to-r from-simples-rose to-simples-lavender p-8 rounded-2xl text-white">
            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
              <User className="w-12 h-12 text-simples-ocean" />
            </div>
            <blockquote className="text-lg md:text-xl leading-relaxed italic mb-6">
              "As a Ugandan in the diaspora myself, I knew the challenge of finding people who understood my background and family values. Simples Connect is my love letter to those of us who want real connections, real culture, and meaningful relationships."
            </blockquote>
            <cite className="font-semibold">— Founder, Simples Connect</cite>
          </div>
        </div>
      </div>

      {/* Our Vision */}
      <div className="py-16 bg-gradient-to-r from-simples-tropical to-simples-ocean text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Our Vision
          </h2>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            To become the most trusted platform for Ugandans worldwide to find meaningful connections, build community, and celebrate culture—one relationship at a time.
          </p>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-simples-midnight text-center mb-16">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-simples-midnight mb-3">
                  {value.title}
                </h3>
                <p className="text-simples-storm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join the Movement */}
      <div className="py-20 bg-gradient-to-r from-simples-midnight to-simples-storm text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Join the Movement
          </h2>
          <p className="text-xl md:text-2xl mb-4">
            You're not too late. You're not too much.
          </p>
          <p className="text-lg mb-12 opacity-90">
            Your people are looking for you too—and we're here to help you find each other.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <button 
              onClick={() => navigate('/')}
              className="bg-simples-sky hover:bg-simples-ocean text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Sign Up Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => navigate('/resources')}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-simples-midnight px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              Explore Resources
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 