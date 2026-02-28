import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';

const Footer = ({ darkMode }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`py-12 ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'} border-t`}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Copyright */}
          <div className={`text-center md:text-left mb-4 md:mb-0 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <p className="flex items-center justify-center md:justify-start space-x-2">
              <span>© 2026 Med Khalil Mejri. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span>and lots of ☕</span>
            </p>
          </div>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className={`group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
              darkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-purple-600 hover:text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-purple-600 hover:text-white'
            }`}
          >
            <span>Back to Top</span>
            <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Additional Footer Info */}
        <div className={`mt-8 pt-8 border-t text-center ${
          darkMode ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-500'
        }`}>
          <p className="text-sm">
            Designed and built with modern web technologies • Open source on{' '}
            <a 
              href="#" 
              className="text-purple-600 hover:text-purple-700 underline transition-colors duration-300"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
