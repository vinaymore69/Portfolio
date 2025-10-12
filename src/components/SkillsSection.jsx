import React, { useState } from 'react';

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState(null);

  const skillCategories = {
    frontend: {
      title: 'Frontend Development',
      position: 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-4',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Tailwind CSS', 'GSAP']
    },
    backend: {
      title: 'Backend Development', 
      position: 'top-1/4 right-0 transform translate-x-4 -translate-y-1/2',
      skills: ['Node.js', 'Express.js', 'PHP', 'RESTful APIs']
    },
    mobile: {
      title: 'Mobile Development',
      position: 'bottom-1/4 right-0 transform translate-x-4 translate-y-1/2',
      skills: ['Flutter', 'React Native', 'iOS Development']
    },
    database: {
      title: 'Database & Storage',
      position: 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4',
      skills: ['PostgreSQL', 'MySQL', 'SQLite', 'Supabase']
    },
    programming: {
      title: 'Programming Languages',
      position: 'bottom-1/4 left-0 transform -translate-x-4 translate-y-1/2',
      skills: ['JavaScript', 'Java', 'Python', 'C/C++']
    },
    tools: {
      title: 'Tools & Platforms',
      position: 'top-1/4 left-0 transform -translate-x-4 -translate-y-1/2',
      skills: ['WordPress', 'Figma', 'Canva', 'Git', 'WooCommerce']
    }
  };

  return (
    <section className="min-h-screen bg-white text-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 font-poppins">
            Technical Skills
          </h1>
          <p className="text-xl text-gray-600 font-poppins-bold">
            My expertise across different technologies
          </p>
        </div>

        {/* Main Geometric Layout */}
        <div className="relative flex justify-center items-center min-h-[600px]">
          
          {/* Central Geometric Shape */}
          <div className="relative w-80 h-80 md:w-96 md:h-96">
            {/* Outer Polygon */}
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer hexagon */}
              <polygon
                points="200,20 350,110 350,290 200,380 50,290 50,110"
                fill="none"
                stroke="black"
                strokeWidth="1"
                className="opacity-30"
              />
              
              {/* Inner polygons */}
              <polygon
                points="200,60 310,130 310,270 200,340 90,270 90,130"
                fill="none"
                stroke="black"
                strokeWidth="1"
                className="opacity-50"
              />
              
              <polygon
                points="200,100 270,150 270,250 200,300 130,250 130,150"
                fill="none"
                stroke="black"
                strokeWidth="1"
                className="opacity-70"
              />

              {/* Central filled shape */}
              <polygon
                points="200,140 240,170 240,230 200,260 160,230 160,170"
                fill="black"
                className="opacity-20"
              />

              {/* Connection lines to skill categories */}
              <line x1="200" y1="20" x2="200" y2="0" stroke="black" strokeWidth="1" className="opacity-40" />
              <line x1="350" y1="110" x2="370" y2="90" stroke="black" strokeWidth="1" className="opacity-40" />
              <line x1="350" y1="290" x2="370" y2="310" stroke="black" strokeWidth="1" className="opacity-40" />
              <line x1="200" y1="380" x2="200" y2="400" stroke="black" strokeWidth="1" className="opacity-40" />
              <line x1="50" y1="290" x2="30" y2="310" stroke="black" strokeWidth="1" className="opacity-40" />
              <line x1="50" y1="110" x2="30" y2="90" stroke="black" strokeWidth="1" className="opacity-40" />
            </svg>
          </div>

          {/* Skill Category Labels */}
          {Object.entries(skillCategories).map(([key, category]) => (
            <div
              key={key}
              className={`absolute ${category.position} cursor-pointer group`}
              onMouseEnter={() => setActiveCategory(key)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              {/* Category Title */}
              <div className="text-center mb-2">
                <h3 className="text-lg md:text-xl font-bold font-poppins mb-1 group-hover:text-gray-600 transition-colors">
                  {category.title}
                </h3>
                
                {/* Skills List */}
                <div className="text-sm text-gray-700 space-y-1">
                  {category.skills.map((skill, index) => (
                    <div 
                      key={skill}
                      className="group-hover:text-black transition-colors"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Connection Dot */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div className="w-2 h-2 bg-black rounded-full group-hover:scale-150 transition-transform"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Category Details */}
        {activeCategory && (
          <div className="mt-16 text-center">
            <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 font-poppins">
                {skillCategories[activeCategory].title}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {skillCategories[activeCategory].skills.map((skill) => (
                  <div 
                    key={skill}
                    className="bg-white border border-gray-300 rounded-lg py-3 px-4 text-sm font-medium hover:bg-black hover:text-white transition-colors"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Character Image */}
        <div className="flex justify-center mt-20">
          <img
            src="./images/skillsModel.png"
            alt="3D illustration representing technical skills"
            className="w-48 md:w-64 h-auto object-contain opacity-60"
          />
        </div>

        {/* Skills Summary */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="border border-gray-300 rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">25+</div>
              <div className="text-gray-600 font-medium">Technologies</div>
            </div>
            <div className="border border-gray-300 rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">6</div>
              <div className="text-gray-600 font-medium">Categories</div>
            </div>
            <div className="border border-gray-300 rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">3+</div>
              <div className="text-gray-600 font-medium">Years Learning</div>
            </div>
            <div className="border border-gray-300 rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">10+</div>
              <div className="text-gray-600 font-medium">Projects Built</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}