import React, { useState, useEffect } from 'react';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const interval = 50; // Update every 50ms
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          setTimeout(() => {
            onComplete();
          }, 500); // Small delay before calling onComplete
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-white z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
      isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      {/* Logo */}
      <div className="mb-8">
        <img
          src="/images/portfolioLogo.png"
          alt="Portfolio Logo"
          className="w-16 h-16 animate-pulse"
        />
      </div>

      {/* Loading Text */}
      <div className="mb-6">
        <h2 className="text-2xl font-poppins font-bold text-black">
          Loading Portfolio
        </h2>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-black transition-all duration-100 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Percentage */}
      <div className="mt-4 text-sm font-poppins-bold text-gray-600">
        {Math.round(progress)}%
      </div>

      {/* Animated Dots */}
      <div className="flex space-x-1 mt-6">
        <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default Preloader;