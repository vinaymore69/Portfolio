import React, { useState } from "react";

const projects = [
  {
    id: 1,
    title: "VPortfolinK",
    description: "An in-depth look at crafting and positioning your brand for maximum impact.",
    technologies: ["PHP", "MySQL", "Core HTML CSS JS", "GSAP"],
    link: "https://github.com/vinaymore69/V-PortfolinK",
  
    image: "images/PortfoLinK.png",
  },
  {
    id: 2,
    title: "SanChi",
    description: "Bringing brands to life through experiential and digital activations.",
    technologies: ["NodeJs", "Core HTML CSS JS", "GSAP", "Express", "PostGreSQL", "Botpress"],
    link: "https://vinaymore69.github.io/SanChi-UI2/",
    image: "/images/SanChi.png",
  },
  {
    id: 3,
    title: "V-Visit",
    description: "Building responsive, accessible, and performant websites from scratch.",
    technologies: ["React", "Tailwind CSS", "Node.js"],
    link: "https://github.com/vinaymore69/VisitingApplication",
    image: "/images/V_Visit.jpg",
  },
  {
    id: 4,
    title: "6SeasonsStudio",
    description: "Full-scale video production services from scripting to post-production.",
    technologies: ["WordPress"],
    link: "https://yourdomain.com/video-production",
    image: "/images/6SeasonsStudio.png",
  },
  {
    id: 5,
    title: "Event Furniture Rental Service",
    description: "Holistic marketing campaigns that span paid, owned, and earned channels.",
    technologies: ["SEO", "PPC", "Social Media"],
    link: "https://eventfurniture.rent/",
    image: "/images/eventfurniture.png",
  },
];

export default function HomeSection() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);

  // Find the hovered project data
  const hoveredProjectData = projects.find(proj => proj.id === hoveredProject);
  
  // Function to handle project selection and clear hover state
  const handleProjectClick = (projectId) => {
    setSelectedProject(projectId);
    setHoveredProject(null);
  };

  return (
    <main className="relative w-full overflow-hidden min-h-screen bg-white text-black">
      {/* Hover Preview Image - Hidden on mobile */}
      <div 
        className={`fixed left-1/2 transform -translate-x-1/2 top-10 z-10 transition-all duration-300 ease-in-out hidden md:block ${
          hoveredProject ? "opacity-100" : "opacity-0"
        }`}
        style={{ pointerEvents: "none" }}
      >
        {hoveredProjectData && (
          <img 
            src={hoveredProjectData.image} 
            alt={`${hoveredProjectData.title} preview`} 
            className="w-[60vw] md:w-[30vw] h-[50vh] md:h-[70vh] object-contain rounded-lg"
          />
        )}
      </div>

      {/* Initial Button Grid */}
      <div
        className={`max-w-7xl gap-6 md:gap-10 mx-auto px-4 md:px-6 py-6 md:py-10 relative min-h-[80vh] flex flex-col transition-transform duration-1000 ease-in-out ${
          selectedProject !== null ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <div className="mb-8 md:mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-2 font-poppins">My Projects</h1>
          <p className="font-poppins-bold text-sm">Learning From my Each project.</p>
        </div>

        {/* Main grid - now responsive */}
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="mb-6 md:mb-0">
            <img
              src="./images/projectsModel.png"
              alt="Project Illustration"
              lazyload="true"
              loading="lazy"
              className="w-42 md:w-[16vw] md:mt-[-4vw] h-auto object-cover rounded-lg"
            />
          </div>

          <div className="flex-1 w-full md:self-end md:mb-14 flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:gap-8">
              {/* First row - stacked on mobile, row-reverse on desktop */}
              <div className="flex flex-col md:flex-row-reverse gap-4 md:gap-8 justify-start items-stretch md:items-end">
                <button
                  onClick={() => handleProjectClick(1)}
                  onMouseEnter={() => setHoveredProject(1)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="border border-black rounded-full py-3 md:py-4 px-6 md:px-10 text-sm md:text-m font-poppins-bold flex justify-between items-center gap-4 md:gap-16 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
                >
                  VPortfolinK
                  <span className="ml-2 md:ml-4">→</span>
                </button>
                <button
                  onClick={() => handleProjectClick(2)}
                  onMouseEnter={() => setHoveredProject(2)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="border border-black rounded-full py-3 md:py-4 px-6 md:px-10 text-sm md:text-m font-poppins-bold flex justify-between items-center gap-4 md:gap-16 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
                >
                  SanChi
                  <span className="ml-2 md:ml-4">→</span>
                </button>
              </div>

              {/* Second row - stacked on mobile, row-reverse on desktop */}
              <div className="flex flex-col md:flex-row-reverse gap-4 md:gap-8 justify-start items-stretch md:items-end">
                <button
                  onClick={() => handleProjectClick(3)}
                  onMouseEnter={() => setHoveredProject(3)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="border w-full border-black rounded-full py-3 md:py-4 px-6 md:px-10 text-sm md:text-m font-poppins-bold flex justify-between items-center gap-4 md:gap-16 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
                >
                  V-Visit
                  <span className="ml-2 md:ml-4">→</span>
                </button>
                <button
                  onClick={() => handleProjectClick(4)}
                  onMouseEnter={() => setHoveredProject(4)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="border w-full border-black rounded-full py-3 md:py-4 px-6 md:px-10 text-sm md:text-m font-poppins-bold flex justify-between items-center gap-4 md:gap-16 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
                >
                  6SeasonsStudio
                  <span className="ml-2 md:ml-4">→</span>
                </button>
                <button
                  onClick={() => handleProjectClick(5)}
                  onMouseEnter={() => setHoveredProject(5)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="border w-full border-black rounded-full py-3 md:py-4 px-6 md:px-10 text-sm md:text-m font-poppins-bold flex justify-between items-center gap-4 md:gap-6 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
                >
                  Event Furniture
                  <span className="ml-2 md:ml-4">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Detail Sections */}
      {projects.map((proj, idx) => {
        const isActive = selectedProject === proj.id;
        const offscreen = idx % 2 === 0 ? "translate-x-full opacity-0" : "-translate-x-full opacity-0";
        const slideIn = isActive ? "translate-x-0 opacity-100" : offscreen;

        return (
          <div
            key={proj.id}
            className={`absolute inset-0 flex items-center justify-center px-4 md:px-6 py-6 md:py-10 transition-transform duration-1000 ease-in-out ${slideIn}`}
          >
            <div className="max-w-7xl rounded-2xl p-4 md:p-8 flex flex-col lg:flex-row gap-6 lg:gap-12">
              {/* Image Panel - Full width on mobile */}
              <div className="w-full lg:w-[33vw] h-auto md:h-[33vh] flex justify-center items-center">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full max-h-[40vh] md:max-h-[60vh] object-contain rounded-lg"
                />
              </div>

              {/* Text Panel */}
              <div className="w-full lg:w-1/2 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 font-poppins">
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {proj.title}
                    </a>
                  </h2>
                  <p className="mb-4 md:mb-6 text-base md:text-xl leading-relaxed font-poppins-bold">{proj.description}</p>
                  <p className="mb-6 text-sm md:text-lg font-poppins-bold">
                    <span className="font-semibold">Technologies:</span> {proj.technologies.join(", ")}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="self-start border border-black rounded-full py-2 md:py-3 px-6 md:px-8 text-sm md:text-m font-poppins-bold flex justify-between items-center gap-3 md:gap-5 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
                >
                  <span className="text-xl md:text-2xl">←</span>
                  Back
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </main>
  );
}