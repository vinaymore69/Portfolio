import React, { useState } from 'react';

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState('frontend');

  const skillCategories = {
    frontend: {
      title: 'Frontend & UI',
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500',
      skills: [
        { name: 'HTML5', level: 'Expert', icon: '🌐' },
        { name: 'CSS3', level: 'Expert', icon: '🎨' },
        { name: 'JavaScript', level: 'Advanced', icon: '⚡' },
        { name: 'React.js', level: 'Advanced', icon: '⚛️' },
        { name: 'Tailwind CSS', level: 'Advanced', icon: '💨' },
        { name: 'GSAP', level: 'Intermediate', icon: '🎭' },
        { name: 'Locomotive JS', level: 'Intermediate', icon: '🚂' }
      ]
    },
    backend: {
      title: 'Backend & Server',
      color: 'from-green-500 to-emerald-500',
      borderColor: 'border-green-500',
      skills: [
        { name: 'Node.js', level: 'Advanced', icon: '🟢' },
        { name: 'Express.js', level: 'Advanced', icon: '🚀' },
        { name: 'PHP', level: 'Intermediate', icon: '🐘' },
        { name: 'RESTful APIs', level: 'Advanced', icon: '🔗' }
      ]
    },
    mobile: {
      title: 'Mobile Development',
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500',
      skills: [
        { name: 'Flutter', level: 'Advanced', icon: '📱' },
        { name: 'React Native', level: 'Intermediate', icon: '📲' },
        { name: 'iOS Development', level: 'Learning', icon: '🍎' }
      ]
    },
    programming: {
      title: 'Programming Languages',
      color: 'from-orange-500 to-red-500',
      borderColor: 'border-orange-500',
      skills: [
        { name: 'JavaScript', level: 'Expert', icon: '🟨' },
        { name: 'Java', level: 'Advanced', icon: '☕' },
        { name: 'Python', level: 'Intermediate', icon: '🐍' },
        { name: 'C/C++', level: 'Intermediate', icon: '⚙️' }
      ]
    },
    database: {
      title: 'Database & Storage',
      color: 'from-indigo-500 to-blue-600',
      borderColor: 'border-indigo-500',
      skills: [
        { name: 'PostgreSQL', level: 'Advanced', icon: '🐘' },
        { name: 'MySQL', level: 'Advanced', icon: '🗄️' },
        { name: 'SQLite', level: 'Intermediate', icon: '💾' },
        { name: 'Supabase', level: 'Advanced', icon: '⚡' }
      ]
    },
    tools: {
      title: 'Tools & Platforms',
      color: 'from-gray-600 to-gray-800',
      borderColor: 'border-gray-600',
      skills: [
        { name: 'WordPress', level: 'Advanced', icon: '📝' },
        { name: 'WooCommerce', level: 'Intermediate', icon: '🛒' },
        { name: 'Figma', level: 'Intermediate', icon: '🎨' },
        { name: 'Canva', level: 'Advanced', icon: '🖼️' },
        { name: 'Git', level: 'Advanced', icon: '📚' }
      ]
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert': return 'bg-green-100 text-green-800 border-green-300';
      case 'Advanced': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Learning': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <section className="min-h-screen max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 font-poppins bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Technical Skills
        </h1>
        <p className="text-xl text-gray-600 font-poppins-bold max-w-2xl mx-auto">
          Exploring the intersection of creativity and technology through diverse skill sets
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Category Navigation */}
        <div className="lg:w-1/4">
          <div className="sticky top-8">
            <h3 className="text-2xl font-bold mb-6 font-poppins">Categories</h3>
            <div className="space-y-3">
              {Object.entries(skillCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 border-2 ${
                    activeCategory === key
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                      : `bg-white hover:bg-gray-50 ${category.borderColor} text-gray-700 hover:shadow-md`
                  }`}
                >
                  <div className="font-semibold">{category.title}</div>
                  <div className="text-sm opacity-75">
                    {category.skills.length} skills
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Display */}
        <div className="lg:w-3/4">
          <div className="mb-8">
            <div className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${skillCategories[activeCategory].color} text-white shadow-lg`}>
              <h2 className="text-2xl font-bold font-poppins">
                {skillCategories[activeCategory].title}
              </h2>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {skillCategories[activeCategory].skills.map((skill, index) => (
              <div
                key={skill.name}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideUp 0.6s ease-out forwards'
                }}
              >
                {/* Skill Icon */}
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {skill.icon}
                </div>

                {/* Skill Name */}
                <h3 className="text-xl font-bold mb-3 font-poppins text-gray-800">
                  {skill.name}
                </h3>

                {/* Skill Level Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(skill.level)}`}>
                  {skill.level}
                </div>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${skillCategories[activeCategory].color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>

          {/* Decorative Elements */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <div className={`w-96 h-96 bg-gradient-to-r ${skillCategories[activeCategory].color} rounded-full blur-3xl`}></div>
            </div>
            
            {/* Stats */}
            <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {Object.values(skillCategories).reduce((total, cat) => total + cat.skills.length, 0)}
                  </div>
                  <div className="text-gray-600 font-medium">Total Skills</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {Object.values(skillCategories).reduce((total, cat) => 
                      total + cat.skills.filter(skill => skill.level === 'Expert').length, 0
                    )}
                  </div>
                  <div className="text-gray-600 font-medium">Expert Level</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {Object.values(skillCategories).reduce((total, cat) => 
                      total + cat.skills.filter(skill => skill.level === 'Advanced').length, 0
                    )}
                  </div>
                  <div className="text-gray-600 font-medium">Advanced</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">6</div>
                  <div className="text-gray-600 font-medium">Categories</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Character Image */}
      <div className="flex justify-center mt-16">
        <img
          src="./images/skillsModel.png"
          alt="3D illustration of a person with technical skills"
          className="w-64 md:w-80 h-auto object-contain opacity-80"
        />
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}