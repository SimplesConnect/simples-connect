import React from 'react';
import { Heart, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-simples-midnight to-simples-storm text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Simples Connect
              </span>
            </div>
            <p className="text-simples-cloud text-sm leading-relaxed mb-4">
              Where authentic connections bloom. Connecting Ugandan hearts across the globe through meaningful relationships and genuine connections.
            </p>
            <p className="text-simples-silver text-xs">
              © {currentYear} Simples Connect. All rights reserved.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/policies" 
                  className="text-simples-cloud hover:text-simples-sky transition-colors text-sm"
                >
                  Policies
                </a>
              </li>
              <li>
                <a 
                  href="/safety-tips" 
                  className="text-simples-cloud hover:text-simples-sky transition-colors text-sm"
                >
                  Safety Tips
                </a>
              </li>
              <li>
                <a 
                  href="/disclaimers" 
                  className="text-simples-cloud hover:text-simples-sky transition-colors text-sm"
                >
                  Disclaimers
                </a>
              </li>
              <li>
                <a 
                  href="/community-guidelines" 
                  className="text-simples-cloud hover:text-simples-sky transition-colors text-sm"
                >
                  Community Guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/about" 
                  className="text-simples-cloud hover:text-simples-sky transition-colors text-sm"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="/lounge" 
                  className="text-simples-cloud hover:text-simples-sky transition-colors text-sm"
                >
                  Lounge
                </a>
              </li>
              <li>
                <a 
                  href="/events" 
                  className="text-simples-cloud hover:text-simples-sky transition-colors text-sm"
                >
                  Events
                </a>
              </li>
              <li>
                <a 
                  href="/faqs" 
                  className="text-simples-cloud hover:text-simples-sky transition-colors text-sm"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-simples-sky flex-shrink-0" />
                <a 
                  href="mailto:info@simplesconnect.com" 
                  className="text-simples-cloud hover:text-simples-sky transition-colors text-sm"
                >
                  info@simplesconnect.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-simples-sky flex-shrink-0 mt-0.5" />
                <div className="text-simples-cloud text-sm">
                  <p>Boston, MA. USA</p>
                  <p>Connecting hearts worldwide</p>
                </div>
              </div>
              
              {/* Social Media */}
              <div className="pt-2">
                <p className="text-simples-cloud text-sm mb-3">Follow us on:</p>
                <div className="flex gap-3">
                  <a 
                    href="https://facebook.com/simplesconnect" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-simples-cloud/20 hover:bg-simples-sky/30 rounded-lg flex items-center justify-center transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4 text-simples-cloud hover:text-white" />
                  </a>
                  <a 
                    href="https://instagram.com/simplesconnect" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-simples-cloud/20 hover:bg-simples-sky/30 rounded-lg flex items-center justify-center transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4 text-simples-cloud hover:text-white" />
                  </a>
                  <a 
                    href="https://youtube.com/@simplesconnect" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-simples-cloud/20 hover:bg-simples-sky/30 rounded-lg flex items-center justify-center transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4 text-simples-cloud hover:text-white" />
                  </a>
                  <a 
                    href="https://tiktok.com/@simplesconnect" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-simples-cloud/20 hover:bg-simples-sky/30 rounded-lg flex items-center justify-center transition-colors"
                    aria-label="TikTok"
                  >
                    <div className="w-4 h-4 text-simples-cloud hover:text-white text-xs font-bold">
                      TT
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-simples-cloud/30 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-simples-cloud text-sm text-center md:text-left">
              Made with 💙 for the Ugandan community worldwide
            </p>
            <div className="flex gap-4 text-xs text-simples-silver">
              <a href="/sitemap" className="hover:text-simples-cloud transition-colors">
                Sitemap
              </a>
              <span>•</span>
              <a href="/support" className="hover:text-simples-cloud transition-colors">
                Support
              </a>
              <span>•</span>
              <a href="/feedback" className="hover:text-simples-cloud transition-colors">
                Feedback
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
