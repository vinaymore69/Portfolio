import React, { useState } from 'react';
import InfiniteCarousel from './InfiniteCarousel';
import SkillsCarousel from './SkillsCarousel';

export default function HomeSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNextClick = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsOpen(true);
    
    // Reset animating state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 600); // Match the animation duration
  };

  const handleCloseClick = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsOpen(false);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  return (
    <main className="max-w-7xl mx-auto mt-10 px-4 sm:px-8 relative text-center">
      <h1 className="font-poppins font-bold text-4xl sm:text-[8vw] leading-tight sm:leading-[7vw] text-black m-0">
        EXPLORE<br />
        MY PORTFOLIO
      </h1>
      
      <div className="relative">
        <img
          src="/images/profile.png"
          alt="Young man smiling wearing white shirt"
          className="mt-4 sm:mt-[-4vw] w-50 sm:w-[26vw] myImage h-auto rounded-none inline-block"
        />
        
        <button
          aria-label="Next"
          className="absolute top-1/2 right-1/4 sm:left-[20.95vw] sm:rotate-[20deg] transform -translate-y-1/2 sm:-translate-y-[220%] w-10 h-10 sm:w-[3vw] sm:h-[3vw] border border-black rounded-full 
                   bg-transparent text-black cursor-pointer flex items-center justify-center 
                   transition-colors hover:bg-black hover:text-white"
          onClick={handleNextClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-base sm:text-[1.2vw]">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      
      <div className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-500 ease-in-out flex items-center justify-center
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleCloseClick}
      >
        {/* Prevent clicks inside the window from closing */}
        <div 
          className={`bg-white rounded-lg shadow-2xl overflow-hidden relative transition-all duration-500 ease-in-out
                     ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
          style={{ width: '700px', maxWidth: '95vw', maxHeight: '90vh' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Window Header */}
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center">
            <div className="flex space-x-2">
              <button 
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                onClick={handleCloseClick}
              ></button>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-center flex-1 text-gray-600 text-xs sm:text-sm font-medium truncate">Vinay More - Resume</div>
          </div>
          
          {/* Window Content */}
          <div className="p-4 sm:p-6 overflow-auto" style={{ maxHeight: 'calc(90vh - 40px)' }}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800"> Resume</h2>
            
            <div className="space-y-6 sm:space-y-8">
              {/* Personal Info */}
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Vinay More</h3>
                <p className="text-gray-600 text-sm sm:text-base">Computer Engineering Student & Web Developer</p>
                <div className="flex flex-wrap justify-center gap-1 sm:gap-0 sm:space-x-4 mt-2 text-xs sm:text-sm text-gray-600">
                  <span>Mumbai, India</span>
                  <span className="hidden sm:inline">•</span>
                  <span>34 followers</span>
                  <span className="hidden sm:inline">•</span>
                  <span>31 connections</span>
                </div>
              </div>
              
              {/* Experience Section */}
              <div>
                <h3 className="text-base sm:text-lg font-bold border-b border-gray-300 pb-2 mb-3 sm:mb-4 text-left">Experience</h3>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col">
                    <div className="font-medium text-left">
                      <div className="text-gray-800">Red Box Agency</div>
                      <div className="text-gray-600 text-xs sm:text-sm">Internship · 1 yr 1 mo</div>
                      <div className="text-gray-600 text-xs sm:text-sm">Remote</div>
                    </div>
                    <div className="text-left mt-2">
                      <ul className="list-disc ml-5 text-gray-700 text-sm">
                        <li className="mb-3 sm:mb-4">
                          <div className="font-medium text-gray-800">Website Development and Social media marketing</div>
                          <div className="text-gray-600 text-xs sm:text-sm">Jul 2024 - Present · 10 mos</div>
                          <div className="text-gray-600 text-xs sm:text-sm">Mumbai, Maharashtra, India</div>
                        </li>
                        <li className="mb-3 sm:mb-4">
                          <div className="font-medium text-gray-800">Web Development & Social media marketing strategy Development</div>
                          <div className="text-gray-600 text-xs sm:text-sm">Jun 2024 - Jul 2024 · 2 mos</div>
                          <div className="text-gray-600 text-xs sm:text-sm">Mumbai, Maharashtra, India</div>
                        </li>
                        <li>
                          <div className="font-medium text-gray-800">Website Development</div>
                          <div className="text-gray-600 text-xs sm:text-sm">Apr 2024 - Jun 2024 · 3 mos</div>
                          <div className="text-gray-600 text-xs sm:text-sm">Andheri Mumbai India</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="font-medium text-left">
                      <div className="text-gray-800">Student</div>
                      <div className="text-gray-600 text-xs sm:text-sm">Sep 2022 - Present · 2 yrs 8 mos</div>
                    </div>
                    <div className="text-left mt-1">
                      <div className="font-medium text-gray-800">Vidyalankar Group of Educational Institutes</div>
                      <div className="text-xs sm:text-sm text-gray-700 mt-1">
                        Mumbai, Maharashtra, India
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Education Section */}
              <div>
                <h3 className="text-base sm:text-lg font-bold border-b border-gray-300 pb-2 mb-3 sm:mb-4 text-left">Education</h3>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col">
                    <div className="font-medium text-left">
                      <div className="text-gray-800">Vidyalankar Group of Educational Institutes</div>
                      <div className="text-gray-600 text-xs sm:text-sm">Sep 2022 - Jun 2025</div>
                    </div>
                    <div className="text-left mt-1">
                      <div className="font-medium text-gray-800">High School Diploma, Computer Engineering</div>
                      <div className="text-xs sm:text-sm text-gray-700 mt-1">
                        Activities and societies: Coder
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="font-medium text-left">
                      <div className="text-gray-800 text-sm sm:text-base">Sadhana Education Society's Malti Jayant Dalal High School</div>
                      <div className="text-gray-600 text-xs sm:text-sm">Jun 2012 - Jun 2022</div>
                    </div>
                    <div className="text-left mt-1">
                      <div className="font-medium text-gray-800">High School/Secondary Certificate Programs</div>
                      <div className="text-xs sm:text-sm text-gray-700 mt-1">
                        Grade: 87.20%<br />
                        Activities and societies: Cricket, Painting
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Skills Section */}
              <div>
                <h3 className="text-base sm:text-lg font-bold border-b border-gray-300 pb-2 mb-3 sm:mb-4 text-left">Skills</h3>
                
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">Website Development</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">Social Media Marketing</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">Web Development</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">Marketing Strategy</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">Computer Engineering</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">Coding</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">Cricket</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">Painting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Infinite Carousel */}
      <div className="mt-12 md:mt-20">
        <InfiniteCarousel />
        
        {/* Skills Carousels */}
        <div className="mt-8 space-y-4">
          <SkillsCarousel direction="left" speed={1.5} />
          <SkillsCarousel direction="right" speed={1.2} />
        </div>
      </div>
    </main>
  );
}