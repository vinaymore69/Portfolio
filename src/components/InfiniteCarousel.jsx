import React, { useEffect, useRef, useState } from 'react';

const InfiniteCarousel = () => {
  const carouselRef = useRef(null);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [lastScrollY, setLastScrollY] = useState(0);
  const animationRef = useRef(null);

  // Sample carousel items - you can customize these
  const carouselItems = [
    { text: "Web Development", icon: "💻" },
    { text: "React Expert", icon: "⚛️" },
    { text: "Node.js", icon: "🟢" },
    { text: "UI/UX Design", icon: "🎨" },
    { text: "JavaScript", icon: "🟨" },
    { text: "TypeScript", icon: "🔷" },
    { text: "Database Design", icon: "🗄️" },
    { text: "API Development", icon: "🔗" },
    { text: "Mobile Responsive", icon: "📱" },
    { text: "Performance Optimization", icon: "⚡" },
    { text: "SEO Friendly", icon: "🔍" },
    { text: "Modern Frameworks", icon: "🚀" }
  ];

  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...carouselItems, ...carouselItems, ...carouselItems];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      
      // Calculate speed based on scroll velocity
      const baseSpeed = 1;
      const maxSpeed = 8;
      const speedMultiplier = Math.min(scrollDelta * 0.1, maxSpeed);
      
      setScrollSpeed(baseSpeed + speedMultiplier);
      setLastScrollY(currentScrollY);
      
      // Gradually reduce speed when not scrolling
      setTimeout(() => {
        setScrollSpeed(prev => Math.max(prev * 0.95, 1));
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let translateX = 0;
    const itemWidth = 200; // Approximate width of each item
    const totalWidth = itemWidth * carouselItems.length;

    const animate = () => {
      translateX -= scrollSpeed;
      
      // Reset position for infinite loop
      if (Math.abs(translateX) >= totalWidth) {
        translateX = 0;
      }
      
      carousel.style.transform = `translateX(${translateX}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scrollSpeed, carouselItems.length]);

  return (
    <div className="w-full overflow-hidden bg-black text-white py-4 relative">
      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-black to-transparent z-10"></div>
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-black to-transparent z-10"></div>
      
      <div 
        ref={carouselRef}
        className="flex items-center space-x-8 whitespace-nowrap"
        style={{ width: 'max-content' }}
      >
        {duplicatedItems.map((item, index) => (
          <div 
            key={index}
            className="flex items-center space-x-3 px-6 py-3 bg-gray-900 rounded-full border border-gray-700 hover:border-gray-500 transition-colors duration-300"
            style={{ minWidth: '180px' }}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-poppins-bold text-sm">{item.text}</span>
          </div>
        ))}
      </div>
      
      {/* Speed indicator */}
      <div className="absolute bottom-2 right-4 text-xs text-gray-400 font-mono">
        Speed: {scrollSpeed.toFixed(1)}x
      </div>
    </div>
  );
};

export default InfiniteCarousel;