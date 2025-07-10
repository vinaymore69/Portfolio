import React, { useState, useEffect } from 'react';
import Preloader from './Preloader';
import ScrollNavigator from './ScrollNavigator';

const PageWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  // Reset loading state when children change (new page)
  useEffect(() => {
    setIsLoading(true);
    setShowContent(false);
    
    // Simulate minimum loading time
    const timer = setTimeout(() => {
      handlePreloaderComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [children]);

  return (
    <>
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      
      <div className={`transition-opacity duration-500 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}>
        {children}
        <ScrollNavigator />
      </div>
    </>
  );
};

export default PageWrapper;