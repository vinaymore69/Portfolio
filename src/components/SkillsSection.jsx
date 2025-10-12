import React, { useState } from 'react';

export default function SkillsSection() {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Skill categories with proficiency values (0-100)
  const skillCategories = [
    {
      name: 'Frontend Development',
      value: 90,
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Tailwind CSS', 'GSAP'],
      angle: 0
    },
    {
      name: 'Backend Development',
      value: 75,
      skills: ['Node.js', 'Express.js', 'PHP', 'RESTful APIs'],
      angle: 60
    },
    {
      name: 'Mobile Development',
      value: 70,
      skills: ['Flutter', 'React Native', 'iOS Development'],
      angle: 120
    },
    {
      name: 'Database & Storage',
      value: 80,
      skills: ['PostgreSQL', 'MySQL', 'SQLite', 'Supabase'],
      angle: 180
    },
    {
      name: 'Programming Languages',
      value: 85,
      skills: ['JavaScript', 'Java', 'Python', 'C/C++'],
      angle: 240
    },
    {
      name: 'Tools & Platforms',
      value: 65,
      skills: ['WordPress', 'Figma', 'Canva', 'Git', 'WooCommerce'],
      angle: 300
    }
  ];

  // Function to convert polar coordinates to cartesian
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // Create radar chart points
  const createRadarPoints = () => {
    const centerX = 200;
    const centerY = 200;
    const maxRadius = 150;
    
    return skillCategories.map(category => {
      const radius = (category.value / 100) * maxRadius;
      return polarToCartesian(centerX, centerY, radius, category.angle);
    });
  };

  const radarPoints = createRadarPoints();
  const pathData = radarPoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') + ' Z';

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

        {/* Radar Chart Container */}
        <div className="flex justify-center items-center mb-20">
          <div className="relative">
            <svg width="600" height="600" viewBox="0 0 400 400" className="max-w-full h-auto">
              {/* Background grid circles */}
              {[30, 60, 90, 120, 150].map((radius, index) => (
                <circle
                  key={radius}
                  cx="200"
                  cy="200"
                  r={radius}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  opacity={0.5}
                />
              ))}

              {/* Grid lines from center to each category */}
              {skillCategories.map((category, index) => {
                const endPoint = polarToCartesian(200, 200, 150, category.angle);
                return (
                  <line
                    key={index}
                    x1="200"
                    y1="200"
                    x2={endPoint.x}
                    y2={endPoint.y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    opacity={0.5}
                  />
                );
              })}

              {/* Skill proficiency area */}
              <path
                d={pathData}
                fill="black"
                fillOpacity="0.1"
                stroke="black"
                strokeWidth="2"
              />

              {/* Data points */}
              {radarPoints.map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="black"
                  className="cursor-pointer hover:r-6 transition-all"
                  onMouseEnter={() => setHoveredCategory(index)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              ))}

              {/* Category labels */}
              {skillCategories.map((category, index) => {
                const labelPoint = polarToCartesian(200, 200, 180, category.angle);
                const isLeft = labelPoint.x < 200;
                const isTop = labelPoint.y < 200;
                
                return (
                  <g key={index}>
                    <text
                      x={labelPoint.x}
                      y={labelPoint.y}
                      textAnchor={isLeft ? 'end' : 'start'}
                      dominantBaseline="middle"
                      className="text-sm font-bold fill-black cursor-pointer hover:fill-gray-600"
                      onMouseEnter={() => setHoveredCategory(index)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      {category.name}
                    </text>
                    
                    {/* Proficiency percentage */}
                    <text
                      x={labelPoint.x}
                      y={labelPoint.y + (isTop ? -15 : 15)}
                      textAnchor={isLeft ? 'end' : 'start'}
                      dominantBaseline="middle"
                      className="text-xs fill-gray-600"
                    >
                      {category.value}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Category Details */}
        {hoveredCategory !== null && (
          <div className="text-center mb-16">
            <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 font-poppins">
                {skillCategories[hoveredCategory].name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-black">
                  {skillCategories[hoveredCategory].value}%
                </span>
                <span className="text-gray-600 ml-2">Proficiency</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {skillCategories[hoveredCategory].skills.map((skill) => (
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

        {/* Skills Legend */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {skillCategories.map((category, index) => (
            <div 
              key={index}
              className="border border-gray-300 rounded-lg p-6 hover:border-black transition-colors cursor-pointer"
              onMouseEnter={() => setHoveredCategory(index)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">{category.name}</h3>
                <span className="text-2xl font-bold">{category.value}%</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
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