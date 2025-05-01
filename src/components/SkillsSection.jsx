import React from 'react';

export default function Skills() {
  return (
    <section className="flex font-poppins-bold flex-col lg:flex-row lg:items-start lg:space-x-12 h-auto max-w-7xl mx-auto px-4 py-6">
      {/* Left scrollable skills list */}
      <div className="overflow-y-auto w-full pr-0 md:pr-4">
        <h2 className="font-extrabold text-2xl sm:text-3xl md:text-[2.9vw] leading-tight border-t-2 pt-6 md:pt-[3vw] mt-6 md:mt-[3vw] mb-2">Frontend & UI Development</h2>
        <p className="text-base md:text-[1.2vw] mb-1">Core:</p>
        <div className="flex flex-wrap gap-2 md:gap-4 mb-4">
          {['HTML, CSS', 'TAILWIND CSS', 'REACT', 'JAVASCRIPT'].map((skill) => (
            <button
              key={skill}
              className="text-xs sm:text-sm md:text-[1vw] font-normal border border-gray-300 rounded-full py-1 md:py-2 px-3 md:px-6 whitespace-nowrap"
            >
              {skill}
            </button>
          ))}
        </div>

        <p className="text-base md:text-[1.2vw] mb-1">Animation & Interactivity:</p>
        <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
          {['GSAP', 'LOCOMOTIVE JS'].map((skill) => (
            <button
              key={skill}
              className="text-xs sm:text-sm md:text-[1vw] font-normal border border-gray-300 rounded-full py-1 md:py-2 px-3 md:px-6 whitespace-nowrap"
            >
              {skill}
            </button>
          ))}
        </div>

        <h2 className="font-extrabold text-2xl sm:text-3xl md:text-[2.9vw] border-t-2 pt-6 md:pt-[3vw] leading-tight mb-2">Backend, Programming & Databases</h2>
        <p className="text-base md:text-[1.2vw] mb-1">Backend Frameworks:</p>
        <div className="flex flex-wrap gap-2 md:gap-4 mb-4">
          {['NODE JS', 'EXPRESS', 'PHP'].map((tool) => (
            <button
              key={tool}
              className="text-xs sm:text-sm md:text-[1vw] font-normal border border-gray-300 rounded-full py-1 md:py-2 px-3 md:px-6 whitespace-nowrap"
            >
              {tool}
            </button>
          ))}
        </div>

        <p className="text-base md:text-[1.2vw] mb-1">Programming Languages:</p>
        <div className="flex flex-wrap gap-2 md:gap-4 mb-4">
          {['JAVA', 'C & C++', 'PYTHON'].map((lang) => (
            <button
              key={lang}
              className="text-xs sm:text-sm md:text-[1vw] font-normal border border-gray-300 rounded-full py-1 md:py-2 px-3 md:px-6 whitespace-nowrap"
            >
              {lang}
            </button>
          ))}
        </div>

        <p className="text-base md:text-[1.2vw] mb-1">Databases:</p>
        <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
          {['POSTGRESQL', 'MYSQL', 'SQLITE'].map((db) => (
            <button
              key={db}
              className="text-xs sm:text-sm md:text-[1vw] font-normal border border-gray-300 rounded-full py-1 md:py-2 px-3 md:px-6 whitespace-nowrap"
            >
              {db}
            </button>
          ))}
        </div>

        <h2 className="font-extrabold text-2xl sm:text-3xl md:text-[2.9vw] leading-tight mb-2 border-t-2 pt-6 md:pt-[3vw]">Tools & Platforms</h2>
        <p className="text-base md:text-[1.2vw] mb-1">CMS & E-Commerce:</p>
        <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
          {['WORDPRESS', 'WOOCOMMERCE'].map((cms) => (
            <button
              key={cms}
              className="text-xs sm:text-sm md:text-[1vw] font-normal border border-gray-300 rounded-full py-1 md:py-2 px-3 md:px-6 whitespace-nowrap"
            >
              {cms}
            </button>
          ))}
        </div>

        <p className="text-base md:text-[1.2vw] mb-1">Design Tools:</p>
        <div className="flex flex-wrap gap-2 md:gap-4">
          {['CANVA', 'FIGMA'].map((tool) => (
            <button
              key={tool}
              className="text-xs sm:text-sm md:text-[1vw] font-normal border border-gray-300 rounded-full py-1 md:py-2 px-3 md:px-6 mb-6 md:mb-[5vw] whitespace-nowrap"
            >
              {tool}
            </button>
          ))}
        </div>
      </div>

      {/* Right image - centered on mobile, sticky on desktop */}
      <div className="flex justify-center mt-6 lg:mt-0 lg:sticky lg:top-[30vh] lg:self-start">
        <img
          src="./images/skillsModel.png"
          alt="3D illustration of a person sitting on a blue beanbag chair looking at a phone"
          className="w-48 sm:w-64 md:w-72 lg:w-[30vw] h-auto object-contain"
        />
      </div>
    </section>
  );
}