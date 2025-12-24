import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ScrollNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollThreshold = 100; // pixels to scroll before switching
  const isNavigatingRef = useRef(false);
  const lastScrollY = useRef(0);

  // Define page order for navigation
  const pages = ['/', '/about', '/project', '/skills', '/contact', '/privacy-policy', '/terms-conditions'];
  const currentIndex = pages.indexOf(location.pathname);

  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      if (isNavigatingRef.current) return;

      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      // Scroll up beyond threshold - go to previous page
      if (currentScrollY <= -scrollThreshold && scrollDelta < 0) {
        if (currentIndex > 0) {
          isNavigatingRef.current = true;
          navigate(pages[currentIndex - 1]);
          
          // Reset navigation lock after transition
          timeoutId = setTimeout(() => {
            isNavigatingRef.current = false;
          }, 1000);
        }
      }
      
      // Scroll down beyond bottom - go to next page
      else if (
        currentScrollY + windowHeight >= documentHeight - 10 && 
        scrollDelta > scrollThreshold
      ) {
        if (currentIndex < pages.length - 1) {
          isNavigatingRef.current = true;
          navigate(pages[currentIndex + 1]);
          
          // Reset navigation lock after transition
          timeoutId = setTimeout(() => {
            isNavigatingRef.current = false;
          }, 1000);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Reset navigation lock when location changes
    const resetNavigationLock = () => {
      setTimeout(() => {
        isNavigatingRef.current = false;
        lastScrollY.current = window.scrollY;
      }, 500);
    };

    resetNavigationLock();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate, currentIndex, pages]);

  return null; // This component doesn't render anything
};

export default ScrollNavigator;