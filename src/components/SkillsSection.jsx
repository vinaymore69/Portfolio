import React, { useState } from 'react';

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState(0);

  const skillCategories = [
    {
      name: 'Frontend',
      icon: '⚡',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Tailwind CSS', 'GSAP']
    },
    {
      name: 'Backend',
      icon: '⚙️',
      skills: ['Node.js', 'Express.js', 'PHP', 'RESTful APIs']
    },
    {
      name: 'Mobile',
      icon: '📱',
      skills: ['Flutter', 'React Native', 'iOS Development']
    },
    {
      name: 'Database',
      icon: '🗃️',
      skills: ['PostgreSQL', 'MySQL', 'SQLite', 'Supabase']
    },
    {
      name: 'Languages',
      icon: '💻',
      skills: ['JavaScript', 'Java', 'Python', 'C/C++']
    },
    {
      name: 'Tools',
      icon: '🔧',
      skills: ['WordPress', 'Figma', 'Canva', 'Git', 'WooCommerce']
    }
  ];

  return (
    <section className="min-h-screen bg-white text-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 font-poppins">
            Technical Skills
          </h1>
          <p className="text-xl text-gray-600 font-poppins-bold">
            Technologies I work with
          </p>
        </div>

        {/* Skill Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className={`relative cursor-pointer group transition-all duration-500 ${
                activeCategory === index ? 'transform scale-110' : ''
              }`}
              onClick={() => setActiveCategory(index)}
              onMouseEnter={() => setActiveCategory(index)}
            >
              {/* Category Card */}
              <div className={`relative border-2 rounded-2xl p-8 text-center transition-all duration-500 ${
                activeCategory === index 
                  ? 'bg-black text-white border-black shadow-2xl' 
                  : 'bg-white text-black border-gray-300 hover:border-black hover:shadow-lg'
              }`}>
                
                {/* Icon */}
                <div className={`text-4xl mb-4 transition-all duration-300 ${
                  activeCategory === index ? 'transform scale-125' : ''
                }`}>
                  {category.icon}
                </div>
                
                {/* Category Name */}
                <h3 className="font-bold text-xl mb-2 font-poppins">
                  {category.name}
                </h3>
                
                {/* Skill Count */}
                <p className={`text-sm ${
                  activeCategory === index ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {category.skills.length} Technologies
                </p>

                {/* Active Indicator */}
                {activeCategory === index && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Connection Lines for Active Category */}
              {activeCategory === index && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 w-32 h-px bg-black transform -translate-x-1/2 -translate-y-1/2 rotate-45 opacity-30"></div>
                  <div className="absolute top-1/2 left-1/2 w-32 h-px bg-black transform -translate-x-1/2 -translate-y-1/2 -rotate-45 opacity-30"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Active Category Details */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 transition-all duration-500">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-black text-white rounded-2xl mb-4">
                <span className="text-3xl">{skillCategories[activeCategory].icon}</span>
              </div>
              <h3 className="text-3xl font-bold font-poppins mb-2">
                {skillCategories[activeCategory].name} Development
              </h3>
              <div className="w-24 h-1 bg-black mx-auto"></div>
            </div>
            
            {/* Skills Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {skillCategories[activeCategory].skills.map((skill, skillIndex) => (
                <div 
                  key={skill}
                  className="bg-white border-2 border-gray-300 rounded-xl py-4 px-4 text-center font-medium hover:bg-black hover:text-white hover:border-black transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  style={{
                    animationDelay: `${skillIndex * 100}ms`
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Overview */}
        <div className="text-center mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-black text-white rounded-2xl p-6">
              <div className="text-3xl font-bold mb-2">6</div>
              <div className="text-sm uppercase tracking-wide">Categories</div>
            </div>
            <div className="border-2 border-black rounded-2xl p-6">
              <div className="text-3xl font-bold mb-2">25+</div>
              <div className="text-sm uppercase tracking-wide">Technologies</div>
            </div>
            <div className="bg-gray-100 border-2 border-gray-300 rounded-2xl p-6">
              <div className="text-3xl font-bold mb-2">3+</div>
              <div className="text-sm uppercase tracking-wide">Years Experience</div>
            </div>
          </div>
        </div>

        {/* Character Image */}
        <div className="flex justify-center">
          <img
            src="./images/skillsModel.png"
            alt="3D illustration representing technical skills"
            className="w-48 md:w-64 h-auto object-contain opacity-60"
          />
        </div>
      </div>
    </section>
  );
}