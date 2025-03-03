import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Send, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50">
      {/* Newsletter Section - Simplified and Modern */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Join Our Newsletter</h3>
              <p className="text-white text-opacity-90">Get weekly insights and updates.</p>
            </div>
            <div className="w-full md:w-96">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-6 py-4 pr-12 bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-75 border-2 border-white border-opacity-20 rounded-xl focus:outline-none focus:border-opacity-50 transition-all"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white hover:scale-110 transition-transform">
                  <ArrowRight className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content - Simplified */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-900">BlogPlatform</h4>
            <p className="text-gray-600 leading-relaxed">
              Empowering voices, sharing stories, and connecting minds through thoughtful content.
            </p>
            <div className="flex space-x-5">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-indigo-500 transform hover:-translate-y-1 transition-all"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - Simplified */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-900">Quick Links</h4>
            <div className="grid grid-cols-1 gap-2">
              {['About', 'Write', 'Contact', 'Terms', 'Privacy'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-gray-600 hover:text-indigo-500 transition-colors inline-flex items-center group"
                >
                  <span>{link}</span>
                  <ArrowRight className="h-4 w-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories - Modern Tags */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-900">Explore</h4>
            <div className="flex flex-wrap gap-2">
              {['Tech', 'Design', 'Writing', 'Business', 'Health'].map((category) => (
                <a
                  key={category}
                  href="#"
                  className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:text-indigo-500 transition-all"
                >
                  {category}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Clean and Minimal */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 BlogPlatform. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-gray-500 hover:text-indigo-500 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;