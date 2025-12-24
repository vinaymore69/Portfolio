import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState(0);
  const titleRef = useRef(null);
  const categoriesRef = useRef([]);
  const skillCardsRef = useRef([]);
  const statsRef = useRef([]);

  useEffect(() => {
    // Title animation with stagger effect
    gsap.fromTo(titleRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Category buttons animation
    gsap.fromTo(categoriesRef.current,
      {
        opacity: 0,
        y: 30,
        scale: 0.8
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: categoriesRef.current[0],
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Stats cards animation
    gsap.fromTo(statsRef.current,
      {
        opacity: 0,
        y: 50,
        rotationX: -90
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: statsRef.current[0],
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  useEffect(() => {
    // Animate skill cards when category changes
    gsap.fromTo(skillCardsRef.current,
      {
        opacity: 0,
        y: 20,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      }
    );
  }, [activeCategory]);

  const skillCategories = [
    {
      name: 'Frontend',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Tailwind CSS', 'GSAP']
    },
    {
      name: 'Backend',
      skills: ['Node.js', 'Express.js', 'PHP', 'RESTful APIs']
    },
    {
      name: 'Mobile',
      skills: ['Flutter', 'React Native', 'iOS Development']
    },
    {
      name: 'Database',
      skills: ['PostgreSQL', 'MySQL', 'SQLite', 'Supabase']
    },
    {
      name: 'Languages',
      skills: ['JavaScript', 'Java', 'Python', 'C/C++']
    },
    {
      name: 'Tools',
      skills: ['WordPress', 'Figma', 'Canva', 'Git', 'WooCommerce']
    }
  ];

  return (
    <section className="min-h-screen bg-white text-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h1 ref={titleRef} className="text-6xl md:text-8xl font-bold mb-6 font-poppins">
            Technical Skills
          </h1>
          <div className="w-24 h-px bg-black mx-auto"></div>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {skillCategories.map((category, index) => (
            <button
              ref={el => categoriesRef.current[index] = el}
              key={index}
              onClick={() => setActiveCategory(index)}
              className={`px-8 py-3 border transition-all duration-300 font-medium ${
                activeCategory === index
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-gray-300 hover:border-black'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Active Category Display */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl font-bold mb-8 font-poppins">
              {skillCategories[activeCategory].name}
            </h2>
            
            {/* Skills Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl">
              {skillCategories[activeCategory].skills.map((skill, skillIndex) => (
                <div 
                  ref={el => skillCardsRef.current[skillIndex] = el}
                  key={skill}
                  className="border border-gray-300 py-6 px-4 text-center font-medium hover:bg-black hover:text-white hover:border-black transition-all duration-300 cursor-pointer"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-16">
          <div className="text-center border border-gray-300 py-8 px-6">
            <div ref={el => statsRef.current[0] = el} className="text-4xl font-bold mb-2">6</div>
            <div className="text-sm uppercase tracking-wide text-gray-600">Categories</div>
          </div>
          <div className="text-center bg-black text-white py-8 px-6">
            <div ref={el => statsRef.current[1] = el} className="text-4xl font-bold mb-2">25+</div>
            <div className="text-sm uppercase tracking-wide">Technologies</div>
          </div>
          <div className="text-center border border-gray-300 py-8 px-6">
            <div ref={el => statsRef.current[2] = el} className="text-4xl font-bold mb-2">3+</div>
            <div className="text-sm uppercase tracking-wide text-gray-600">Years</div>
          </div>
        </div>

        {/* All Skills List */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-12 font-poppins">
            Complete Skill Set
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category, index) => (
              <div 
                key={index}
                className={`border p-6 transition-all duration-300 cursor-pointer ${
                  activeCategory === index
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:border-black'
                }`}
                onClick={() => setActiveCategory(index)}
              >
                <h4 className="font-bold text-lg mb-4 font-geom">
                  {category.name}
                </h4>
                <div className="space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <div 
                      key={skill}
                      className={`text-sm py-1 ${
                        activeCategory === index ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
                <div className={`text-xs mt-4 ${
                  activeCategory === index ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {category.skills.length} Technologies
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Character Image */}
        <div className="flex justify-center mt-20">
          <img
            src="./images/skillsModel.png"
            alt="Skills illustration"
            className="w-48 md:w-64 h-auto object-contain opacity-30"
          />
        </div>
      </div>
    </section>
  );
}