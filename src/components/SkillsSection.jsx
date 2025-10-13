import React, { useState } from 'react';

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState(0);

  const skillCategories = [
    {
      name: 'Frontend',
      icon: '🎨',
      color: 'from-blue-500 to-purple-600',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Tailwind CSS', 'GSAP']
    },
    {
      name: 'Backend',
      icon: '⚙️',
      color: 'from-green-500 to-teal-600',
      skills: ['Node.js', 'Express.js', 'PHP', 'RESTful APIs']
    },
    {
      name: 'Mobile',
      icon: '📱',
      color: 'from-orange-500 to-red-600',
      skills: ['Flutter', 'React Native', 'iOS Development']
    },
    {
      name: 'Database',
      icon: '🗄️',
      color: 'from-indigo-500 to-blue-600',
      skills: ['PostgreSQL', 'MySQL', 'SQLite', 'Supabase']
    },
    {
      name: 'Languages',
      icon: '💻',
      color: 'from-purple-500 to-pink-600',
      skills: ['JavaScript', 'Java', 'Python', 'C/C++']
    },
    {
      name: 'Tools',
      icon: '🛠️',
      color: 'from-gray-500 to-gray-700',
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

        {/* Hexagonal Grid Layout */}
        <div className="flex justify-center items-center mb-20">
          <div className="relative w-full max-w-4xl">
            {/* Central Hub */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-32 h-32 bg-black rounded-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl font-bold">Skills</div>
                  <div className="text-sm">Portfolio</div>
                </div>
              </div>
            </div>

            {/* Skill Category Hexagons */}
            <div className="relative w-full h-96 md:h-[500px]">
              {skillCategories.map((category, index) => {
                const angle = (index * 60) * (Math.PI / 180);
                const radius = 180;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <div
                    key={index}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                    }}
                    onMouseEnter={() => setActiveCategory(index)}
                  >
                    {/* Hexagon Shape */}
                    <div className="relative">
                      <div className={`w-24 h-24 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                        <div className="text-center text-white">
                          <div className="text-2xl mb-1">{category.icon}</div>
                          <div className="text-xs font-bold">{category.name}</div>
                        </div>
                      </div>
                      
                      {/* Connection Line to Center */}
                      <div 
                        className="absolute w-px bg-gray-300 origin-center"
                        style={{
                          height: `${radius - 48}px`,
                          left: '50%',
                          top: '50%',
                          transform: `translate(-50%, -50%) rotate(${angle + Math.PI}rad)`,
                          transformOrigin: `0 ${(radius - 48) / 2}px`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Category Details */}
        <div className="text-center mb-16">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto border border-gray-200">
            <div className="flex items-center justify-center mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${skillCategories[activeCategory].color} rounded-2xl flex items-center justify-center mr-4`}>
                <span className="text-2xl">{skillCategories[activeCategory].icon}</span>
              </div>
              <h3 className="text-3xl font-bold font-poppins">
                {skillCategories[activeCategory].name} Development
              </h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {skillCategories[activeCategory].skills.map((skill, skillIndex) => (
                <div 
                  key={skill}
                  className="bg-white border border-gray-300 rounded-lg py-4 px-4 text-sm font-medium hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105"
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

        {/* Skills Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {skillCategories.map((category, index) => (
            <div 
              key={index}
              className={`border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
                activeCategory === index 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-300 hover:border-black'
              }`}
              onClick={() => setActiveCategory(index)}
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mr-3`}>
                  <span className="text-xl">{category.icon}</span>
                </div>
                <h3 className="font-bold text-lg">{category.name}</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {category.skills.slice(0, 3).map((skill) => (
                  <span 
                    key={skill}
                    className={`px-2 py-1 rounded text-xs ${
                      activeCategory === index 
                        ? 'bg-white text-black' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
                {category.skills.length > 3 && (
                  <span className={`px-2 py-1 rounded text-xs ${
                    activeCategory === index 
                      ? 'bg-white text-black' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    +{category.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ))}
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