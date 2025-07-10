import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  // Define page order and names
  const pages = [
    { path: '/', name: 'Home' },
    { path: '/about', name: 'About' },
    { path: '/project', name: 'Projects' },
    { path: '/skills', name: 'Skills' },
    { path: '/contact', name: 'Contact' }
  ];

  const currentIndex = pages.findIndex(page => page.path === location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-30 hidden md:flex flex-col items-center space-y-4">
      {/* Page Indicators */}
      <div className="flex flex-col space-y-3">
        {pages.map((page, index) => (
          <div
            key={page.path}
            className={`relative group cursor-pointer transition-all duration-300 ${
              index === currentIndex ? 'scale-125' : 'scale-100 opacity-60'
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-black border-black' 
                  : 'bg-transparent border-gray-400 hover:border-black'
              }`}
            />
            
            {/* Tooltip */}
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-black text-white px-3 py-1 rounded text-sm whitespace-nowrap">
                {page.name}
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-black"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Progress Bar */}
      <div className="w-px h-20 bg-gray-200 relative mt-6">
        <div 
          className="w-full bg-black transition-all duration-100 ease-out"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {/* Scroll Hint */}
      <div className="text-xs text-gray-500 writing-mode-vertical transform rotate-180 mt-4">
        SCROLL
      </div>
    </div>
  );
};

export default ScrollIndicator;