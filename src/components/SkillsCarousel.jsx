import React, { useEffect, useRef, useState } from 'react';

const SkillsCarousel = ({ direction = 'left', speed = 1 }) => {
  const carouselRef = useRef(null);
  const [scrollVelocity, setScrollVelocity] = useState(speed);
  const [lastScrollY, setLastScrollY] = useState(0);
  const animationRef = useRef(null);

  // Skills data organized by category
  const skillCategories = {
    frontend: [
      { name: "React", color: "bg-blue-500" },
      { name: "JavaScript", color: "bg-yellow-500" },
      { name: "HTML5", color: "bg-orange-500" },
      { name: "CSS3", color: "bg-blue-400" },
      { name: "Tailwind", color: "bg-teal-500" },
      { name: "GSAP", color: "bg-green-500" }
    ],
    backend: [
      { name: "Node.js", color: "bg-green-600" },
      { name: "Express", color: "bg-gray-600" },
      { name: "PHP", color: "bg-purple-600" },
      { name: "PostgreSQL", color: "bg-blue-600" },
      { name: "MySQL", color: "bg-orange-600" },
      { name: "SQLite", color: "bg-gray-500" }
    ],
    tools: [
      { name: "WordPress", color: "bg-blue-700" },
      { name: "Figma", color: "bg-pink-500" },
      { name: "Canva", color: "bg-cyan-500" },
      { name: "Git", color: "bg-red-500" },
      { name: "VS Code", color: "bg-blue-800" },
      { name: "Postman", color: "bg-orange-400" }
    ]
  };

  // Flatten all skills and duplicate for infinite scroll
  const allSkills = Object.values(skillCategories).flat();
  const duplicatedSkills = [...allSkills, ...allSkills, ...allSkills];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      
      // Calculate dynamic speed based on scroll velocity
      const baseSpeed = speed;
      const maxSpeed = speed * 6;
      const dynamicSpeed = Math.min(baseSpeed + (scrollDelta * 0.05), maxSpeed);
      
      setScrollVelocity(dynamicSpeed);
      setLastScrollY(currentScrollY);
      
      // Gradually reduce speed when not scrolling
      setTimeout(() => {
        setScrollVelocity(prev => Math.max(prev * 0.98, speed));
      }, 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, speed]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let translateX = 0;
    const itemWidth = 120; // Approximate width of each skill item
    const totalWidth = itemWidth * allSkills.length;

    const animate = () => {
      const moveDirection = direction === 'left' ? -1 : 1;
      translateX += moveDirection * scrollVelocity;
      
      // Reset position for infinite loop
      if (direction === 'left' && translateX <= -totalWidth) {
        translateX = 0;
      } else if (direction === 'right' && translateX >= totalWidth) {
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
  }, [scrollVelocity, direction, allSkills.length]);

  return (
    <div className="w-full overflow-hidden py-3 relative">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
      <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
      
      <div 
        ref={carouselRef}
        className="flex items-center space-x-4"
        style={{ width: 'max-content' }}
      >
        {duplicatedSkills.map((skill, index) => (
          <div 
            key={`${skill.name}-${index}`}
            className={`flex items-center justify-center px-4 py-2 rounded-full text-white text-sm font-poppins-bold shadow-lg hover:scale-105 transition-transform duration-200 ${skill.color}`}
            style={{ minWidth: '100px' }}
          >
            {skill.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsCarousel;